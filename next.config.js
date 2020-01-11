const compose = require("next-compose");
const withCSS = require("@zeit/next-css");
const withOffline = require("next-offline");

const withCSSConfig = {
  exportPathMap: function() {
    return {
      "/": { page: "/" }
    };
  }
};

const withOfflineConfig = {};

module.exports = compose([
  [withCSS, withCSSConfig],
  [withOffline, withOfflineConfig]
]);
