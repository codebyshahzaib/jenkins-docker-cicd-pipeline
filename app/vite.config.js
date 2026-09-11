import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: Number(env.VITE_PORT || 5173),
      proxy: {
        [env.VITE_API_BASE_URL || '/api']: env.VITE_DEV_API_TARGET || 'http://localhost:3001'
      }
    }
  };
});