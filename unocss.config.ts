import presetIcons from "@unocss/preset-icons";
import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        "fa6-solid": () =>
          import("@iconify-json/fa6-solid/icons.json").then((i) => i.default),
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Roboto",
      },
    }),
  ],
  theme: {
    colors: {
      brand: {
        primary: "#dfc38a",
        secondary: "#322306",
        "accent-light": "#928569",
        "accent-dark": "#0d3d28",
      },
    },
  },
});
