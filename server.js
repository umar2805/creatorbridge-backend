// CreatorBridge auth backend
//
// Implements the "Authorization Code" OAuth2 flow with Google:
//   1. Frontend redirects the browser to /auth/google/start?role=creator|editor
//   2. We redirect to Google's consent screen with a signed `state` param
//      (so we can verify the callback wasn't forged and remember the role).
//   3. Google redirects back to /auth/google/callback?code=...&state=...
//   4. We exchange the code for tokens server-side (using the client secret,
//      which never touches the browser) and verify the ID token.
//   5. We issue our own short-lived JWT in an HttpOnly cookie and redirect
//      the browser back to the frontend.
//   6. Frontend calls /auth/me (cookie sent automatically) to fetch the
//      logged-in user and render the right dashboard.
//
// No ID tokens or client secrets ever reach the browser's JS.

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN = '7d',
  FRONTEND_URL,
  EXTRA_ALLOWED_ORIGINS = '',
  PORT = 8787,
  NODE_ENV = 'development',
} = process.env;

// ── Sanity checks ──
const REQUIRED_VARS = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
  FRONTEND_URL,
};
for (const [key, val] of Object.entries(REQUIRED_VARS)) {
  if (!val) {
    console.error(`Missing required environment variable: ${key}`);
    console.error('Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
}

const isProd = NODE_ENV === 'production';

const oauthClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const app = express();

// ── CORS ──
// Allow the configured frontend origin(s) and send cookies cross-site.
const allowedOrigins = new Set(
  [FRONTEND_URL, ...EXTRA_ALLOWED_ORIGINS.split(',')]
    .map((o) => o.trim())
    .filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. curl, server-to-server)
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ── Helpers ──

const SESSION_COOKIE = 'cb_session';
const STATE_COOKIE = 'cb_oauth_state';

function signSession(user) {
  return jwt.sign(
    {
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd, // must be true in production (HTTPS) for SameSite=None
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

// CSRF protection for the OAuth flow: we generate a random `state`,
// sign it with role info, and store a copy in a short-lived cookie.
// On callback we check the cookie value matches the returned state.
function createOAuthState(role) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = { nonce, role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
  return token;
}

function verifyOAuthState(stateFromQuery, stateFromCookie) {
  if (!stateFromQuery || !stateFromCookie) return null;
  if (stateFromQuery !== stateFromCookie) return null;
  try {
    return jwt.verify(stateFromCookie, JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

// ── Routes ──

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Step 1: Frontend sends the browser here (full page navigation, not fetch).
// Example: <a href="https://api.example.com/auth/google/start?role=creator">
app.get('/auth/google/start', (req, res) => {
  const role = req.query.role === 'editor' ? 'editor' : 'creator';

  const state = createOAuthState(role);

  // Short-lived cookie to verify the state on callback (CSRF protection)
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes
    path: '/',
  });

  const authUrl = oauthClient.generateAuthUrl({
    access_type: 'online',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });

  res.redirect(authUrl);
});

// Step 2: Google redirects back here with ?code=...&state=...
app.get('/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const stateCookie = req.cookies[STATE_COOKIE];

  // Clear the one-time state cookie regardless of outcome
  res.clearCookie(STATE_COOKIE, { path: '/' });

  if (error) {
    return res.redirect(`${FRONTEND_URL}/?auth_error=${encodeURIComponent(error)}`);
  }

  const verifiedState = verifyOAuthState(state, stateCookie);
  if (!verifiedState) {
    return res.redirect(`${FRONTEND_URL}/?auth_error=invalid_state`);
  }

  const role = verifiedState.role === 'editor' ? 'editor' : 'creator';

  try {
    // Exchange the authorization code for tokens. This call uses the
    // client secret server-side - it never touches the browser.
    const { tokens } = await oauthClient.getToken({
      code,
      redirect_uri: GOOGLE_REDIRECT_URI,
    });

    if (!tokens.id_token) {
      throw new Error('No id_token returned from Google');
    }

    // Verify the ID token's signature, audience, issuer, and expiry.
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('ID token payload missing email');
    }

    const user = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture || '',
      role,
    };

    // In a real app: look up or create this user in your database here,
    // using payload.sub (Google's stable user ID) as the key.

    const sessionToken = signSession(user);
    setSessionCookie(res, sessionToken);

    return res.redirect(`${FRONTEND_URL}/?login=success&role=${user.role}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    return res.redirect(`${FRONTEND_URL}/?auth_error=token_exchange_failed`);
  }
});

// Returns the currently logged-in user based on the session cookie.
app.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Logout: clear the session cookie.
app.post('/auth/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`CreatorBridge auth backend listening on http://127.0.0.1:${PORT}`);
  console.log(`Frontend URL (CORS + redirects): ${FRONTEND_URL}`);
  console.log(`Google redirect URI: ${GOOGLE_REDIRECT_URI}`);
});
