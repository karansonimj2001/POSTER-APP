# Curator (Poster Maker App) — Project Summary

## App Kya Hai?

React Native poster/meme creation app with dark theme, Indian market focus (Hindi/English, Indian states, festivals). Users create posters through templates ya AI assistant.

---

## 1. Folder Structure

```
D:\WORK\
├── App.tsx                  # Root: Navigation + OnboardingProvider
├── index.js                 # Entry point
├── theme.ts                 # Colors, Typography, Spacing, Shadows, Gradients
├── global.css               # Tailwind directives
├── tailwind.config.js       # NativeWind config
├── app.json                 # RN app config
│
├── src/
│   ├── screens/             # All screens (21 files)
│   │   ├── Splash.tsx
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Language.tsx
│   │   ├── Usage.tsx
│   │   ├── Details.tsx
│   │   ├── BusinessSetup.tsx
│   │   ├── Interests.tsx
│   │   ├── StateSelection.tsx
│   │   ├── OnboardingComplete.tsx
│   │   ├── MainApp.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TemplatesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── AllTemplatesScreen.tsx
│   │   ├── NotificationScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── DownloadHistoryScreen.tsx
│   │   ├── ContactUsScreen.tsx
│   │   ├── HelpCenterScreen.tsx
│   │   ├── MySelfReview.tsx          # ❌ Unused (removed from nav)
│   │   └── BusinessReview.tsx        # ❌ Unused (removed from nav)
│   │
│   ├── components/          # Reusable components (10 files)
│   │   ├── Icons.tsx        # ~30 SVG icon components
│   │   ├── SvgIcon.tsx      # String-keyed icon lookup
│   │   ├── AnimatedContainer.tsx  # Fade + slide-up wrapper
│   │   ├── HeaderBar.tsx    # Back button + title bar
│   │   ├── InputField.tsx   # Text input with error state
│   │   ├── PrimaryButton.tsx # Purple "Continue" button
│   │   ├── LockIcon.tsx     # Lock SVG icon
│   │   ├── AIInputBar.tsx   # AI prompt input bar
│   │   ├── AIResultCard.tsx # AI result display card
│   │   └── SearchDropdown.tsx  # Search suggestions overlay
│   │
│   ├── onboarding/
│   │   └── OnboardingContext.tsx  # Context: onboarding data storage
│   │
│   └── (no hooks/helpers/utils folder — all logic inline in screens)
│
├── android/                 # Native Android project
│   └── app/
│       ├── build.gradle     # Signing, SDK, Hermes config
│       ├── my-upload-key.keystore  # Release keystore
│       ├── debug.keystore   # Debug keystore
│       └── proguard-rules.pro
│
├── ios/                     # Native iOS project
├── app_ui/                  # Design mockups (HTML + screenshots)
└── assets/images/           # Images, icons, splash assets
```

---

## 2. Navigation Tree

```
App.tsx — NativeStackNavigator (headerShown: false)
│
├── Splash → Landing → Login → Language → Usage
│   ├── (myself)  → Details
│   └── (business) → BusinessSetup
│   → Interests → StateSelection → OnboardingComplete
│
├── MainApp (DrawerNavigator)
│   │
│   ├── Drawer Items:
│   │   NAVIGATION:
│   │   ├── Home Dashboard    → HomeTab
│   │   ├── Templates Library → AllTemplates (root stack)
│   │   └── My Profile        → ProfileTab
│   │   ONBOARDING & SETUP:
│   │   ├── Business Profile  → EditProfile
│   │   ├── Change Language   → EditProfile
│   │   ├── Help Center       → HelpCenter
│   │   ├── Post Details      → EditProfile
│   │   ├── Edit Interests    → Alert("Coming Soon")
│   │   └── State Selection   → EditProfile
│   │   FOOTER:
│   │   └── Sign Out / Login  → Clear storage → Landing
│   │
│   └── BottomTabNavigator (custom tab bar)
│       ├── HomeTab      → HomeScreen
│       ├── TemplatesTab → TemplatesScreen
│       └── ProfileTab   → ProfileScreen
│
├── Notifications           (from bell icon in HomeScreen)
├── AllTemplates            (from "View All" in HomeScreen/TemplatesScreen)
├── EditProfile             (from ProfileScreen menu / Drawer)
├── DownloadHistory         (from ProfileScreen menu)
├── ContactUs               (from ProfileScreen menu / Drawer)
└── HelpCenter              (from ProfileScreen menu / Drawer)
```

