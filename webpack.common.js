const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        popup: path.resolve('./src/popup/index.tsx'),
        background: path.resolve('./src/background/background.ts'),
        contentScript: path.resolve('./src/content/contentScript.tsx'),
        newTab: path.resolve('./src/newTab/index.tsx')
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer]
                        }
                    }
                }],
              },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer")
        }
    },
    output: {
        filename: '[name].js',
    },
    plugins: [ 
        ...getHtmlPlugins([
            'popup',
            'newTab',
        ]),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new CopyPlugin({
          patterns: [
            { from: path.resolve('src/assets'), to: path.resolve('dist') }, 
          ],
        }),
      ],
      optimization: {
        splitChunks: {
          chunks(chunk) {
            // exclude `my-excluded-chunk`
            return chunk.name !== 'contentScript';
          },
        },
      },
};      

function getHtmlPlugins(chunks){
    return chunks.map(chunk => new HtmlWebpackPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}