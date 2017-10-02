var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var shared = {};

var backend = {
    target: 'node',
    entry: [
        './backend/src/main.js'
    ],
    output: {
        path: path.join(__dirname, 'build/backend'),
        filename: '[name].js'
    },
    resolve: {
        modules: ['./node_modules', './backend/src'],
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] },
                }]
            }
        ]
    }
};

var frontend = {
    entry: [
        './frontend/src/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'build/frontend'),
        filename: '[name].js'
    },
    resolve: {
        modules: ['./node_modules', './frontend/src'],
        extensions: ['.js', '.jsx', '.css']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './frontend/src/index.ejs'
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015', 'react'] },
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};

module.exports = [
    Object.assign({}, shared, frontend),
    Object.assign({}, shared, backend)
];