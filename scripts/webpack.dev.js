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
const {ENV_MODE, PROJECT_ROOT, CONTENT_ID} = require("./config");

module.exports.devConfig = {
    entry: './sample1/child1/src/index.js',
    mode: ENV_MODE.DEVELOPMENT,
    //source-map タイプのソースマップを出力
    devtool: 'source-map',
    // node_modules を監視（watch）対象から除外
    watchOptions: {
        ignored: /node_modules/  //正規表現で指定
    },
    devtool: 'source-map',
    // node_modules を監視（watch）対象から除外
    watchOptions: {
        ignored: /node_modules/  //正規表現で指定
    },
    output: {
        filename: 'sample1/child1/js/bundle.js',
        path: PROJECT_ROOT + '/dist'
    },
    plugins: [
        // new webpack.SourceMapDevToolPlugin({
        //     noSources: false,
        //     filename: '[file].map'
        // }),
        new MiniCssExtractPlugin({
            //出力するスタイルシートの名前
            filename: 'sample1/child1/css/style.css',
        }),
        //html-webpack-plugin の設定
        new HtmlWebpackPlugin({
            filename: 'sample1/child1/index.html',
            template: './sample1/child1/src/ejs/index.ejs',
            hash: true,
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
                use: 'ejs-compiled-loader',
            },
            {
                test: /\.(scss|sass|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: PROJECT_ROOT,
                        }
                    },
                    'css-loader',
                    'sass-loader'
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
            }
        ]
    },
    // webpack-dev-server の設定
    devServer: {
        static: {
            directory: path.join(PROJECT_ROOT, 'dist'),
        },
        // サーバー起動時にブラウザを自動的に起動
        open: true,
        compress: true,
        port: 9000,
    }
};

module.exports.getDevConfigs = () => {
    const configs = []
    Object.keys(CONTENT_ID).map((key, i) => {
        const children = CONTENT_ID[key]
        children.map((id, j) => {
            const entryPath = `${key}/${id}`
            const devConfigTemplate = {
                entry: `./${entryPath}/src/index.js`,
                mode: ENV_MODE.DEVELOPMENT,
                //source-map タイプのソースマップを出力
                devtool: 'source-map',
                // node_modules を監視（watch）対象から除外
                watchOptions: {
                    ignored: /node_modules/  //正規表現で指定
                },
                output: {
                    // filename: 'sample1/child1/js/bundle.js',
                    filename: `${entryPath}/js/bundle.js`,
                    path: PROJECT_ROOT + '/dist',
                    assetModuleFilename: `${entryPath}/[name][ext][query]`
                },
                plugins: [
                    new webpack.SourceMapDevToolPlugin({
                        noSources: false,
                        filename: '[file].map'
                    }),
                    new MiniCssExtractPlugin({
                        //出力するスタイルシートの名前
                        // filename: 'sample1/child1/css/style.css',
                        filename: `${entryPath}/css/style.css`,
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
                                from: `${entryPath}/src/img/`,
                                to: `${PROJECT_ROOT}/dist/${entryPath}/img/`,
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
                            use: 'ejs-compiled-loader',
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
                                'css-loader',
                                'sass-loader'
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
                        // {
                        //     test: /\.(png|svg|jpe?g|gif)$/i,
                        //     type: 'asset/resource'
                        // },
                        {
                            test: /\.(png|svg|jpe?g|gif)$/i,
                            generator: {
                                filename: `${entryPath}/img/[name][ext][query]`
                            },
                            type: 'asset/resource'
                        },
                    ]
                }
            };
            if(i === 0 && j === 0) {
                // webpack-dev-server の設定
                // 1台のみ立ちあげる。
                devConfigTemplate['devServer'] = {
                    static: {
                        directory: path.join(PROJECT_ROOT, 'dist'),
                    },
                    // サーバー起動時にブラウザを自動的に起動
                    open: true,
                    compress: true,
                    port: 9000,
                }
            }
            configs.push(devConfigTemplate)
        })
    })

    return configs
}