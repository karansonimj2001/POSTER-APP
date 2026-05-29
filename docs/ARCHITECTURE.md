# Poster Maker App — Architecture Guide

## 📁 Directory Structure

```
App.tsx                          — Root: providers + stack navigator
src/
├── i18n/
│   ├── index.ts                 — i18next setup (en/hi), detectLanguage(), changeLanguage()
│   ├── en.json                  — English translations (564 lines)
│   └── hi.json                  — Hindi translations
├── navigation/
│   └── types.ts                 — RootStackParamList + useAppNavigation() hook
├── context/
│   └── UserContext.tsx          — UserData persisted to AsyncStorage
├── onboarding/
│   └── OnboardingContext.tsx     — Temporary onboarding data (in-memory)
├── screens/
│   ├── Splash.tsx               — Animated splash → checks onboarding → MainApp or Landing
│   ├── Landing.tsx              — Marketing page with auto-scroll cards → Login
│   ├── Login.tsx                — Phone + OTP (mock: 1234) → Language or MainApp
│   ├── Language.tsx             — Pick Hindi/English → saves to OnboardingContext
│   ├── Usage.tsx                — "For Myself" vs "For Business" → Details or BusinessSetup
│   ├── Details.tsx              — (myself flow) Name + photo → Interests
│   ├── BusinessSetup.tsx        — (business flow) Business name + logo → Interests
│   ├── Interests.tsx            — Select categories (Hindu, Muslim, etc.) → StateSelection
│   ├── StateSelection.tsx       — Pick Indian state → OnboardingComplete
│   ├── OnboardingComplete.tsx   — Summary → saves all data → MainApp
│   ├── MainApp.tsx              — Drawer (nav) > Tabs (Home, Templates, Profile)
│   ├── HomeScreen.tsx           — Home tab: search, AI assistant, recent/trending posters
│   ├── TemplatesScreen.tsx      — Templates tab: all templates + my posters grid
│   ├── ProfileScreen.tsx        — Profile tab: user info, settings, sign out
│   ├── EditorScreen.tsx         — Poster editor with 6 tool panels
│   ├── PosterDetailScreen.tsx   — Poster preview + AI assistant + actions
│   ├── AllTemplatesScreen.tsx   — Full template gallery (searchable, filterable)
│   ├── NotificationScreen.tsx   — Notification feed
│   ├── EditProfileScreen.tsx    — Edit name, phone, language, location, interests
│   ├── DownloadHistoryScreen.tsx— Download history with search + re-download
│   ├── ContactUsScreen.tsx      — Contact form (subject picker + message)
│   └── HelpCenterScreen.tsx     — FAQ accordion (searchable)
├── components/
│   ├── Icons.tsx                — 50+ SVG icon components (named exports)
│   ├── SvgIcon.tsx              — Map-based SVG: arrowRight, arrowLeft, lock, etc.
│   ├── BookmarkButton.tsx       — Bookmark toggle icon
│   ├── TemplateCard.tsx         — Reusable card with bookmark + action bar
│   ├── PosterPreviewCard.tsx    — White poster preview (avatar, name, role, footer)
│   ├── ActionButtonBar.tsx      — Download / Edit / Share / WhatsApp buttons
│   ├── AIInputBar.tsx           — AI prompt text input with send arrow
│   ├── AIResultCard.tsx         — AI-generated poster result with actions
│   ├── SearchDropdown.tsx       — Search dropdown with trending/history/spark
│   ├── SliderControl.tsx        — PanResponder slider (used in FilterPanel, BackgroundPanel)
│   ├── PrimaryButton.tsx        — Reusable purple button (not currently used)
│   ├── HeaderBar.tsx            — Reusable header with back button (not currently used)
│   ├── InputField.tsx           — Reusable text input (not currently used)
│   ├── AnimatedContainer.tsx    — Fade+slide animation wrapper (not currently used)
│   └── LockIcon.tsx             — Lock SVG (not currently used; use SvgIcon instead)
│   └── editor/
│       ├── EditorToolbar.tsx    — 6-tab horizontal toolbar
│       ├── AIGenPanel.tsx       — AI generation panel (prompt + generate)
│       ├── TextPanel.tsx        — Font selection, alignment, color presets, size slider
│       ├── PhotoPanel.tsx       — Photo upload, mask shapes, filters toggle
│       ├── StickersPanel.tsx    — Recent & popular emoji picker
│       ├── FilterPanel.tsx      — Filter thumbnails + intensity slider
│       └── BackgroundPanel.tsx  — Blur, opacity sliders + color picker
└── ... (assets, etc.)
```

## 🧭 Navigation Map

### App.tsx (NativeStackNavigator) — 19 screens

