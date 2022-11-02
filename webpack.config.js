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

const prodConfig = require('./scripts/webpack.prod');


const {ENV_MODE, CONTENT_ID} = require("./scripts/config");
const {getDevConfigs} = require("./scripts/webpack.dev");
const {getProdConfigs} = require("./scripts/webpack.prod");

const commonConfig = {
    entry: './sample1/child1/src/index.js',
    mode: ENV_MODE.DEVELOPMENT,
    //出力先
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    //プラグインの設定
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            noSources: false,
            filename: '[file].map'
        }),
        new MiniCssExtractPlugin({
            //出力するスタイルシートの名前
            filename: 'style.css',
        }),
        //html-webpack-plugin の設定
        new HtmlWebpackPlugin({
            // filename: './index.html',
            // template: 'ejs-render-loader!./sample1/child1/src/ejs/index.ejs',
            filename: 'index.html',
            template: './sample1/child1/src/ejs/index.ejs',
            //<title> 要素を指定
            // title: 'React 環境構築サンプル（最終版）',
            //ファイル末尾にハッシュを追加
            // hash: true,
        })
        // new HtmlWebpackPlugin({
        //     filename: '../index.html',
        //     template:  'ejs-render-loader!./sample1/child1/src/ejs/index.ejs'
        // })
    ],
    //optimization プロパティ
    optimization: {
        //圧縮方法（圧縮に使うプラグイン）を変更
        minimizer: [
            //JavaScript 用の圧縮プラグイン
            new TerserPlugin({}),
            //CSS 用の圧縮プラグイン
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
    },
    //webpack-dev-server の設定
    devServer: {
        // //ルートディレクトリの指定
        // contentBase: path.join(__dirname, 'dist'),
        // //サーバー起動時にブラウザを自動的に起動
        // open: true,
        // // ルートディレクトリのファイルを監視
        // watchContentBase: true,
        // // ポート番号を変更
        // port: 3000
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    }
};

module.exports = (env, argv) => {
    const mode = argv.mode? argv.mode : ENV_MODE.PRODUCTION
    const config = mode === ENV_MODE.DEVELOPMENT? getDevConfigs() : getProdConfigs()
    return config

}