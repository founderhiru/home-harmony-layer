import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.927b534672384ee69565cdaa75a6154b",
  appName: "Daylatch",
  webDir: "dist/client",
  server: {
    // Hot-reload from the Lovable sandbox while developing on device.
    // Remove this block (and re-sync) to ship a fully bundled build.
    url: "https://927b5346-7238-4ee6-9565-cdaa75a6154b.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#FBF9F5",
      showSpinner: false,
    },
  },
};

export default config;
