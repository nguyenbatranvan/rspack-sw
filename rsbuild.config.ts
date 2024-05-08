import {defineConfig} from '@rsbuild/core';
import rspack from "@rspack/core";
import checkPlugin from "fork-ts-checker-webpack-plugin";
import {pluginReact} from '@rsbuild/plugin-react';
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
// @ts-ignore
import {BundlerPluginInstance} from "@rsbuild/shared/dist/types/bundlerConfig";
import {InjectManifestPlugin} from 'inject-manifest-plugin'

const isAnalyzer = process.env.ANA;
const plugins: BundlerPluginInstance[] = [
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
    new InjectManifestPlugin({
        file:'./service-worker.ts'
    }),
    new rspack.DefinePlugin({"process.env.PUBLIC_URL": JSON.stringify(process.env.PUBLIC_URL)}),
    new checkPlugin()
];
if (isAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin());
}
export default defineConfig({
    plugins: [pluginReact({})],
    output: {
        distPath: {
            image: 'assets',
            svg: 'assets',
            font: 'assets',
            media: 'assets',
        },
    },
    source: {
        entry: {
            index: './src/main.tsx'
        }
    },
    server: {
        port: 5001,
    },
    performance: {
        chunkSplit: {
            override: {
                chunks: 'async',
                minSize: 30000,
            },
        },
    },
    html: {
        mountId: 'root1',
        template: 'index.html'
    },
    tools: {
        rspack: (config, utils) => {
            config.output!.publicPath = 'auto';
            utils.appendPlugins(plugins);
            return config
        }
    }
})
