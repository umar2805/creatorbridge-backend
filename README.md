# CreatorBridge Auth Backend

Express server that implements real Google OAuth2 (Authorization Code flow)
for the CreatorBridge frontend. Issues a JWT session in an HttpOnly cookie
after a successful login.

## How it works

1. Frontend "Continue with Google" button does a **full-page redirect** to
   `GET /auth/google/start?role=creator|editor`.
2. This server redirects the browser to Google's consent screen, with a
   signed `state` param (CSRF protection + remembers which role the user
   picked).
3. Google redirects back to `GET /auth/google/callback?code=...&state=...`.
4. This server exchanges the code for tokens **server-side** (using the
   client secret — never exposed to the browser), verifies the ID token,
   and issues its own JWT in an `HttpOnly` cookie.
5. Browser is redirected back to the frontend with `?login=success`.
6. Frontend calls `GET /auth/me` (cookie sent automatically) to get the
   logged-in user and shows the right dashboard.

No Google ID tokens or client secrets ever reach frontend JavaScript.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** of type **Web application**.
3. Under **Authorized redirect URIs**, add the exact callback URL(s) you'll use:
   - Local dev: `http://127.0.0.1:8787/auth/google/callback`
   - Production: `https://your-backend-host.com/auth/google/callback`
4. Copy the **Client ID** and **Client Secret**.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```ini
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8787/auth/google/callback

JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://127.0.0.1:5500
EXTRA_ALLOWED_ORIGINS=

PORT=8787
NODE_ENV=development
```

### 4. Run it

```bash
npm start
```

You should see:

```
CreatorBridge auth backend listening on http://127.0.0.1:8787
Frontend URL (CORS + redirects): http://127.0.0.1:5500
Google redirect URI: http://127.0.0.1:8787/auth/google/callback
```

### 5. Point the frontend at it

In `index.html`, find:

```js
const AUTH_API_BASE = 'http://127.0.0.1:8787';
```

Set this to wherever this backend is running.

## Deploying with GitHub Pages frontend

GitHub Pages can only serve static files — it cannot run this backend. Deploy
this server somewhere that runs Node (Render, Railway, Fly.io, a VPS, etc.),
then:

1. Set `FRONTEND_URL` to your GitHub Pages URL, e.g.
   `https://umar2805.github.io/PROJECT-SHUTDOWN-3`.
2. Set `GOOGLE_REDIRECT_URI` to your deployed backend's callback URL, e.g.
   `https://your-backend.onrender.com/auth/google/callback`, and add that
   exact URL to **Authorized redirect URIs** in Google Cloud Console.
3. Set `NODE_ENV=production` — this makes session cookies `Secure` and
   `SameSite=None`, which is **required** for cookies to work across two
   different sites (GitHub Pages + your backend host). This also means your
   backend **must** be served over HTTPS.
4. Update `AUTH_API_BASE` in `index.html` to your deployed backend URL.

## Notes / production considerations

- This demo signs a JWT directly from the verified Google profile. In a real
  app you'd look up or create a user record in your database keyed by
  `payload.sub` (Google's stable user ID), and put your own internal user ID
  in the session JWT instead of trusting Google's profile fields long-term.
- `access_type: 'online'` is used since this app doesn't need to call Google
  APIs on the user's behalf later. If you need offline access (e.g. background
  jobs), switch to `access_type: 'offline'` and store the refresh token
  server-side — never in a cookie.
- Rotate `JWT_SECRET` and treat `.env` as a secret; never commit it.
