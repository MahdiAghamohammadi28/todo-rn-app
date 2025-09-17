## Todo RN App (Expo + Supabase)

Cross‑platform todo app built with Expo Router and Supabase. It supports creating, updating and deleting todos, reminders with notifications, and persistent auth using Supabase.

### Tech stack

- Expo (React Native, Expo Router)
- Supabase (Auth + Database)
- AsyncStorage session persistence

## Quick start

1. Install dependencies

```bash
npm install
```

2. Configure environment variables (required)

Create a `.env.local` file in the project root and add your Supabase project credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

Notes:

- Both variables are required for the app to run. They are read in `lib/supabase.js` via `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_KEY`.
- The `EXPO_PUBLIC_` prefix makes these safe to expose to the client. Use your project’s anon/public key (not the service role key).

3. Start the app

```bash
npx expo start
```

Then press `a` for Android, `i` for iOS, or `w` for web. You can also scan the QR code with Expo Go.

## Supabase setup (summary)

1. Create a project at `https://supabase.com`.
2. Copy the project URL and the anon/public API key from Project Settings → API.
3. Create a `todos` table (or adapt to your schema) and ensure RLS policies allow read/write for authenticated users.
4. Enable Email/Password auth (or your preferred provider) in Authentication → Providers.

## Scripts

- `npm start` – start Metro with Expo
- `npm run android` – run on Android
- `npm run ios` – run on iOS simulator (macOS)
- `npm run web` – run in web
- `npm run lint` – lint the project

## Project structure (high level)

- `app/` – screens and routing (Expo Router)
- `components/` – shared UI components and modals
- `lib/supabase.js` – initialized Supabase client
- `assets/` – fonts and images

## Notifications & permissions

Reminders use notifications via `expo-notifications`. On first use, the app will request notification permissions on device/platforms that require it.

## Troubleshooting

- Missing env vars: ensure `.env.local` exists and includes both `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`, then restart the dev server.
- Android emulator on Windows: start Android Studio’s emulator before running `npx expo start`, or press `a` after Metro starts.
- iOS requires macOS with Xcode installed.

## License

MIT