---

## 3. Onboarding Flow — Step by Step

| Step | Screen | Kya Hota Hai | Key Logic |
|------|--------|-------------|-----------|
| 0 | **Splash** | Logo + particles animation + progress bar | `AsyncStorage.getItem('onboardingDone')` check karta hai — agar true hai to directly `MainApp`, warna `Landing` |
| 1 | **Landing** | Marketing page with auto-scroll cards | "Get Started" button → `Login` |
| 2 | **Login** | Phone input + 4-digit OTP | OTP hardcoded "1234" hai. Agar `onboardingDone` hai to `MainApp`, warna `Language` |
| 3 | **Language** | Hindi / English select | `OnboardingContext` me language save karta hai |
| 4 | **Usage** | "For Myself" vs "For Business" | Branch logic: myself → `Details`, business → `BusinessSetup`. `OnboardingContext` me purpose save |
| 5a | **Details** | Photo + name input, live preview card | Profile ke liye name + photo. Preview card real-time update hota hai |
| 5b | **BusinessSetup** | Logo + business name, live business card | Business ke liye logo + name. Business card preview |
| 6 | **Interests** | Multi-select grid (Hindu, Muslim, Christian, Jain, Buddhist, Sikh, Other) | Religious/cultural interests. Array me save hote hain context me |
| 7 | **StateSelection** | Search states list, GPS simulation | Indian states ki list. GPS button simulated location deta hai. Context me save |
| 8 | **OnboardingComplete** | Summary of all choices | `AsyncStorage.setItem('onboardingDone', 'true')` → navigates to `MainApp` |

---

## 4. Screen-wise Logic (Post-Onboarding)

### HomeScreen.tsx — Main Dashboard
- **Streak banner**: Top par streak count + flame icon
- **Search box**: Type karte hi `SearchDropdown` dikhta hai (measureInWindow se position calculate)
- **Category pills**: Festival, Birthday, Business, Wedding, Quote, Premium
- **Highlights carousel**: Horizontal scrolling feature cards
- **Popular templates grid**: 2-column grid with template cards (SVG drawn)
- **Pro membership banner**: Upgrade CTA
- **AI Assistant FAB**: Bottom-left fixed button, 3-phase state machine:
  - `idle` → FAB visible
  - `input` → `AIInputBar` slide from left (translateX animation)
  - `result` → `AIResultCard` crossfade overlay (scale + opacity)
- KeyboardAvoidingView wraps content to push AI elements above keyboard

### TemplatesScreen.tsx — Templates + My Posters
- **All Templates tab**: Search, category filters (All/Festival/Morning/Quotes/Business/Premium), featured card, trending grid, upgrade banner
- **My Posters tab**: This week / Last month groups, bookmark toggle

### ProfileScreen.tsx — User Profile
- **Profile card**: Avatar, name, stats (Posters, Downloads), plan info
- **Menu items**: Download History, Language, Help & FAQ, Rate App, Share, Contact Us
- **Upgrade button**: Purple glow CTA for Pro membership
- Each menu item navigates to respective screen

### AllTemplatesScreen.tsx — Full Template Library
- Search bar + category pills
- SVG-drawn template cards in grid (2-column)
- Each card shows preview image, title, usage stats

### NotificationScreen.tsx — Notifications
- Grouped by Today / Yesterday
- Notification items with icons (StreakFlame, Share, Shield, etc.)
- "Mark all read" button

