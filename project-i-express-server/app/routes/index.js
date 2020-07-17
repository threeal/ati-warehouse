module.exports = (app) => {
  const tutorialRoute = require('./tutorial.route.js');
  const documentRoute = require('./document.route.js');
  const palletLoadRoute = require('./pallet-load.route.js');
  const palletRoute = require('./pallet.route.js');
  const basketUnloadRoute = require('./basket-unload.route.js');

  tutorialRoute(app);
  documentRoute(app);
  palletLoadRoute(app);
  palletRoute(app);
  basketUnloadRoute(app);
};