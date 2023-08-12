import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: { global: "window", "process.env": process.env },
  test: {
    environment: "jsdom"
  }
});
