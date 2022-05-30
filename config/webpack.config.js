const HtmlWebpackPlugin = require("html-webpack-plugin");

const pages = [
  "index", "sample"
];

const config = {
    mode: "development",
    entry: {
        index: {
            import: "./src/pages/index/index.js",
            filename: "index.js"
        },
        sample: {
            import: "./src/pages/sample/sample.js",
            filename: "sample.js"
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/pages/index/index.html",
            inject: "head",
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            filename: "sample.html",
            template: "./src/pages/sample/sample.html",
            inject: "head",
            chunks: ["sample"]
        }),
    ]
};

module.exports = config;
