const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/",
    proxy({
      target: "http://172.29.57.17:7777",
      changeOrigin: true
    })
  );
};
