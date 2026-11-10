# Souq Stories — app prototype

React Native (Expo SDK 58, TypeScript, Expo Router). Front-end only: mock data in `src/data`, progress stored on the device. The same code runs on phones (Expo Go) and on the web (GitHub Pages).

## Run it
```bash
npm install
npm run web        # browser, http://localhost:8081
npm start          # scan the QR with Expo Go (phone and laptop on the same Wi-Fi)
npx expo start --tunnel   # if the venue Wi-Fi blocks local connections
```
Register with any name and number; the OTP is any 4 digits (e.g. `1234`).

> Expo Go must support SDK 58. If the store version of Expo Go on a phone says the project is incompatible, update Expo Go or use the web build.

## Demo script (about 2 minutes)
1. Register, then enter code `1234`.
2. **Explore**: tap a pin on the Souq Al Jubail map → *Meet the owner*.
3. **Story**: tap play (placeholder preview with auto-subtitles) → story card collected.
4. Reserve an **Evening Souq Pick** → code appears in Wallet → *Shop confirms pickup* → "+25, you saved 1 kg of good food".
5. **Scan** the printed shop QR (Profile → Demo tools → QR sheet) or tap a demo scan → +10, badge, challenge progress.
6. Profile → Demo tools → *Set Souq Week to 2/3*, then scan another shop → challenge complete → coupon.
7. **Wallet** → coupon QR → *Simulate shop confirmation*.
8. **Profile / Impact**, then **Shop view** (owner dashboard with the sales uplift and the WhatsApp "post Souq Picks" mock).

## Where things live
| Path | What |
|---|---|
| `src/app/` | Screens (Expo Router). `(auth)` = welcome/register/login/OTP, `(tabs)` = Explore, Challenges, Scan, Wallet, Profile |
| `src/data/shops.ts` | The 8 fictional shops, coordinates, stories, **`youtubeId`** per shop |
| `src/data/content.ts` | Souq Picks, challenges, badges, coupons, leaderboard, shop-view stats |
| `src/game/rules.ts` | Points, levels, challenge progress, badge rules, impact maths |
| `src/store/` | Zustand stores (auth, game) persisted to AsyncStorage / localStorage |
| `src/strings.ts` | All UI copy (ready for Arabic later). Wording rule: never "surplus" |
| `src/components/SouqMap.tsx` / `.web.tsx` | react-native-maps on phones, Leaflet + OpenStreetMap on web |
| `src/components/StoryVideo.tsx` / `.web.tsx` | YouTube player, or the placeholder when `youtubeId` is empty |

## Adding a story video
Set `youtubeId` on a shop in `src/data/shops.ts` (the part after `v=` in a YouTube link). Unlisted videos work. Phones and the web build need internet to play it.

## Web build / GitHub Pages
```bash
EXPO_BASE_URL=/<repo-name> npm run export:web   # writes dist/ + 404.html fallback
node scripts/serve-dist.js /<repo-name> 8090     # preview it like Pages would
```
On Windows Git Bash, prefix the export with `MSYS_NO_PATHCONV=1` so the base path isn't rewritten.
`.github/workflows/deploy-web.yml` builds and deploys to GitHub Pages on every push to `main` (Pages source: "GitHub Actions").

## Checks
```bash
npx tsc --noEmit
```
