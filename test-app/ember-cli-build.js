'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-icons'],
      webpack: {
        module: {
          rules: [
            {
              test: /\.svg$/,
              loader: 'svg-sprite-loader',
            },
          ],
        },
      },
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
