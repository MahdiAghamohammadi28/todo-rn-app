import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [loaded, error] = useFonts({
    "poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "poppins-black": require("../assets/fonts/Poppins-Black.ttf"),
    "poppins-light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setIsSessionLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isOnAuth = useMemo(() => {
    const current = pathname ?? "";
    return current.startsWith("/login") || current.startsWith("/signup");
  }, [pathname]);

  useEffect(() => {
    if (isSessionLoading) return;
    // If the user IS authenticated and currently on an auth screen, move them to the app
    if (session && isOnAuth) {
      router.replace("/(tabs)");
      return;
    }
    // If the user is NOT authenticated and is outside auth screens, send them to login
    if (!session && !isOnAuth) {
      router.replace("/login");
    }
  }, [session, isOnAuth, isSessionLoading, router]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const shouldRenderUI = loaded || error;

  return (
    <>
      {shouldRenderUI ? (
        <>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      ) : null}
    </>
  );
}
