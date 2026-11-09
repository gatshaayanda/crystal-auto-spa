import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
function read(relative) { return fs.readFileSync(path.join(root, relative), "utf8"); }
function exists(relative) { return fs.existsSync(path.join(root, relative)); }
function requireText(file, values) {
  const source = read(file);
  for (const value of values) if (!source.includes(value)) failures.push(file + " is missing " + value + ".");
}
function forbidText(file, values) {
  const source = read(file);
  for (const value of values) if (source.includes(value)) failures.push(file + " still contains " + value + ".");
}

const manifest = read("src/app/manifest.ts");
if (!manifest.includes("Crystal Auto Spa") || !manifest.includes('short_name: "Crystal Spa"')
  || manifest.includes("Big Brothers Car Wash") || manifest.includes("Vula's Car Wash") || manifest.includes("Iteration 13")) {
  failures.push("App manifest identity mismatch.");
}
for (const icon of ["crystal-auto-spa-icon-180.png", "crystal-auto-spa-icon-192.png", "crystal-auto-spa-icon-512.png"]) {
  if (!manifest.includes("/" + icon)) failures.push("Manifest is missing " + icon + ".");
}
for (const asset of ["public/crystal-auto-spa-icon.svg", "public/crystal-auto-spa-logo.svg", "scripts/generate-icons.mjs"]) {
  if (!exists(asset)) failures.push("Crystal Auto Spa brand asset is missing: " + asset);
}
requireText("src/app/layout.tsx", ["Crystal Auto Spa", "crystal-auto-spa.css", "PwaRegister", 'manifest: "/manifest.webmanifest"']);
requireText("src/app/crystal-auto-spa.css", ["--crystal-navy", "--crystal-blue", ".bb-cinema-primary-action"]);
requireText("src/app/pwa-register.tsx", ["beforeinstallprompt", "prompt.prompt()", "af-install-card", "af-install-close", "af-install-action"]);
requireText("src/app/pwa.css", [".af-install-card", ".af-install-close", ".af-install-action"]);
const sw = read("public/sw.js");
for (const value of ["crystal-auto-spa-shell-v1", "crystal-auto-spa-game-v1", "/offline", "__CRYSTAL_AUTO_SPA_FIREBASE_CONFIG__"]) {
  if (!sw.includes(value)) failures.push("Service worker is missing " + value + ".");
}
const cacheNames = ["CACHE_VERSION", "GAME_CACHE", "MEDIA_CACHE"].map(name => sw.match(new RegExp("const " + name + ' = "([^"]+)"'))?.[1] || "");
if (cacheNames.some(name => !name.startsWith("crystal-auto-spa-"))) failures.push("Service worker cache namespaces are not isolated to Crystal Auto Spa.");
if (sw.includes("__BIG_BROTHERS_FIREBASE_CONFIG__")) failures.push("Service worker still uses the inherited Firebase messaging config name.");

requireText("src/app/page.tsx", ["Crystal Auto Spa", "Join the walk-in queue", "bookings", "queueEntries", "fleetRequests", "syncOfflineRequests", 'const pendingKey = "crystal-auto-spa:offline-requests:v1";']);
requireText("src/lib/firebase/big-brothers-data.ts", ["subscribeBookings", "subscribeQueue", "subscribeFleet", "subscribeServices", "subscribeSettings"]);
requireText("firestore.rules", ["match /bookings/", "match /queueEntries/", "match /fleetRequests/", "function isAdmin()"]);
requireText("src/app/api/uploadthing/core.ts", ["createUploadthing", "readReceiptByToken", "requireBigBrothersStaff", "maxFileSize: \"4MB\"", "maxFileSize: \"16MB\""]);
for (const file of ["src/app/admin/big-brothers-dashboard.tsx", "src/app/account/page.tsx", "src/app/receipt/[token]/ReceiptView.tsx", "src/app/ServiceMediaPicker.tsx"]) {
  forbidText(file, ["firebase/storage", "uploadBytes(", "getDownloadURL("]);
}
for (const file of ["src/app/layout.tsx", "src/app/manifest.ts", "src/app/page.tsx", "src/app/account/page.tsx", "src/app/admin/big-brothers-dashboard.tsx", "src/app/receipt/[token]/ReceiptView.tsx", "src/app/pwa-register.tsx", "src/app/offline/page.tsx", "src/app/iphone-install/page.tsx"]) {
  forbidText(file, ["Big Brothers Car Wash", "Vula's Car Wash", "Iteration 13 | Service Studio"]);
}
if (exists(".firebaserc")) failures.push("Remove the inherited Firebase project binding before owner configuration.");
if (exists("storage.rules")) failures.push("Firebase Storage rules must not be part of this project; media uploads use UploadThing.");
if (read("firebase.json").includes('"storage"')) failures.push("Firebase CLI config still references Firebase Storage.");
if (read(".env.example").includes("vulas-car-wash") || read(".env.example").includes("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")) {
  failures.push("Environment template still references the inherited Firebase project or Storage.");
}
if (exists("public/manifest.webmanifest")) failures.push("Remove the stale public manifest so the Next.js manifest route is authoritative.");

if (failures.length) {
  console.error("CRYSTAL AUTO SPA IDENTITY / FOUNDATION VERIFICATION FAILED");
  failures.forEach(item => console.error(" - " + item));
  process.exit(1);
}
console.log("CRYSTAL AUTO SPA FOUNDATION VERIFIED — identity, UploadThing media path, Firestore rules, protected install lifecycle and isolated PWA caches are present.");
