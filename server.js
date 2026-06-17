// CreatorBridge auth backend
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
const REQUIRED_VARS = { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET, FRONTEND_URL };
for (const [key, val] of Object.entries(REQUIRED_VARS)) {
  if (!val) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const isProd = NODE_ENV === 'production';

const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

const app = express();

// ── CORS ──
const allowedOrigins = new Set(
  [FRONTEND_URL, ...EXTRA_ALLOWED_ORIGINS.split(',')].map(o => o.trim()).filter(Boolean)
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// ── MongoDB ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection failed:', err); process.exit(1); });

const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  role:     String,
  verified: { type: Boolean, default: true },
  onboarding: {
    done:   { type: Boolean, default: false },
    name:   String,
    bio:    String,
    skills: [String],
    img:    String,
  },
});
const User = mongoose.model('User', userSchema);

// ── Helpers ──
const SESSION_COOKIE = 'cb_session';
const STATE_COOKIE   = 'cb_oauth_state';

function signSession(user) {
  return jwt.sign(
    { sub: user.sub, email: user.email, name: user.name, picture: user.picture || '', role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' });
}

function createOAuthState(role) {
  const nonce = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ nonce, role }, JWT_SECRET, { expiresIn: '10m' });
}

function verifyOAuthState(stateFromQuery, stateFromCookie) {
  if (!stateFromQuery || !stateFromCookie) return null;
  if (stateFromQuery !== stateFromCookie) return null;
  try { return jwt.verify(stateFromCookie, JWT_SECRET); } catch { return null; }
}

function requireAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
}

// ── Routes ──

app.get('/health', (req, res) => res.json({ ok: true }));

// Google OAuth start
app.get('/auth/google/start', (req, res) => {
  const role  = req.query.role === 'editor' ? 'editor' : 'creator';
  const state = createOAuthState(role);
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000, path: '/',
  });
  const authUrl = oauthClient.generateAuthUrl({
    access_type: 'online', scope: ['openid', 'email', 'profile'],
    state, prompt: 'select_account',
  });
  res.redirect(authUrl);
});

// Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const stateCookie = req.cookies[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: '/' });

  if (error) return res.redirect(`${FRONTEND_URL}/?auth_error=${encodeURIComponent(error)}`);

  const verifiedState = verifyOAuthState(state, stateCookie);
  if (!verifiedState) return res.redirect(`${FRONTEND_URL}/?auth_error=invalid_state`);

  const role = verifiedState.role === 'editor' ? 'editor' : 'creator';

  try {
    const { tokens } = await oauthClient.getToken({ code, redirect_uri: GOOGLE_REDIRECT_URI });
    if (!tokens.id_token) throw new Error('No id_token returned from Google');

    const ticket = await oauthClient.verifyIdToken({ idToken: tokens.id_token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('ID token payload missing email');

    const user = {
      sub:     payload.sub,
      email:   payload.email,
      name:    payload.name || payload.email,
      picture: payload.picture || '',
      role,
    };

    // Save Google user to MongoDB if they dont exist yet
    await User.findOneAndUpdate(
      { email: payload.email },
      { $setOnInsert: { name: payload.name || payload.email, email: payload.email, role, verified: true } },
      { upsert: true, new: true }
    );

    const sessionToken = signSession(user);
    setSessionCookie(res, sessionToken);

    return res.redirect(`${FRONTEND_URL}/?login=success&role=${user.role}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    return res.redirect(`${FRONTEND_URL}/?auth_error=token_exchange_failed`);
  }
});

// Get current session
app.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Logout
app.post('/auth/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

// ── Email/Password Auth ──

// Signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role, verified: true });

    res.json({ ok: true, message: 'Account created! You can now log in.' });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Step 1: validate credentials, return a short-lived one-time token
app.post('/auth/login/token', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    // 60-second one-time token just to carry login info to the redirect
    const oneTimeToken = jwt.sign(
      { sub: user._id.toString(), email: user.email, name: user.name, picture: '', role: user.role },
      JWT_SECRET,
      { expiresIn: '60s' }
    );

    res.json({ token: oneTimeToken });
  } catch (err) {
    console.error('Login token error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Step 2: browser navigates here, 7-day cookie gets set, redirects back like Google
app.get('/auth/login/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect(`${FRONTEND_URL}/?auth_error=missing_token`);

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const sessionToken = signSession(user);
    setSessionCookie(res, sessionToken);
    return res.redirect(`${FRONTEND_URL}/?login=success&role=${user.role}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch {
    return res.redirect(`${FRONTEND_URL}/?auth_error=invalid_token`);
  }
});

// Save onboarding profile
app.post('/auth/onboarding', requireAuth, async (req, res) => {
  try {
    const { name, bio, skills, img, done } = req.body;
    await User.findOneAndUpdate(
      { email: req.user.email },
      { onboarding: { done: done || true, bio, skills, img, name } }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Onboarding save error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get onboarding profile
app.get('/auth/onboarding', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ onboarding: user.onboarding || {} });
  } catch (err) {
    console.error('Onboarding fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`CreatorBridge auth backend listening on http://127.0.0.1:${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Google redirect URI: ${GOOGLE_REDIRECT_URI}`);
});
