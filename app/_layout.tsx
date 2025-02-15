import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import "../globals.css";
import { LoadingWrapper } from "@/components";
import { useMomentLocale } from "@/hooks/useMomentLocale";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useMomentLocale("vi");
  const { ANIMATION_NAVIGATE_STACK, THEME_COLOR, CONDITION } = COMMON_CONSTANT;
  const { COMMON, TABS, SPLASH, AUTH } = PATH_NAME;
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <LoadingWrapper>
        <ThemeProvider
          value={colorScheme === THEME_COLOR.DARK ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: CONDITION.FALSE,
              animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_RIGHT,
            }}
          >
            <Stack.Screen name={SPLASH.SPLASH_SCREEN} />
            <Stack.Screen name={TABS.TABS_NAVIGATOR} />
            <Stack.Screen name={AUTH.AUTH_NAVIGATOR} />
            <Stack.Screen name={COMMON.ERROR_PAGE} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </LoadingWrapper>
    </Provider>
  );
}
