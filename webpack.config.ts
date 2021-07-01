import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import LoadablePlugin from '@loadable/webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProduction = process.argv.toString().includes('production')
const analyze = process.env.ANALYZE === 'true'

const tsRule = () => ({
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
})

const cssRule = (options: { emit: boolean }) => ({
    test: /\.scss$/i,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                emit: options.emit,
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
})

const imageRule = (options: { emit: boolean }) => ({
    test: /\.(jpe?g|png|webp)$/i,
    use: [
        {
            loader: 'responsive-loader',
            options: {
                esModule: true,
                emitFile: options.emit,
            },
        },
    ],
})

const iconRule = (options: { emit: boolean }) => ({
    test: /\.(ico|svg)$/i,
    use: [
        {
            loader: 'file-loader',
            options: {
                emitFile: options.emit,
            },
        },
    ],
})

const base: webpack.Configuration = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        publicPath: '/',
        clean: true,
    },
}

const client: webpack.Configuration = {
    ...base,
    entry: { main: './src/client/index.tsx' },
    target: 'web',
    module: {
        rules: [tsRule(), cssRule({ emit: true }), imageRule({ emit: true }), iconRule({ emit: true })],
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
        rules: [tsRule(), cssRule({ emit: false }), imageRule({ emit: false }), iconRule({ emit: false })],
    },
    output: {
        ...base.output,
        path: path.resolve(__dirname, 'dist/server'),
        filename: '[name].js',
    },
    plugins: [
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
