const path = require("path");

const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.js", // 相对路径

  output: {
    //  开发模式没有输出
    path: undefined,
    filename: "static/js/main.js",
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"], // 顺序是从右到左
          },
          {
            test: /\.less$/i,
            exclude: /node_modules/, // 排除node_modules中的js文件不处理
            use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              // 将 JS 字符串生成为 style 节点
              MiniCssExtractPlugin.loader,
              // 将 CSS 转化成 CommonJS 模块
              "css-loader",
              // 将 Sass 编译成 CSS
              "sass-loader",
            ],
          },
          {
            test: /\.styl$/,
            loader: "stylus-loader", // 将 Stylus 文件编译为 CSS
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
  ],

  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
  },

  mode: "development",
};
