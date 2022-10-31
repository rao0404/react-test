const webpack = require('webpack');
const path = require('path');
//html-webpack-plugin の読み込み
const HtmlWebpackPlugin = require('html-webpack-plugin');
//mini-css-extract-plugin の読み込み
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//optimize-css-assets-webpack-plugin の読み込み
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//JavaScript の圧縮用のプラグイン TerserPlugin の読み込み
const TerserPlugin = require('terser-webpack-plugin');
const {ENV_MODE} = require("./config");

module.exports = {
    entry: './sample1/child1/src/index.js',
    mode: ENV_MODE.PRODUCTION,
    //出力先
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'assets'),
    },
    //プラグインの設定
    plugins: [
        new MiniCssExtractPlugin({
            // 出力するスタイルシートの名前
            filename: 'style.css',
        }),
        //html-webpack-plugin の設定
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './sample1/child1/src/ejs/index.ejs',
            //　ファイル末尾にハッシュを追加
            // hash: true,
        })
    ],
    optimization: {
        minimizer: [
            //JavaScript用の圧縮プラグイン
            new TerserPlugin({}),
            //CSS用の圧縮プラグイン
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    module: {
        rules: [
            {
                test: /\.ejs$/,
                use: 'ejs-compiled-loader',
            },
            {
                // CSS のローダー
                //ローダーの処理対象ファイル（拡張子 .css）
                test: /\.(scss|sass|css)$/i,
                use: [
                    // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    // CSS を CommonJS に変換するローダー
                    'css-loader',
                    // Sass をコンパイルするローダー
                    'sass-loader'
                ],
            },
            {
                // Babel のローダーの設定
                //対象のファイルの拡張子
                test: /\.(js|mjs|jsx)$/,
                //対象外とするフォルダ
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ],
                            plugins: ["transform-class-properties"]
                        }
                    }
                ]
            }
        ]
    }
};