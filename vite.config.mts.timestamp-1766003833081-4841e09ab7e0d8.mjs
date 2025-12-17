// vite.config.mts
import { defineConfig } from "file:///C:/linkap/karafs/node_modules/vite/dist/node/index.js";
import react from "file:///C:/linkap/karafs/node_modules/@vitejs/plugin-react-swc/index.mjs";
import tsconfigPaths from "file:///C:/linkap/karafs/node_modules/vite-tsconfig-paths/dist/index.js";
import { viteCommonjs } from "file:///C:/linkap/karafs/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
import { VitePWA } from "file:///C:/linkap/karafs/node_modules/vite-plugin-pwa/dist/index.js";
import reactNativeWeb from "file:///C:/linkap/karafs/node_modules/vite-plugin-react-native-web/dist/es/index.js";
var extensions = [
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".css",
  ".json",
  ".mjs",
  ".svg"
];
var vite_config_default = defineConfig(({ mode }) => {
  return {
    optimizeDeps: {
      include: [],
      esbuildOptions: {
        loader: { ".js": "jsx" },
        jsx: "automatic",
        mainFields: ["module", "main"],
        resolveExtensions: [
          ".web.js",
          ".js",
          ".web.ts",
          ".ts",
          ".web.tsx",
          ".tsx"
        ]
      }
    },
    resolve: {
      extensions
    },
    plugins: [
      viteCommonjs(),
      react(),
      reactNativeWeb(),
      tsconfigPaths(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          cleanupOutdatedCaches: true
        },
        srcDir: "web",
        filename: "service-worker.ts",
        strategies: "injectManifest",
        injectManifest: {
          injectionPoint: void 0,
          globPatterns: ["**/*.{png,svg}"],
          globIgnores: ["**/service-worker.ts"]
        },
        devOptions: {
          enabled: true
          /* other options */
        },
        manifest: {
          name: "Karafs",
          short_name: "Karafs",
          theme_color: "green",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          background_color: "#FFFFFF",
          icons: []
        }
      })
    ],
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        input: {
          app: "./index.html"
        },
        output: {
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return "app";
            if (id.includes("flash-list") || id.includes("recyclerlistview") || id.includes("@shopify")) {
              return "flashListGroup";
            }
            if (id.includes("victory")) return "victory";
            if (id.includes("react-navigation")) return "rnNav";
            if (id.includes("react-native")) return "rn";
            return "vendor";
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    ...mode === "development" ? {
      server: {
        watch: {
          usePolling: true
        },
        fs: {
          strict: false,
          allow: ["node_modules"]
        }
      }
    } : {}
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcbGlua2FwXFxcXGthcmFmc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcbGlua2FwXFxcXGthcmFmc1xcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2xpbmthcC9rYXJhZnMvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWcsIGxvYWRFbnZ9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB7dml0ZUNvbW1vbmpzfSBmcm9tICdAb3JpZ2luanMvdml0ZS1wbHVnaW4tY29tbW9uanMnO1xyXG5pbXBvcnQge1ZpdGVQV0F9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcbmltcG9ydCByZWFjdE5hdGl2ZVdlYiBmcm9tICd2aXRlLXBsdWdpbi1yZWFjdC1uYXRpdmUtd2ViJztcclxuXHJcbmNvbnN0IGV4dGVuc2lvbnMgPSBbXHJcbiAgJy53ZWIudHN4JyxcclxuICAnLnRzeCcsXHJcbiAgJy53ZWIudHMnLFxyXG4gICcudHMnLFxyXG4gICcud2ViLmpzeCcsXHJcbiAgJy5qc3gnLFxyXG4gICcud2ViLmpzJyxcclxuICAnLmpzJyxcclxuICAnLmNzcycsXHJcbiAgJy5qc29uJyxcclxuICAnLm1qcycsXHJcbiAgJy5zdmcnLFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7bW9kZX0pID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFtdLFxyXG4gICAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICAgIGxvYWRlcjogeycuanMnOiAnanN4J30sXHJcbiAgICAgICAganN4OiAnYXV0b21hdGljJyxcclxuICAgICAgICBtYWluRmllbGRzOiBbJ21vZHVsZScsICdtYWluJ10sXHJcbiAgICAgICAgcmVzb2x2ZUV4dGVuc2lvbnM6IFtcclxuICAgICAgICAgICcud2ViLmpzJyxcclxuICAgICAgICAgICcuanMnLFxyXG4gICAgICAgICAgJy53ZWIudHMnLFxyXG4gICAgICAgICAgJy50cycsXHJcbiAgICAgICAgICAnLndlYi50c3gnLFxyXG4gICAgICAgICAgJy50c3gnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBleHRlbnNpb25zLFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdml0ZUNvbW1vbmpzKCksXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIHJlYWN0TmF0aXZlV2ViKCksXHJcbiAgICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3JjRGlyOiAnd2ViJyxcclxuICAgICAgICBmaWxlbmFtZTogJ3NlcnZpY2Utd29ya2VyLnRzJyxcclxuICAgICAgICBzdHJhdGVnaWVzOiAnaW5qZWN0TWFuaWZlc3QnLFxyXG4gICAgICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgICAgICBpbmplY3Rpb25Qb2ludDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue3BuZyxzdmd9J10sXHJcbiAgICAgICAgICBnbG9iSWdub3JlczogWycqKi9zZXJ2aWNlLXdvcmtlci50cyddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgIC8qIG90aGVyIG9wdGlvbnMgKi9cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgICBuYW1lOiAnS2FyYWZzJyxcclxuICAgICAgICAgIHNob3J0X25hbWU6ICdLYXJhZnMnLFxyXG4gICAgICAgICAgdGhlbWVfY29sb3I6ICdncmVlbicsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXHJcbiAgICAgICAgICBvcmllbnRhdGlvbjogJ3BvcnRyYWl0JyxcclxuICAgICAgICAgIHNjb3BlOiAnLycsXHJcbiAgICAgICAgICBzdGFydF91cmw6ICcvJyxcclxuICAgICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjRkZGRkZGJyxcclxuICAgICAgICAgIGljb25zOiBbXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDUwMCxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgICBhcHA6ICcuL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSByZXR1cm4gJ2FwcCc7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnZmxhc2gtbGlzdCcpIHx8XHJcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ3JlY3ljbGVybGlzdHZpZXcnKSB8fFxyXG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdAc2hvcGlmeScpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnZmxhc2hMaXN0R3JvdXAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndmljdG9yeScpKSByZXR1cm4gJ3ZpY3RvcnknO1xyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LW5hdmlnYXRpb24nKSkgcmV0dXJuICdybk5hdic7XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QtbmF0aXZlJykpIHJldHVybiAncm4nO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xyXG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC4uLihtb2RlID09PSAnZGV2ZWxvcG1lbnQnXHJcbiAgICAgID8ge1xyXG4gICAgICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgICAgIHdhdGNoOiB7XHJcbiAgICAgICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnM6IHtcclxuICAgICAgICAgICAgICBzdHJpY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGFsbG93OiBbJ25vZGVfbW9kdWxlcyddLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XHJcbiAgICAgIDoge30pLFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBPLFNBQVEsb0JBQTRCO0FBQzlRLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFRLG9CQUFtQjtBQUMzQixTQUFRLGVBQWM7QUFDdEIsT0FBTyxvQkFBb0I7QUFFM0IsSUFBTSxhQUFhO0FBQUEsRUFDakI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBQyxLQUFJLE1BQU07QUFDdEMsU0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDO0FBQUEsTUFDVixnQkFBZ0I7QUFBQSxRQUNkLFFBQVEsRUFBQyxPQUFPLE1BQUs7QUFBQSxRQUNyQixLQUFLO0FBQUEsUUFDTCxZQUFZLENBQUMsVUFBVSxNQUFNO0FBQUEsUUFDN0IsbUJBQW1CO0FBQUEsVUFDakI7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxhQUFhO0FBQUEsTUFDYixNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUEsTUFDZixjQUFjO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsUUFDZCxTQUFTO0FBQUEsVUFDUCx1QkFBdUI7QUFBQSxRQUN6QjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osZ0JBQWdCO0FBQUEsVUFDZCxnQkFBZ0I7QUFBQSxVQUNoQixjQUFjLENBQUMsZ0JBQWdCO0FBQUEsVUFDL0IsYUFBYSxDQUFDLHNCQUFzQjtBQUFBLFFBQ3RDO0FBQUEsUUFDQSxZQUFZO0FBQUEsVUFDVixTQUFTO0FBQUE7QUFBQSxRQUVYO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDUixNQUFNO0FBQUEsVUFDTixZQUFZO0FBQUEsVUFDWixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsVUFDVCxhQUFhO0FBQUEsVUFDYixPQUFPO0FBQUEsVUFDUCxXQUFXO0FBQUEsVUFDWCxrQkFBa0I7QUFBQSxVQUNsQixPQUFPLENBQUM7QUFBQSxRQUNWO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUEsTUFDdkIsZUFBZTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0wsS0FBSztBQUFBLFFBQ1A7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLGNBQWMsQ0FBQyxPQUFlO0FBQzVCLGdCQUFJLENBQUMsR0FBRyxTQUFTLGNBQWMsRUFBRyxRQUFPO0FBQ3pDLGdCQUNFLEdBQUcsU0FBUyxZQUFZLEtBQ3hCLEdBQUcsU0FBUyxrQkFBa0IsS0FDOUIsR0FBRyxTQUFTLFVBQVUsR0FDdEI7QUFDQSxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsU0FBUyxFQUFHLFFBQU87QUFDbkMsZ0JBQUksR0FBRyxTQUFTLGtCQUFrQixFQUFHLFFBQU87QUFDNUMsZ0JBQUksR0FBRyxTQUFTLGNBQWMsRUFBRyxRQUFPO0FBQ3hDLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxpQkFBaUI7QUFBQSxRQUNmLHlCQUF5QjtBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLElBQ0EsR0FBSSxTQUFTLGdCQUNUO0FBQUEsTUFDRSxRQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxZQUFZO0FBQUEsUUFDZDtBQUFBLFFBQ0EsSUFBSTtBQUFBLFVBQ0YsUUFBUTtBQUFBLFVBQ1IsT0FBTyxDQUFDLGNBQWM7QUFBQSxRQUN4QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLElBQ0EsQ0FBQztBQUFBLEVBQ1A7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
