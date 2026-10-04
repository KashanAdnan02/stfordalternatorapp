# ST Ford Alternator Expo app

This is an editable Expo reconstruction of the Android App Bundle in `1.aab`.
The bundle contained an Expo SDK 51 / React Native app, but not the original
TypeScript source, so the screens and their behavior have been recreated from
the compiled JavaScript and packaged app assets. A simple Express/Mongoose
authentication API is included in `backend/`.

## Run locally

```sh
npm install
npm start
```

Use the Expo terminal shortcuts to launch Android, iOS, or web. The app uses the
original ST Ford Alternator API by default, so serial-number validation requires
network access and a reachable backend.

Set `EXPO_PUBLIC_API_URL` to the deployed API base URL (including `/api`) when
building for another environment. Native builds store session tokens with
Expo SecureStore; web builds use browser storage.

## Local authentication API

Install and start MongoDB, then copy `backend/.env.example` to `backend/.env`
and set `MONGO_URI` and a private, long `JWT_SECRET`. Run the API from the
project root:

```sh
cd backend
npm install
npm run dev
```

The API listens on port `3000`. Available auth endpoints are
`POST /api/v1/user/register`, `POST /api/v1/user/login`, and
`POST /api/v1/user/me`. Engine lookup uses
`GET /api/v2/engine/:serialNumber` and returns the matching engine's
`serial_no`, `model`, `engine_name`, and `location` from the MongoDB
`engines` collection. Both profile and engine lookups require a Bearer token.

Set `CORS_ORIGINS` to a comma-separated list of trusted web origins for
browser clients. Requests without an `Origin` (such as native mobile clients)
remain supported. Configure `MONGO_URI` and a `JWT_SECRET` of at least 32 bytes
as deployment secrets; never commit `.env` files. The API applies security
headers, limits authentication attempts, and expects authenticated requests to
send `Authorization: Bearer <token>`. Authentication limiting is process-local;
on serverless or horizontally scaled deployments, also configure platform-level
rate limiting or a shared limiter store.

## Scripts

- `npm run android` — start Expo and open Android
- `npm run ios` — start Expo and open iOS
- `npm run web` — start the web version
- `npm run typecheck` — check TypeScript
