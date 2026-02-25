import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { PlannerProvider } from './src/context/PlannerContext';
import MainTabs from './src/navigation/MainTabs';
import SplashScreen from './src/screens/pulse/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import DiningScreen from './src/screens/DiningScreen';
import ExchangeScreen from './src/screens/ExchangeScreen';
import LinksScreen from './src/screens/LinksScreen';
import SafetyScreen from './src/screens/SafetyScreen';
import ParkingScreen from './src/screens/ParkingScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import LoginScreen from './src/screens/LoginScreen';

import { COLORS } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.aggieGold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlannerProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.gradientStart },
              headerTintColor: COLORS.aggieGold,
              headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            }}
          >
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AggieStack' }} />
            <Stack.Screen name="Dining" component={DiningScreen} options={{ title: 'Dining & Line Check' }} />
            <Stack.Screen name="Exchange" component={ExchangeScreen} options={{ title: 'Aggie Exchange' }} />
            <Stack.Screen name="Links" component={LinksScreen} options={{ title: 'Campus Links' }} />
            <Stack.Screen name="Safety" component={SafetyScreen} options={{ title: 'Safety' }} />
            <Stack.Screen name="Parking" component={ParkingScreen} options={{ title: 'Parking' }} />
            <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Library' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerBackTitle: 'Back' }} />
          </Stack.Navigator>
        </NavigationContainer>
        </PlannerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gradientStart },
});
