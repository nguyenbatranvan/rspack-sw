const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";

const path = require("path");
const deps = require("./package.json").dependencies;
const {ModuleFederationPlugin} = require("@module-federation/enhanced/rspack");
const checkPlugin = require("fork-ts-checker-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const {InjectManifest} = require("workbox-webpack-plugin");
const name = "remote";
const name1 = name + "1";
const isAnalyzer = process.env.ANA;
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
    entry: {
        main: "./src/main.tsx",
    },
    resolve: {
        extensions: ["...", ".ts", ".tsx", ".jsx"],
    },
    devtool: "source-map",
    optimization: {
        minimize: false,
        moduleIds: 'named',
        providedExports: true,
        sideEffects: true,
    },
    devServer: {
        port: 5001,
        hot: true,
        static: {
            directory: path.join(__dirname, "build"),
        },
        liveReload: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
    },
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "all",
                    name: "vendor",
                    test: /common/
                }
            }
        }
    },
    output: {
        clean: true,
        path: __dirname + "/dist",
        uniqueName: name1,
        publicPath: "http://localhost:4200/",
        filename: 'js/[id].js',
        cssChunkFilename: 'css/[id].css'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.svg$/,
                type: "asset",
            },
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /(node_modules|\.webpack)/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            sourceMap: true,
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        development: isDev,
                                        refresh: isDev,
                                    },
                                },
                            },
                            env: {
                                targets: ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new rspack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new rspack.ProgressPlugin({}),
        isDev && new rspack.HotModuleReplacementPlugin(),

        new rspack.HtmlRspackPlugin({
            template: "./index.html",
            excludedChunks: [name],
            filename: "index.html",
            inject: true,
            publicPath: "/",
        }),
        new rspack.CssExtractRspackPlugin({}),
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: "public"
                }, {
                    from: "public2"
                }
            ]
        }),
        new checkPlugin(),

        isAnalyzer ? new BundleAnalyzerPlugin() : null,
        // new ModuleFederationPlugin({
        //     name: name,
        //     filename: "remoteEntry.js",
        //     exposes: {
        //         "./App": "./src/App.tsx",
        //         "./Util": "./src/utils.ts",
        //         "./Store": "./src/stores",
        //     },
        //     shared: {
        //         ...deps,
        //         "react-dom": {
        //             singleton: true,
        //         },
        //         react: {
        //             singleton: true,
        //         },
        //     },
        // }),
        isDev ? new refreshPlugin() : null,
    ].filter(Boolean),
};
