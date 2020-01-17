const compose = require("next-compose");
const withCSS = require("@zeit/next-css");
const withOffline = require("next-offline");
const withBabelMinify = require("next-babel-minify")();

const withCSSConfig = {
  exportPathMap: function() {
    return {
      "/": { page: "/" }
    };
  }
};

const withOfflineConfig = {
  target: "serverless",
  transformManifest: manifest => ["/"].concat(manifest), // add the homepage to the cache
  // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: true,
  workboxOpts: {
    swDest: "/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "https-calls",
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
};

module.exports = compose([
  [withCSS, withCSSConfig],
  [withOffline, withOfflineConfig],
  [withBabelMinify, {}]
]);
