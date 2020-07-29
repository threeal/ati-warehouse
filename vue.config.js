module.exports = {
  devServer: {
    port: 8081,
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
    name: 'Project-I',
    themeColor: '#1976D2',
  },
}