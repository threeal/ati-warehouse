module.exports = (app) => {
  const tutorialRoute = require('./tutorial.route.js');
  const documentRoute = require('./document.route.js');
  const palletLoadRoute = require('./pallet-load.route.js');

  tutorialRoute(app);
  documentRoute(app);
  palletLoadRoute(app);
};