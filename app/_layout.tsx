import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store';
import {Text} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              href: '/',
              headerShown: false,
              tabBarLabel: 'Home',
              tabBarIcon: () => <Text>🏠</Text>,
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              href: '/map',
              headerShown: false,
              tabBarLabel: 'Map',
              tabBarIcon: () => <Text>📍</Text>,
            }}
          />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}