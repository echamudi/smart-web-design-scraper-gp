const path = require('path');

// For jest
module.exports = {
    presets: [
        [
            '@babel/preset-env', {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-typescript'
    ],
    plugins: [
        ["module-resolver", {
            root: ["./"],
            alias: {
                "Shared": './shared',
                "ChromeExt": './chrome-ext/lib',
                "Angular": './client/src',
                "Express": './server/src',
            }
        }]
    ],
    parserOpts: {
        strictMode: true
    }
};
