# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a


You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:


## Join the community

Join our community of developers creating universal apps.


# MyExpoApp — HR Attendance + Payroll Frontend

This workspace contains a React Native (Expo) mobile app and a Next.js web scaffold for the HR Attendance + Payroll system. It also includes a minimal Electron wrapper for desktop.

High level:
- Mobile app (Expo) located at project root — use `expo start` to run on Android/iOS/web.
- Web app (Next.js) located in `web-app/` — `npm install` + `npm run dev`.
- Desktop wrapper in `desktop/` is a minimal Electron loader (see folder README).

Set `API_BASE_URL` (mobile) or `NEXT_PUBLIC_API_BASE` (web) to point to your Spring Boot API base URL (e.g. `http://localhost:8080/api`).

What I added:
- `app/services/api.ts`: Axios client that attaches token from AsyncStorage.
- `app/contexts/AuthContext.tsx`: Auth provider for login/logout/profile.
- New tab screens in `app/(tabs)/`: `attendance.tsx`, `calendar.tsx`, `teams.tsx`, `payroll.tsx`, `profile.tsx`.
- Updated tab layout to include HR-specific tabs.
- `web-app/`: Minimal Next.js scaffold with API client and AuthContext.
- `desktop/`: Electron main script and instructions.

Next steps you may want me to do:
- Add full UI for holidays, notes, role-based guards, payslip PDF rendering, and i18n strings.
- Wire OTP authentication and registration flows against your backend endpoints.
