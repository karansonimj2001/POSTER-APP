import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import MainApp from './src/screens/MainApp';
import Landing from './src/screens/Landing';
import Login from './src/screens/Login';
import Language from './src/screens/Language';
import Usage from './src/screens/Usage';
import Details from './src/screens/Details';
import BusinessSetup from './src/screens/BusinessSetup';
import Interests from './src/screens/Interests';
import StateSelection from './src/screens/StateSelection';
import OnboardingComplete from './src/screens/OnboardingComplete';
import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="Usage" component={Usage} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="BusinessSetup" component={BusinessSetup} />
        <Stack.Screen name="Interests" component={Interests} />
        <Stack.Screen name="StateSelection" component={StateSelection} />
        <Stack.Screen name="OnboardingComplete" component={OnboardingComplete} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
