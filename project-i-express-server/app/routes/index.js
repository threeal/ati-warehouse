module.exports = (app) => {
  const authRoute = require('./auth.route.js');
  const documentRoute = require('./document.route.js');
  const palletLoadRoute = require('./pallet-load.route.js');
  const palletRoute = require('./pallet.route.js');
  const basketUnloadRoute = require('./basket-unload.route.js');
  const basketRoute = require('./basket.route.js');

  authRoute(app);
  documentRoute(app);
  palletLoadRoute(app);
  palletRoute(app);
  basketUnloadRoute(app);
  basketRoute(app);
};