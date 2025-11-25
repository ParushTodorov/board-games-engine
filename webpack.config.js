const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const { gamesConfig } = require('./src/boot/Games.js');

const games = Object.values(gamesConfig);

module.exports = [
    {
        name: "main",
        mode: process.env.NODE_ENV === "production" ? "production" : "development",
        entry: {
            main: path.resolve(__dirname, "src/index.ts"),
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "dist"),
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    type: "asset/resource"
                },
                {
                    test: /\.mjs$/,
                    include: /pixi\.js/,
                    type: "javascript/auto"
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.resolve(__dirname, "src/index.html"),
                inject: "body"
            }),
            new CopyPlugin({
                patterns: [
                    { from: `src/boot/games.json`, to: `.`}
                ]
            })
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        devtool: 'eval-source-map',
        devServer: {
            static: {
                directory: path.resolve(__dirname, 'dist')
            },
            port: 1209,
            open: true,
            hot: false,
            compress: true,
            historyApiFallback: true
        }
    },

    ...games.map(game => ({
        name: game,
        mode: process.env.NODE_ENV === "production" ? "production" : "development",
        entry: {
            game: path.resolve(__dirname, `src/games/${game}/index.ts`)
        },
        output: {
            filename: `[name].js`,
            path: path.resolve(__dirname, `dist/${game}`),
            asyncChunks: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    type: "asset/resource"
                },
                {
                    test: /\.mjs$/,
                    include: /pixi\.js/,
                    type: "javascript/auto"
                }
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: `src/static/common`, to: `./static/common` },
                    { from: `src/static/${game}`, to: `./static/${game}` }
                ]
            })
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        optimization: {
            splitChunks: false,
            runtimeChunk: false
        },
        devtool: 'eval-source-map'
    }))
]