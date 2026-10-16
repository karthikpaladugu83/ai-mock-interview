import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

const server = await createServer({
  configFile: false,
  root,
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

await server.listen();
server.printUrls();
