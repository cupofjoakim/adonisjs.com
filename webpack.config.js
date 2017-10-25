const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const extractSass = new ExtractTextPlugin('adonis.css')
const WebpackShellPlugin = require('webpack-shell-plugin')

const plugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: false,
    }
  }),
  extractSass
]

/**
 * Start adonis server when env variable
 * is set. Check `package.json` scripts
 * block.
 */
if (process.env.START_SERVER) {
  plugins.push(new WebpackShellPlugin({
    onBuildStart: ['npm run watch:docs', 'adonis serve --dev']
  }))
}

module.exports = {
  entry: ['./resources/scripts/app.js', './resources/sass/app.scss'],
  output: {
    filename: 'adonis.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract(['css-loader?minimize', 'sass-loader'])
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: require.resolve('zepto'),
        use: 'imports-loader?this=>window'
      }
    ]
  },
  plugins: plugins
}
