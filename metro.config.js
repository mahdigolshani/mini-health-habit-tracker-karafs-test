const path = require('path');
const {getDefaultConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig({
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      '@widgets': path.resolve(__dirname, 'src'),
    },
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs', 'svg'],
    assetExts: [...defaultConfig.resolver.assetExts].filter(
      ext => ext !== 'svg',
    ),
  },
  projectRoot: path.resolve(__dirname),
  watchFolders: [path.resolve(__dirname, 'src')],
});
