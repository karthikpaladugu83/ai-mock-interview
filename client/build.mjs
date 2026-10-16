import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

await build({
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
});
