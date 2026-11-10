# Souq Stories — app prototype

**Live web prototype:** https://darjan144.github.io/souq-stories-prototype/ (register with any number, code `1234`)

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

## How visits and purchases work
Each shop has **two printed QR codes that never change** (Profile → Demo tools → QR sheet):
- **Visit QR** at the stall front: small points (+5) and badges. Never coupons.
- **Purchase QR** at the owner's counter: scanned after tasting, haggling and agreeing a price. It creates a *pending* purchase. The owner gets a WhatsApp message and taps **Confirm sale**, optionally choosing a price band (under 20 / 20–50 / 50–100 / 100+ AED). Only confirmed purchases count (+25, +10 for a first purchase at a shop) and only they unlock coupons.

We measure the **act of buying through the app**, not exact money (prices are haggled, cash is common). Spend is estimated from optional price bands and reported with its coverage.
Coupons are never percentages: a **fixed amount off the agreed price** or a **gift with purchase**, chosen by the shop. Sponsor-funded amounts are reimbursed to the shop by bank transfer and shown in the owner's monthly summary.

## Web presentation layout
On a desktop browser (≥ 900 px wide) the prototype shows **two phones**: the customer app on the left and the **shop owner's WhatsApp** (bot chat) on the right, sharing live state. On phones and narrow screens only the customer app is shown, with "Owner confirms (demo)" buttons instead.

## Demo script (about 3 minutes, desktop web)
1. Register, then code `1234`.
2. **Explore**: tap a pin → *Meet the owner* → story preview → see the **taste and haggle** tips.
3. **Scan** tab → *Visit* at a stall → +5 and a badge (owner's chat shows the visit).
4. **Scan** → *Purchase* at the same stall → first time? → *Send to shop* → "Waiting for Abu Saeed".
5. In the **owner's WhatsApp** (right): pick a price band (optional) → *Confirm sale* → customer sees "Purchase confirmed!".
6. Demo tools → *Set Souq Week to 2/3* → one more purchase + confirm → Souq Week complete → AED 10 coupon.
7. Purchase at another shop choosing the coupon → owner confirms → owner's chat says the sponsor reimburses AED 10.
8. Reserve a **Souq Pick** → owner taps *Mark collected* → "You saved 2 kg of good food".
9. Owner taps *Monthly summary*. Customer: **Profile / Impact**.

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
