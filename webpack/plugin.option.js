// Import plugin library.
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

exports = module.exports = {

    //#region Methods

    /*
    * Get configuration options.
    * */
    get: function (paths, bIsInProduction) {

        // Plugins list initialization.
        let plugins = [];

        //#region Clean plugin

        // List of items that will be cleared.
        let cleanedItems = [paths.dist];

        // Initialize clean option.
        let oCleanOption = {
            // Absolute path to your webpack root folder (paths appended to this)
            // Default: root of your package
            root: paths.root,

            // Write logs to console.
            verbose: true,

            // Use boolean "true" to test/emulate delete. (will not remove files).
            // Default: false - remove files
            dry: false,

            // If true, remove files on recompile.
            // Default: false
            watch: false,

            // Instead of removing whole path recursively,
            // remove all path's content with exclusion of provided immediate children.
            // Good for not removing shared files from build directories.
            exclude: null,

            // allow the plugin to clean folders outside of the webpack root.
            // Default: false - don't allow clean folder outside of the webpack root
            allowExternal: false
        };

        // Clean fields before publishing packages.
        plugins.push(new CleanWebpackPlugin(cleanedItems, oCleanOption));

        //#endregion

        //#region Clean obsolete chunks

        plugins.push(
            new CleanObsoleteChunks({
                // Write logs to console.
                // Default: true
                verbose: true,

                // Clean obsolete chunks of webpack child compilations.
                // Default: false
                deep: true
            }));

        //#endregion

        //#region Copy plugin

        // Items to be copied.
        let copiedItems = ['assets'];
        let oCopiedOptions = [];

        for (let index = 0; index < copiedItems.length; index++) {
            // Initialize item.
            let copiedItem = copiedItems[index];

            // Initialize copied option.
            let oCopiedOption = {
                from: path.resolve(paths.app, copiedItem),
                to: path.resolve(paths.dist, copiedItem)
            };

            oCopiedOptions.push(oCopiedOption);
        }

        // Copy files.
        plugins.push(new CopyWebpackPlugin(oCopiedOptions));

        //#endregion

        //#region Provide plugin

        // Using bluebird promise instead of native promise.
        plugins.push(new webpack.ProvidePlugin({
            Promise: 'bluebird',
            moment: 'moment'
        }));

        //#endregion

        //#region Common chunks

        // Using this plugin to split source code into chunks
        // This is for improving loading process.
        plugins.push(new webpack.optimize.CommonsChunkPlugin({
            names: ['jQueryVendor', 'angularVendor', 'app'],//'vendor',
            minChunks: Infinity
        }));

        //#endregion

        // In production mode.
        if (bIsInProduction) {

            //#region Annotate

            //Automatically add annotation to angularjs modules.
            // Bundling can affect module initialization.
            plugins.push(new ngAnnotatePlugin({add: true}));

            //#endregion

            //#region Code uglify

            // Bundle source files.
            plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: true}
            }));

            //#endregion
        } else {
            //#region Browser sync

            // Require original index file.
            let browserSyncPlugin = new BrowserSyncPlugin({
                // browse to http://localhost:3000/ during development,
                // ./public directory is being served
                host: 'localhost',
                port: 8000,
                files: [
                    path.resolve(paths.source, 'index.html')
                ],
                server: {
                    baseDir: [
                        paths.dist
                    ]
                }
            });

            // Push plugins into list.
            plugins.push(browserSyncPlugin);

            //#endregion
        }

        //#region Html webpack

        //Automatically inject chunks into html files.
        plugins.push(new HtmlWebpackPlugin({
            template: path.resolve(paths.source, 'index.html'),
            // chunksSortMode: function (a, b) {
            //     //let order = ['app','angular-plugins', 'jquery-plugins'];
            //     var order = ['vendor', 'app'];
            //     return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
            // }
            chunksSortMode: 'dependency'
        }));

        //#endregion

        return plugins;
    }

    //#endregion
};