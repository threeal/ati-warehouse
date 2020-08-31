module.exports = {
  devServer: {
    port: 5000,
  },
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    app: {
      entry: 'client/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  pwa: {
    name: 'ATI Warehouse',
    themeColor: '#1976D2',
  },
}