import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Allows testing AR on a phone over local network (HTTPS needed for WebXR on real devices)
    host: true,
  },
});
