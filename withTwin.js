// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const includedDirs = [
  path.resolve(__dirname, 'src/components'),
  path.resolve(__dirname, 'src/pages'),
];

module.exports = function withTwin(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'babel-loader',
            options: {
              sourceMaps: dev,
              presets: [
                ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
              ],
              plugins: [
                require.resolve('babel-plugin-macros'),
                require.resolve('@emotion/babel-plugin'),
                [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
              ],
            },
          },
        ],
      });

      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false,
        };
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  };
};
