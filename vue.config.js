module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
      ? process.env.VUE_APP_PUBLIC_PATH
      : '/',
  outputDir: 'frontend',
  configureWebpack: {
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  }
}