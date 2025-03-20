import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // server: {
  //   proxy: {
  //     "/api": import.meta.env.VITE_BASE_URL as string, // Adjust based on your backend port
  //   },
  // },
});