```
Splash
  │
  ├── [onboarding done] → MainApp
  └── [new user] → Landing
                      │
                      ↓ Login
                      │
         ┌────────────┴────────────┐
         │ [new user]              │ [existing user]
         ↓                         ↓
      Language                 MainApp (reset stack)
         ↓
      Usage
      ├── "For Myself" → Details
      └── "For Business" → BusinessSetup
                           ↓
                       Interests
                           ↓
                    StateSelection
                           ↓
                  OnboardingComplete
                           ↓
                       MainApp
```

### MainApp.tsx (Drawer → BottomTab)

```
Drawer.Navigator
├── Profile header (avatar, name, pro badge, streak)
├── Section: Main
│   ├── Home → HomeTab
│   ├── Templates → AllTemplates (screen)
│   └── Profile → ProfileTab
├── Section: Onboarding
│   ├── Business → EditProfile
│   ├── Language → EditProfile
│   ├── Help Center → HelpCenter
│   ├── Post Details → EditProfile
│   └── State → EditProfile
└── Footer: Sign Out → Landing
```

```
Tab.Navigator (BottomTabs)
├── HomeTab → HomeScreen
├── TemplatesTab → TemplatesScreen
└── ProfileTab → ProfileScreen
```

## 🔁 Data Flow

```
┌─────────────────────────────────────────────────────┐
│                  OnboardingContext                   │
│  (in-memory, fleeting during onboarding flow)        │
│  Set by: Language, Usage, Details/BusinessSetup,     │
│          Interests, StateSelection                   │
│  Read by: OnboardingComplete, MySelfReview*          │
│  *MySelfReview/BusinessReview files exist but        │
│   are NOT connected in navigation                    │
└──────────────────┬──────────────────────────────────┘
                   │ saved at OnboardingComplete
                   ↓
┌─────────────────────────────────────────────────────┐
│                  UserContext                          │
│  (persisted to AsyncStorage key 'user_data')          │
│  Read by: MainApp, HomeScreen, ProfileScreen,         │
│           EditProfileScreen                           │
│  Set by: OnboardingComplete, Login, EditProfileScreen │
└─────────────────────────────────────────────────────┘
```

### i18n Flow
```
AsyncStorage ['@app_language']
         │
         ↓
    detectLanguage() → i18next init
         │
         ├── 'hi' → Hindi translations (hi.json)
         └── 'en' → English translations (en.json)
         
    changeLanguage(lang) → writes to AsyncStorage + switches i18n
```

## ⚡ How to Add a New Screen

1. Create file in `src/screens/YourScreen.tsx`
2. Add route to `src/navigation/types.ts` (in `RootStackParamList`)
3. Register in `App.tsx`: `<Stack.Screen name="YourScreen" component={YourScreen} />`
4. Navigate using `useAppNavigation()`:
   ```ts
   import { useAppNavigation } from '../navigation/types'
   const navigation = useAppNavigation()
   navigation.navigate('YourScreen')
   ```

## 🔧 Utilities & Tools

| Tool | File | Description |
|---|---|---|
| i18n key validator | `scripts/check-i18n.js` | Run `node scripts/check-i18n.js` to verify all `t('...')` keys match `en.json` |
| TypeScript check | — | Run `npx tsc --noEmit` for type checking |
| Signed APK build | — | `cd android && gradlew assembleRelease` (keystore in `android/app/my-upload-key.keystore`) |

## 📝 Coding Conventions

- **State management**: React Context only (no Redux/Zustand)
- **Navigation**: `useAppNavigation()` from `src/navigation/types` replaces `useNavigation<any>()`
- **Translations**: All user-facing strings via `t('namespace.key')` from react-i18next
- **File exports**: Default export for screens, named exports for components where possible
- **Animations**: Prefer `AnimatedContainer` (fade + slide) for onboarding screens

## 🚫 Dead Code / TODO

| Item | Status |
|---|---|
| `src/screens/MySelfReview.tsx` | Unused — delete if not needed |
| `src/screens/BusinessReview.tsx` | Unused — delete if not needed |
| `src/components/testing2.html` | Deleted |
| `src/components/HeaderBar.tsx` | Exists but unused — screens have custom headers |
| `src/components/InputField.tsx` | Exists but unused — inline TextInput used instead |
| `src/components/PrimaryButton.tsx` | Exists but unused |
| `src/components/AnimatedContainer.tsx` | Exists but unused — onboarding screens have duplicated animation code |
| `src/components/LockIcon.tsx` | Prefer `SvgIcon name="lock"` instead |
| `TemplatesScreen.tsx` (1061 lines) | Should be split into AllTemplatesView + MyPostersView |
| `HomeScreen.tsx` (931 lines) | Should extract AI assistant + search section |
