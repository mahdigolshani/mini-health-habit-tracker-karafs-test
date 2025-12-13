import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import {viteCommonjs} from '@originjs/vite-plugin-commonjs';
import {VitePWA} from 'vite-plugin-pwa';
import reactNativeWeb from 'vite-plugin-react-native-web';

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
  '.mjs',
  '.svg',
];

export default defineConfig(({mode}) => {
  return {
    optimizeDeps: {
      include: [],
      esbuildOptions: {
        loader: {'.js': 'jsx'},
        jsx: 'automatic',
        mainFields: ['module', 'main'],
        resolveExtensions: [
          '.web.js',
          '.js',
          '.web.ts',
          '.ts',
          '.web.tsx',
          '.tsx',
        ],
      },
    },
    resolve: {
      extensions,
    },
    plugins: [
      viteCommonjs(),
      react(),
      reactNativeWeb(),
      tsconfigPaths(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          cleanupOutdatedCaches: true,
        },
        srcDir: 'web',
        filename: 'service-worker.ts',
        strategies: 'injectManifest',
        injectManifest: {
          injectionPoint: undefined,
          globPatterns: ['**/*.{png,svg}'],
          globIgnores: ['**/service-worker.ts'],
        },
        devOptions: {
          enabled: true,
          /* other options */
        },
        manifest: {
          name: 'Karafs',
          short_name: 'Karafs',
          theme_color: 'green',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          background_color: '#FFFFFF',
          icons: [],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        input: {
          app: './index.html',
        },
        output: {
          manualChunks: (id: string) => {
            if (!id.includes('node_modules')) return 'app';
            if (
              id.includes('flash-list') ||
              id.includes('recyclerlistview') ||
              id.includes('@shopify')
            ) {
              return 'flashListGroup';
            }
            if (id.includes('victory')) return 'victory';
            if (id.includes('react-navigation')) return 'rnNav';
            if (id.includes('react-native')) return 'rn';
            return 'vendor';
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    ...(mode === 'development'
      ? {
          server: {
            watch: {
              usePolling: true,
            },
            fs: {
              strict: false,
              allow: ['node_modules'],
            },
          },
        }
      : {}),
  };
});
