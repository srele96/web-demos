const { HtmlRspackPlugin } = require("@rspack/core");
const path = require("path");

const SITES = ["demo-dental-centar", "demo-second-dental"];

module.exports = {
  mode: "production",

  entry: {
    ...Object.fromEntries(
      SITES.map((site) => [`${site}/main`, `./src/${site}/main.jsx`]),
    ),
    main: "./src/main.jsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].js",
    cssFilename: "[name].[contenthash:8].css",
    assetModuleFilename: "shared/assets/[name].[contenthash:8][ext]",
  },

  experiments: { css: true },

  module: {
    rules: [
      { test: /\.css$/, type: "css" },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "ecmascript", jsx: true },
            transform: { react: { runtime: "automatic" } },
          },
        },
      },
      { test: /\.(png|jpe?g|webp|avif|svg)$/i, type: "asset/resource" },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/client": "preact/compat/client",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },

  stats: {
    preset: "normal",
    assets: true,
    chunks: false,
    modules: false,
  },

  optimization: {
    runtimeChunk: { name: (entrypoint) => `${entrypoint.name}.runtime` },
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        preact: {
          test: /[\\/]node_modules[\\/]preact[\\/]/,
          name: "preact",
          chunks: "all",
          priority: 30,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 30,
        },
        swiper: {
          test: /[\\/]node_modules[\\/]swiper[\\/]/,
          name: "swiper",
          chunks: "all",
          priority: 20,
        },
        gsap: {
          test: /[\\/]node_modules[\\/]gsap[\\/]/,
          name: "gsap",
          chunks: "all",
          priority: 20,
        },
      },
    },
  },

  plugins: [
    ...SITES.map(
      (site) =>
        new HtmlRspackPlugin({
          template: `./src/${site}/index.html`,
          filename: `${site}/index.html`,
          chunks: [`${site}/main`],
          scriptLoading: "defer",
          minify: true,
        }),
    ),
    new HtmlRspackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main"],
      scriptLoading: "defer",
      minify: true,
    }),
  ],

  devServer: {
    static: path.resolve(__dirname, "dist"),
    hot: true,
    open: true,
    port: 8081,
  },
};
