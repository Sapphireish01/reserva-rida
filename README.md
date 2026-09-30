# reserva-rida 🚗💨

**reserva-rida** is the official mobile application built for riders on the rezarva carpooling and ride-sharing network. Designed for speed, clarity, and ease of use, reserva-rida empowers passengers to discover scheduled routes, book rides, manage booking requests, track upcoming trips, and connect with verified drivers.

---

## 🌟 Key Features

### 🚘 Ride Discovery & Route Search
* **Find Available Trips**: Search and discover upcoming trips by selecting pickup points, destinations, and dates.
* **Driver Profiles & Ratings**: Inspect driver details, star ratings, vehicle information, and reliability metrics.
* **One-Tap Booking**: Request seats on one-time or recurring routes with instant booking confirmations.

### 📩 Booking Management
* **Real-time Status Tracking**: View pending, confirmed, ongoing, and completed bookings.
* **Trip Details & In-Trip View**: Access route details, driver contact options, emergency SOS, and live ride progress.

### 🎨 Design & Accessibility
* **Curated Color System**: Full HSL color palette featuring Neutral, Slate, Success, Warning, Information, and Error tokens.
* **Custom Navigation**: Tailored bottom navigation bar featuring bespoke vector SVG icons and active state indicators.
* **Native Edge-to-Edge**: Android & iOS status bar padding and safe-area inset management for notch, punch hole, and dynamic island displays.

---

## 🛠️ Tech Stack & Architecture

* **Core Framework**: [React Native](https://reactnative.dev) (v0.81) with [Expo](https://expo.dev) (v54)
* **Navigation**: [React Navigation v7](https://reactnavigation.org) (Native Stack & Bottom Tabs)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query)
* **Forms & Validation**: [React Hook Form](https://react-hook-form.com) & [Zod](https://zod.dev)
* **Icons & Graphics**: [React Native SVG](https://github.com/software-mansion/react-native-svg)

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **npm** or **yarn**
* **Expo Go** app on your physical device, or an iOS Simulator / Android Emulator.

### Installation

1. **Clone the repository** (or navigate to the workspace directory):

   ```bash
   cd reserva-rider
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the Expo development server**:

   ```bash
   npx expo start
   ```

4. **Run on your target environment**:
   * Press `a` for **Android emulator**.
   * Press `i` for **iOS simulator**.
   * Scan the QR code using the **Expo Go** app on Android or Camera app on iOS.

---

## 📁 Project Structure

```text
├── app/                    # Expo Router layout & page routes
│   └── _layout.tsx         # Root layout, font loader & QueryClientProvider
├── assets/                 # SVGs, icons, onboarding illustrations
│   ├── icons/              # Custom navigation vector icons (bookings.svg, wallet.svg)
│   └── onboarding/         # Onboarding slide images
├── src/
│   ├── api/                # API client & domain service calls (auth, drivers, trips)
│   ├── components/         # Shared UI components (NavIcons, OTPCodeInput, PasswordRules)
│   ├── hooks/              # Custom React hooks (useSignupProgress, useCountdown)
│   ├── navigation/         # App routing (RootNavigator, AuthNavigator, MainNavigator, types)
│   ├── schemas/            # Zod validation schemas
│   ├── screens/
│   │   ├── auth/           # Onboarding & signup flow screens (SignUp, OTP, License, SSN)
│   │   └── main/           # Main driver app screens (Home, CreateTrip, PassengerRequests, Earnings)
│   ├── state/              # Global state stores (authStore)
│   └── theme/              # Design system tokens (palette, spacing, typography)
├── app.json                # Expo project configuration
└── index.js                # App entry point (expo-router/entry)
```
