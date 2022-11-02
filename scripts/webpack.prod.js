const webpack = require('webpack');
const path = require('path');
//html-webpack-plugin の読み込み
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
//mini-css-extract-plugin の読み込み
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//optimize-css-assets-webpack-plugin の読み込み
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//JavaScript の圧縮用のプラグイン TerserPlugin の読み込み
const TerserPlugin = require('terser-webpack-plugin');
const {ENV_MODE, PROJECT_ROOT, CONTENT_ID, COMMON_DIR_PATH} = require("./config");

module.exports.getProdConfigs = () => {
    const configs = []
    Object.keys(CONTENT_ID).map((key, i) => {
        const children = CONTENT_ID[key]
        children.map((id, j) => {
            const entryPath = `${key}/${id}`
            const prodConfigTemplate = {
                entry: `./${entryPath}/src/index.js`,
                mode: ENV_MODE.PRODUCTION,
                // watchOptions: {
                //     ignored: /node_modules/  //正規表現で指定
                // },
                output: {
                    // filename: 'sample1/child1/js/bundle.js',
                    filename: `js/${entryPath}/bundle.js`,
                    path: PROJECT_ROOT + '/assets'
                    // assetModuleFilename: `${entryPath}/[name][ext][query]`
                },
                plugins: [
                    // new webpack.SourceMapDevToolPlugin({
                    //     noSources: false,
                    //     filename: '[file].map'
                    // }),
                    new MiniCssExtractPlugin({
                        //出力するスタイルシートの名前
                        // filename: 'sample1/child1/css/style.css',
                        filename: `css/${entryPath}/style.css`,
                    }),
                    //html-webpack-plugin の設定
                    new HtmlWebpackPlugin({
                        // filename: 'sample1/child1/index.html',
                        filename: `${entryPath}/index.html`,
                        // template: './sample1/child1/src/ejs/index.ejs',
                        template: `./${entryPath}/src/ejs/index.ejs`,
                        hash: true,
                    }),
                    new CopyWebpackPlugin({
                        patterns: [
                            {
                                from: `common/img/`,
                                to: `${PROJECT_ROOT}/assets/common/img/`,
                            },
                            {
                                from: `common/font/`,
                                to: `${PROJECT_ROOT}/assets/common/font/`,
                            },
                            {
                                from: `${entryPath}/src/img/`,
                                to: `${PROJECT_ROOT}/assets/img/${entryPath}/`,
                            }
                        ]
                    })
                ],
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
                            use: 'ejs-compiled-loader'
                        },
                        {
                            test: /\.(scss|sass|css)$/i,
                            use: [
                                {
                                    loader: MiniCssExtractPlugin.loader,
                                    // options: {
                                    //     publicPath: PROJECT_ROOT,
                                    // }
                                },
                                {
                                    loader: "css-loader",
                                    options: {
                                        url: false
                                    }
                                },
                                {
                                    loader: "sass-loader",
                                    options: {
                                        additionalData: `$fontPath: "../../common/";`
                                    }
                                },
                            ],
                        },
                        {
                            test: /\.(js|mjs|jsx)$/,
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
                        },
                        //Asset Modules の設定
                        {
                            test: /\.(png|svg|jpe?g|gif|woff|woff2|eot|ttf|otf)$/i,
                            type: 'asset/resource'
                        },
                    ]
                }
            };
            configs.push(prodConfigTemplate)
        })
    })

    return configs
}