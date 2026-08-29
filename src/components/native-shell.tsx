import { useEffect } from "react";

/**
 * Applies native-app chrome (status bar style, splash screen dismissal, safe areas)
 * when the web app is running inside the Capacitor iOS/Android shell.
 * No-ops in the browser.
 */
export function NativeShell() {
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform() || cancelled) return;

      document.documentElement.classList.add("is-native");

      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === "android") {
          await StatusBar.setBackgroundColor({ color: "#FBF9F5" });
        }
      } catch {
        /* status bar unavailable */
      }

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide();
      } catch {
        /* splash unavailable */
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
