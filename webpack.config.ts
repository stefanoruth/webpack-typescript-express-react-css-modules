import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import LoadablePlugin from '@loadable/webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProduction = process.argv.toString().includes('production')
const analyze = process.env.ANALYZE === 'true'

const base: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                            plugins: ['@babel/plugin-transform-runtime', '@loadable/babel-plugin'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        publicPath: '/',
        clean: true,
    },
    plugins: [],
}

const client: webpack.Configuration = {
    ...base,
    entry: { main: './src/client/index.tsx' },
    target: 'web',
    module: {
        rules: [
            ...(base.module?.rules || []),
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.(jpe?g|png|webp)$/i,
                use: [
                    {
                        loader: 'responsive-loader',
                        options: {
                            esModule: true,
                        },
                    },
                ],
            },
            {
                test: /\.(ico|svg)$/i,
                use: [{ loader: 'file-loader' }],
            },
        ],
    },
    output: {
        ...base.output,
        path: path.resolve(__dirname, 'dist/client'),
        filename: isProduction ? '[name].[contenthash].js' : '[name].dev.js',
        chunkFilename: isProduction ? 'chunk-[name].[contenthash].js' : 'chunk-[name].dev.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        ...(base.plugins || []),
        new LoadablePlugin() as any,
        new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[hash].css' : '[name].dev.css',
            chunkFilename: isProduction ? '[name].[hash].css' : '[name].dev.css',
        }),
    ],
}

if (analyze) {
    client.plugins?.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
}

const server: webpack.Configuration = {
    ...base,
    entry: {
        server: './src/server/server.ts',
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals() as any],
    module: {
        rules: [
            ...(base.module?.rules || []),
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            emit: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.(jpe?g|png|webp)$/i,
                use: [
                    {
                        loader: 'responsive-loader',
                        options: {
                            esModule: true,
                            emitFile: false,
                        },
                    },
                ],
            },
            {
                test: /\.(ico|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            emitFile: false,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        ...base.output,
        // libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'dist/server'),
        filename: '[name].js',
    },
    plugins: [
        ...(base.plugins || []),
        new MiniCssExtractPlugin({
            filename: isProduction ? '[name].[hash].css' : '[name].dev.css',
            chunkFilename: isProduction ? '[name].[hash].css' : '[name].dev.css',
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
}

export default [client, server]
