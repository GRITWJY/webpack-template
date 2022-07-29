const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 获取处理样式的Loader
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre,
  ].filter(Boolean);
}

module.exports = {
  entry: "./src/main.js", // 相对路径

  output: {
    // dirname 代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"), // 绝对路径
    filename: "static/js/main.js",
    clean: true,
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /.css$/i,
            use: getStyleLoader(),
          },
          {
            test: /\.less$/i,
            exclude: /node_modules/, // 排除node_modules中的js文件不处理
            use: getStyleLoader("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求数量  缺点：体积会更大
                maxSize: 10 * 1024, // 10kb
              },
            },
            generator: {
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          {
            // 在这里加后缀即可
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/, // 排除node_modules中的js文件不处理
            use: {
              loader: "babel-loader",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new ESLintPlugin({
      // 检查src下的文件
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    new CssMinimizerPlugin(),
  ],

  mode: "production",
};
