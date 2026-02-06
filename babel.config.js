module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@src': './src',
        },
      },
    ],
    ['react-native-worklets/plugin', {}, 'worklets-plugin'],
    ['react-native-reanimated/plugin', {}, 'reanimated-plugin'],
  ],
};
