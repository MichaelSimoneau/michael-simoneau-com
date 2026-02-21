const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const shimMap = {
  'react-router-dom': 'src/shims/react-router-dom.tsx',
  '@react-three/fiber': 'src/shims/react-three-fiber.tsx',
  '@react-three/drei': 'src/shims/react-three-drei.tsx',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const shimFile = shimMap[moduleName];
  if (shimFile) {
    return {
      filePath: path.resolve(__dirname, shimFile),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
