module.exports = {
  devServer: {
    port: 8081,
  },
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    app: {
      entry: 'client/src/main.js',
      template: 'client/public/index.html',
    },
  },
  pwa: {
    name: 'Project-I',
    themeColor: '#1976D2',
  },
}