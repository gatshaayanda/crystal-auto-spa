# Crystal Auto Spa

Mobile-first customer and staff experience for **Crystal Auto Spa** in **Mogoditshane, Botswana**.

The app is adapted from the selected Big Brothers Car Wash foundation. It retains the working customer, staff, booking, walk-in, account, receipt, notification, chatbot and PWA workflows while replacing the source business identity and infrastructure configuration.

## Customer experience
- Book a wash or submit a walk-in request.
- See active services and prices published by staff; unconfigured services/prices are not invented.
- Receive clear requested, pending, server-confirmed and offline-draft states.
- Use My Account for visit history, receipts and repeat bookings.
- Receive a secure walk-in ticket after the server confirms the queue entry. A ticket is not proof of a completed wash or payment.
- Prepare a WhatsApp handoff; the customer must press Send themselves.

## Staff experience
The protected `/admin` workspace retains bookings, queue, services, business settings, gallery, reviews, loyalty, racing activity and customer inbox operations. Staff authorization is enforced server-side and by Firestore rules. Service catalogue and prices are managed by staff; this repository does not seed unconfirmed business prices or hours.

## Technology and media
- Next.js 15, React 19 and TypeScript.
- Firebase Authentication and Firestore for identity and shared business records.
- **UploadThing for media uploads** (service media, gallery and consent-based customer submissions).
- PWA installation, public offline shell and optional racing practice.
- Vercel Analytics and Speed Insights.

Firebase Storage is not used. There is no `storage.rules` file or Firebase Storage deployment configuration. Firestore security rules and indexes remain separate.

## Owner-managed configuration
The app uses the recycled Atlas Firebase project/database from Ravi. The owner manages its Firebase console configuration and access. Copy `.env.example` to `.env.local` and provide the values below.

Required configuration includes:
- Public Firebase web config: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- Server Firebase service account JSON: `FIREBASE_ADMIN_KEY`; optionally set `FIREBASE_PROJECT_ID` if required by the owner's service-account setup.
- Staff sign-in and reminder secrets: `ADMIN_PASSWORD`, `CRYSTAL_AUTO_SPA_REMINDER_CRON_SECRET`.
- Media upload token: `UPLOADTHING_TOKEN`.
- Push notifications: `NEXT_PUBLIC_FIREBASE_VAPID_KEY` when configured.

Keep real values in local/deployment secret stores only. Do not commit credentials.

## Development

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run verify:identity
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

The build generates the Crystal Auto Spa PWA PNG icons and prepares the inherited racing assets. Build success does not prove Firebase configuration, UploadThing credentials, live notifications, WhatsApp handoff, physical-device installation or deployment.

## Protected behavior
Read [AGENTS.md](./AGENTS.md) before changing the application. Preserve the native PWA installation lifecycle, offline privacy boundaries, chatbot behavior, customer ownership, staff authorization, receipt expiry and racing mechanics. The actual Iteration 13 visual reference is `gatshaayanda/iteration13/docs/assets/washride-home-reference.jpeg`; use it for visual quality and compactness, not for WashRide branding.

## Release checkpoint
After a push to `main`, verify GitHub checks and Vercel deployment independently. A push requests a build; it does not prove deployment.
