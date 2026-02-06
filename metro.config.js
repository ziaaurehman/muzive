/* eslint-disable no-undef */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [],
    resolver: {
        blockList: [
            // Block watching Android build files
            /android\/.*/,
            /\.cxx\/.*/,
            /CMakeFiles\/.*/,
            /CMakeTmp\/.*/,
        ],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
