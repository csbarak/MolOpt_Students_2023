const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000'
  },

  component: {
    devServer: {
      baseUrl: 'http://localhost:3000',
      framework: 'next',
      bundler: 'webpack'
    }
  }
})
