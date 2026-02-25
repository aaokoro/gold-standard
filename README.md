# AggieStack

A **student life dashboard** for NCAT that combines official campus links with crowdsourced data: line checks, Aggie Exchange board, and one-tap safety.

- **Live-Link Dashboard** — Deep links to Aggie Hub, Blackboard, OrgSync, Dining Menus
- **Crowdsourced Line Check** — Upvote/downvote for Williams Dining Hall & Chick-fil-A; shows % “line is long” in last 30 minutes
- **Aggie Exchange** — Digital corkboard for items for sale or study groups (Firebase Firestore); post requires @aggies.ncat.edu login
- **Campus Emergency** — One-tap call to UPD (24hr) or Aggie Escort (Safe Ride)

## Tech Stack

- **React Native (Expo)** — Single codebase for iOS and Android
- **Firebase** — Firestore, Auth (Email/Password); Cloud Functions for cleanup
- **Theme** — Aggie Blue `#004684`, Aggie Gold `#FDB927`

## Quick Start

### Run without Firebase (demo mode)

The app works **fully without any config**: Line Check and Exchange use in-memory data for the session. Safety and Links work as usual.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go or press `i` / `a` for simulator. Use any `@aggies.ncat.edu` email on the Login screen to post on the Exchange (no password in demo mode).

### Run with Firebase (production)

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com).
2. **Enable Firestore** (Create database → Start in test mode, then deploy rules below).
3. **Enable Authentication** → Sign-in method → Email/Password.
4. **Get config**: Project settings → General → Your apps → copy the config. Create `.env` in the project root:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   EXPO_PUBLIC_FIREBASE_APP_ID=...
   ```
5. **Deploy Firestore rules and indexes**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <your-project-id>
   firebase deploy --only firestore
   ```
6. **Deploy Cloud Function** (deletes reports older than 1 hour, every 30 min)
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
7. **Run the app**
   ```bash
   npx expo start
   ```
   Users sign in with their @aggies.ncat.edu email and a password (create account once); only then can they post on the Exchange.

## Firestore Data Model

- **`reports`** — Line check votes: `locationName`, `isLong`, `timestamp`. Only last 30 minutes are shown; Cloud Function deletes docs older than 1 hour.
- **`exchange`** — Posts: `title`, `body`, `type`, `contact`, `timestamp`. Writes require auth with an @aggies.ncat.edu email.

## Safety Numbers (in app)

- **UPD** — 336-334-7675 (24-hour emergency)
- **Aggie Escort** — 336-285-2530 (Sun–Fri 6pm–2am; on-campus only after 11pm)

## License

MIT.
