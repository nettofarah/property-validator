var get = require('lodash/get');
var escapeRegExp = require('lodash/escapeRegExp');
var replace = require('lodash/replace');
var fallbackLocals = require('./translations/en');

function translate(message, params, localization) {
    if (typeof localization === 'undefined') {
        localization = fallbackLocals;
    }

    var fallbackTransMessage = get(fallbackLocals, message, message);
    var transMessage = get(localization, message, fallbackTransMessage);

    Object.keys(params).forEach(function(key) {
        var regex = new RegExp(escapeRegExp(':' + key), 'g');
        transMessage = replace(transMessage, regex, params[key]);
    });

    return transMessage;
}

module.exports = translate;