### EditProfileScreen.tsx — Edit Profile Form
- Fields: Name, Phone (disabled), Language (modal), State (modal), Business Name, WhatsApp
- All data saved to `OnboardingContext`

### DownloadHistoryScreen.tsx — Download History
- Grouped by Today / This Week
- Search + sort functionality
- Each card: preview, title, date, size, action buttons (Re-download, WhatsApp, Share)
- Upgrade banner at bottom

### ContactUsScreen.tsx — Contact Support
- 2-column support cards: WhatsApp chat, Email support
- Contact form: subject dropdown + message textarea + send button (purple glow)

### HelpCenterScreen.tsx — Help & FAQ
- Search bar for FAQ
- Tabs: Account, Designing, Payments
- Accordion-style Q&A (tap to expand/collapse)

---

## 5. AI Assistant Flow (HomeScreen)

```
Idle State (FAB visible)
  │
  ├── User taps FAB
  │   └── animateToInput():
  │       ├── fabScale → 0 (FAB shrinks)
  │       ├── inputSlide → 1 (bar slides from left)
  │       └── inputOpacity → 1 (bar fades in)
  │
  ├── Input State (AIInputBar visible)
  │   ├── User types prompt
  │   ├── User taps send / keyboard submit
  │   │   └── handleSubmit():
  │   │       ├── Keyboard.dismiss()
  │   │       └── animateToResult():
  │   │           ├── inputSlide → 0 (bar slides out)
  │   │           ├── backdropOpacity → 1 (backdrop appears)
  │   │           └── resultScale + resultOpacity → 1 (card crossfade)
  │   │
  │   └── Keyboard Handling:
  │       └── AIInputBar fixed at bottom: 98
  │       └── HomeScreen ka KeyboardAvoidingView wraps content
  │
  └── Result State (AIResultCard visible)
      ├── Shows mock AI-generated poster
      ├── Action buttons: Save, Edit, Share, WhatsApp
      ├── Close button → animateToIdle()
      └── Tap backdrop → animateToIdle()
          ├── resultScale → 0, resultOpacity → 0
          ├── backdropOpacity → 0
          └── fabScale → 1 (FAB reappears)
```

### Key Animation Files
- **AIInputBar.tsx**: `translateX` slide animation, `opacity` fade
- **AIResultCard.tsx**: `scale` zoom + `opacity` crossfade, `backdropOpacity` for overlay
- **HomeScreen.tsx**: Orchestrates all 3 anims with `Animated.parallel`

---

## 6. Components Library

| Component | File | Purpose |
|-----------|------|---------|
| `AnimatedContainer` | components/AnimatedContainer.tsx | Fade-in + slide-up wrapper (used in onboarding steps) |
| `HeaderBar` | components/HeaderBar.tsx | Top bar: back button + centered title |
| `Icons` | components/Icons.tsx | ~30 inline SVG components (Home, Search, Bell, Crown, Fire, Sparkles, Burger, etc.) |
| `SvgIcon` | components/SvgIcon.tsx | String-keyed icon lookup (arrowRight, arrowLeft, sparkle, fire, lock, check, cross, indiaFlag) |
| `InputField` | components/InputField.tsx | Reusable text input with error state, label, styling |
| `PrimaryButton` | components/PrimaryButton.tsx | Purple gradient "Continue" button with loading state |
| `LockIcon` | components/LockIcon.tsx | Standalone lock SVG |
| `AIInputBar` | components/AIInputBar.tsx | Animated input bar, fixed bottom positioning |
| `AIResultCard` | components/AIResultCard.tsx | Overlay card with mock result + action buttons |
| `SearchDropdown` | components/SearchDropdown.tsx | Recent searches, trending tags, categories grid |

---

## 7. Theme System (theme.ts)

