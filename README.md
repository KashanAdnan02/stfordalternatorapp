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
`engines` collection.

## Scripts

- `npm run android` — start Expo and open Android
- `npm run ios` — start Expo and open iOS
- `npm run web` — start the web version
- `npm run typecheck` — check TypeScript
