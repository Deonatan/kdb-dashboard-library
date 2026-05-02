import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@kdb-dashboard-library/finance-ui/theme.css',
        replacement: fileURLToPath(
          new URL('../../packages/finance-ui/src/theme.css', import.meta.url),
        ),
      },
      {
        find: '@kdb-dashboard-library/finance-ui',
        replacement: fileURLToPath(
          new URL('../../packages/finance-ui/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@kdb-dashboard-library/protocol',
        replacement: fileURLToPath(
          new URL('../../packages/protocol/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@kdb-dashboard-library/react-client',
        replacement: fileURLToPath(
          new URL('../../packages/react-client/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
})
