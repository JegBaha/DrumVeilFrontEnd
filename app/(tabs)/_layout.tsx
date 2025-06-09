import { MetalMania_400Regular, useFonts } from '@expo-google-fonts/metal-mania';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Custom tema tanımlıyoruz
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.neonRed, // Neon kırmızı
    background: '#1A1A1A', // Koyu metalik arka plan
    card: 'rgba(0, 0, 0, 0.8)', // Hafif şeffaf kartlar
    text: '#FFFFFF', // Beyaz metin
    border: 'rgba(255, 0, 0, 0.3)', // Neon kırmızı kenar
    notification: Colors.light.neonRed, // Bildirimler için neon kırmızı
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.neonRed, // Neon kırmızı
    background: '#0D0D0D', // Daha koyu metalik arka plan
    card: 'rgba(0, 0, 0, 0.9)', // Şeffaf kartlar
    text: '#FFFFFF', // Beyaz metin
    border: 'rgba(255, 0, 0, 0.4)', // Neon kırmızı kenar
    notification: Colors.dark.neonRed, // Bildirimler için neon kırmızı
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    MetalMania_400Regular,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? CustomDarkTheme.colors.background : CustomLightTheme.colors.background,
          },
          animation: Platform.OS === 'ios' ? 'fade' : 'fade_from_bottom', // Hafif animasyon
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'light'} // Neon kırmızı için açık stil
        backgroundColor={colorScheme === 'dark' ? '#0D0D0D' : '#1A1A1A'} // Koyu arka plan
      />
    </ThemeProvider>
  );
}