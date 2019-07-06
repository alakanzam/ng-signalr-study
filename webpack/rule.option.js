// Import library.

exports = module.exports = {
    /*
    * Get configuration options.
    * */
    get: function () {

        // Initialize rules list.
        let rules = [];

        //#region Babel loader

        // Babel-loader.
        rules.push({
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['es2015', {"modules": false}]]
                }
            }
        });

        //#endregion

        //#region JQuery

        rules.push({
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        });

        //#endregion

        //#region Scss loader

        rules.push({
            test: /\.scss$/,
            use: [
                'style-loader', // creates style nodes from JS strings
                'css-loader', // translates CSS into CommonJS
                'sass-loader' // compiles Sass to CSS
            ]
        });

        //#endregion

        //#region Css loader

        rules.push({
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        });

        //#endregion

        //#region Assets loader

        rules.push({
            test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        });

        //#endregion

        //#region Html loader

        rules.push({
            test: /\.html$/, // Only .html files
            loader: 'html-loader' // Run html loader
        });

        //#endregion

        return rules;
    }
};