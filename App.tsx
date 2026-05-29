import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import './global.css';
import './src/i18n';
import BusinessSetup from './src/screens/BusinessSetup';
import Details from './src/screens/Details';
import Interests from './src/screens/Interests';
import Landing from './src/screens/Landing';
import Language from './src/screens/Language';
import Login from './src/screens/Login';
import MainApp from './src/screens/MainApp';
import AllTemplatesScreen from './src/screens/AllTemplatesScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import DownloadHistoryScreen from './src/screens/DownloadHistoryScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HelpCenterScreen from './src/screens/HelpCenterScreen';
import OnboardingComplete from './src/screens/OnboardingComplete';
import ProfileScreen from './src/screens/ProfileScreen';
import Splash from './src/screens/Splash';
import Usage from './src/screens/Usage';
import { OnboardingProvider } from './src/onboarding/OnboardingContext';
import { UserProvider } from './src/context/UserContext';
import StateSelection from './src/screens/StateSelection';
import NotificationScreen from './src/screens/NotificationScreen';
import PosterDetailScreen from './src/screens/PosterDetailScreen';
import EditorScreen from './src/screens/EditorScreen';

const Stack = createNativeStackNavigator();

/**
 * App root — sets up navigation stack with all routes.
 * Flow: Splash → Landing → Login → Onboarding (Language → Usage → Details/BusinessSetup → Interests → StateSelection → OnboardingComplete) → MainApp (Drawer > BottomTabs)
 * Wrapped in OnboardingProvider (in-memory onboarding data) + UserProvider (persisted user data).
 */
export default function App() {
  return (
    <OnboardingProvider>
      {/* OnboardingProvider: temporary signup data; persisted only at OnboardingComplete */}
      <UserProvider>
        {/* UserProvider: name, phone, isPro, etc. loaded from / saved to AsyncStorage */}
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* ── STARTUP FLOW ── */}
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            {/* ── ONBOARDING (new users) ── */}
            <Stack.Screen name="Language" component={Language} />
            <Stack.Screen name="Usage" component={Usage} />
            <Stack.Screen name="BusinessSetup" component={BusinessSetup} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Interests" component={Interests} />
            <Stack.Screen name="StateSelection" component={StateSelection} />
            <Stack.Screen name="OnboardingComplete" component={OnboardingComplete} />
            {/* ── MAIN APP (after onboarding) ── */}
            <Stack.Screen name="MainApp" component={MainApp} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="AllTemplates" component={AllTemplatesScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="DownloadHistory" component={DownloadHistoryScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="PosterDetail" component={PosterDetailScreen} />
            <Stack.Screen name="PosterEditor" component={EditorScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </OnboardingProvider>
  );
}