```
Colors:
  ├── background:       #0D0D1A (dark base)
  ├── cardBackground:   #13132B
  ├── inputSurface:     #1A1A35
  ├── primaryAccent:    #7B2FFF (purple)
  ├── secondaryAccent:  #A855F7
  ├── highlightUrgent:  #F59E0B (gold)
  ├── textPrimary:      #F5F5FF
  ├── textSecondary:    #8888AA
  ├── successGreen:     #22C55E
  ├── dangerRed:        #EF4444
  └── ...faded variants

Typography: fontSize (xs 11px → 3xl 36px), fontWeight (Light → ExtraBold)
Spacing: xs 4px → xxxl 48px
Radius: xs 4px → full 9999
Shadows: card, subtle
Gradients: primaryAccent, backgroundDeep, urgentGold, successGreen, dangerRed
```

---

## 8. Android Build Setup

| Config | Value |
|--------|-------|
| packageName | `com.work` |
| compileSdk | 36 |
| targetSdk | 36 |
| minSdk | 24 |
| Gradle | 8.13 |
| AGP | 8.11.0 |
| Kotlin | 2.1.20 |
| NDK | 27.0.12077973 |
| Hermes | enabled |
| New Architecture | enabled |
| ABI filter | arm64-v8a only |

### Signing
- **Debug**: `android/app/debug.keystore` (password: android)
- **Release**: `android/app/my-upload-key.keystore` (password: posterapppassword, alias: my-key-alias)

### Build Commands
```
npx react-native run-android              # Debug install on device
cd android && ./gradlew assembleRelease   # Signed APK (output: app/build/outputs/apk/release/app-release.apk)
cd android && ./gradlew bundleRelease     # Signed AAB (output: app/build/outputs/bundle/release/app-release.aab)
```

---

## 9. Data Persistence

| Storage | Kaha Use Hua |
|---------|-------------|
| **AsyncStorage** | `onboardingDone` flag (Splash read, OnboardingComplete write, Drawer logout remove) |
| **OnboardingContext** | Full onboarding data: language, businessInfo, profileInfo, location, purpose, interests. EditProfileScreen bhi yahi use karta hai |
| **Local state** | All UI state (inputs, modals, animations, filters) inline `useState`/`useRef` |

---

## 10. Key Decisions & Notes

| Decision | Reason |
|----------|--------|
| MySelfReview / BusinessReview removed from nav | StateSelection → OnboardingComplete direct |
| Select Goals removed from drawer | Replaced with Help Center |
| AIInputBar fixed `bottom: 98`, no keyboard listeners | KeyboardAvoidingView in HomeScreen handles keyboard push |
| AIResultCard is overlay card (not full-screen) | Home content stays visible behind backdrop |
| SearchDropdown via measureInWindow | Positions exactly below search bar, overlays scroll content |
| Drawer "Templates Library" special-cased | Navigates to root stack AllTemplates (not TemplatesTab) |
| Tab icon background: `padding: 10, borderRadius: 999, overflow: hidden` | Perfect circular active background (not wide pill) |
| All screens use SafeAreaView | Notch/cutout safety |
| TypeScript: zero errors | Full type safety |
| No custom hooks | All logic inline in components |
| No react-native-vector-icons | All icons custom SVG components in Icons.tsx |
| OTP hardcoded "1234" | For demo/testing only |

---

## 11. Dependencies Summary

| Category | Libraries |
|----------|-----------|
| Navigation | `@react-navigation/native`, `native-stack`, `bottom-tabs`, `drawer`, `elements` |
| Animation | `react-native-reanimated` v4.3.1, `react-native-worklets` |
| Gesture | `react-native-gesture-handler` |
| Styling | `nativewind`, `tailwindcss` |
| SVG | `react-native-svg`, `react-native-svg-transformer` |
| Storage | `@react-native-async-storage/async-storage` |
| UI Safe | `react-native-safe-area-context`, `react-native-screens` |
| Core | `react` v19.1.0, `react-native` v0.81.5 |
