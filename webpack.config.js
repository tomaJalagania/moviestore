const path = require("path");
const htmpWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // installed via npm}
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpack = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);
const loaders = () => {
  const loader = [
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        // Translates CSS into CommonJS
        MiniCssExtractPlugin.loader,

        "css-loader",
        // Compiles Sass to CSS
        {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                autoprefixer({
                  cascade: false,
                  overrideBrowserslist: ["last 10 version"],
                }),
              ];
            },
          },
        },
        "sass-loader",
      ],
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    },
  ];

  return loader;
};
module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: ["@babel/polyfill", "./index.js"],
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 3000,
    hot: true,
  },
  module: {
    rules: loaders(),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    // // new CopyWebpack([
    // //   {
    // //     from: path.resolve(__dirname, "src/favicon.ico"),
    // //     to: path.resolve(__dirname, "dist"),
    // //   },
    // ]),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
};
