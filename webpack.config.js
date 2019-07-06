const path = require('path');

// Import webpack settings.
let webpackSettings = require('./webpack/setting.option');

// Import webpack rules.
const webpackRules = require('./webpack/rule.option');
const webpackPlugins = require('./webpack/plugin.option');

// True if built is set to production mode.
// False if built is set to development mode.
let bProductionMode = false;

// Get environment variable.
let env = process.env.NODE_ENV;
if (env && 'production' === env.trim().toLowerCase()) {
    bProductionMode = true;
}

// Build path options.
let paths = {
    root: __dirname,
    source: webpackSettings.paths.getSource(__dirname),
    app: webpackSettings.paths.getApplication(__dirname),
    dist: webpackSettings.paths.getDist(__dirname)
};


/*
* Module export.
* */
module.exports = {
    context: webpackSettings.paths.getSource(__dirname),
    devtool: !bProductionMode ? 'source-map' : false,
    entry: {
        'jQueryVendor': ['jquery', 'bluebird', 'bootstrap', 'admin-lte', 'moment'],
        'angularVendor': [
            'angular', '@uirouter/angularjs', 'angular-block-ui', 'angular-toastr',
            'angular-translate', 'angular-translate-loader-static-files', 'angular-moment'],
        'app': path.resolve(paths.app, 'app.js')
    },
    module: {
        rules: webpackRules.get()
    },
    plugins: webpackPlugins.get(paths, bProductionMode),
    output: {
        path: path.resolve(paths.dist),
        filename: '[name].[hash].js'
    }
};


// Return module configurations.
return module.exports;