// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import TerserPlugin from 'terser-webpack-plugin';
import branch from 'git-branch';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import WebappWebpackPlugin from 'webapp-webpack-plugin';
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const currentBranch = require('process').env['BRANCH'] ||  branch.sync();
console.info('Branch: ', currentBranch);
const isMainBranch = ['master', 'production', 'staging'].indexOf(currentBranch) !== -1;

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.GA': require('process').env['GA'],
  __DEV__: false
};

export default {
  performance: {
     maxEntrypointSize: 800000,
     maxAssetSize: 800000
   },
  stats: {
    entrypoints: false,
    children: false
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: {
      '@material-ui/core': '@material-ui/core/es',
      'current-device': 'current-device/es',
      'react-redux': 'react-redux/es',
      'react-router-dom': 'react-router-dom/es',
      'react-router-redux': 'react-router-redux/es',
      'redux-thunk': 'redux-thunk/es',
      'reselect': 'reselect/es'
    }
  },
  devtool: 'source-map', // more info:https://webpack.js.org/guides/production/#source-mapping and https://webpack.js.org/configuration/devtool/
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js'
  },
  optimization: {
    minimizer: [new TerserPlugin({ sourceMap: true, parallel: true, terserOptions: {ecma: 7}})]
  },
  plugins: [
    new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false}),
    // Hash the files using MD5 so that their names change when the content changes.
    new webpack.DefinePlugin(GLOBALS),

    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      // custom properties
      useRootcause: isMainBranch,
      GA :require('process').env['GA'],
      lastUpdated: new Date().toISOString().substring(0, 19).replace('T', ' ') + 'Z'
    }),
    new WebappWebpackPlugin({
        logo: './src/favicon.png',
        favicons: {
          appName: 'CNCF Interactive Landscape',
          icons: {
            yandex: false
          }
        }
      })
    // new UglifyJsPlugin({
      // parallel: true,
      // sourceMap: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        sideEffects: false,
        use: [{
          loader: 'babel-loader',
          options: {
            exclude: /node_modules/,
            babelrc: false,
            presets: [
              ['@babel/preset-env', {modules: false, targets: '>1%'}],
              '@babel/preset-react'
            ],
            plugins: [
              "lodash",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-transform-react-constant-elements",
              "transform-react-remove-prop-types",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-async-to-generator",
              "@babel/plugin-transform-regenerator",
              "@babel/plugin-proposal-export-default-from",
            ]
          }
        }]
      },
      {
        test: /\.ejs$/, loader: 'ejs-loader',
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('cssnano'),
                require('autoprefixer'),
              ],
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src', 'scss')],
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
