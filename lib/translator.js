var get = require('lodash/get');
var escapeRegExp = require('lodash/escapeRegExp');
var replace = require('lodash/replace');

var enLocalization = {
    'email': 'The ":paramName" must be a valid email address',
    'contains': 'The ":paramName" must contain ":str"',
    'isAlpha': 'The ":paramName" should only contains letters',
    'length': {
        'between': 'The ":paramName" length should be equal or greater then ":min" and equal or less then ":max"',
        'max': 'The ":paramName" length should be equal or less then ":max"',
        'min': 'The ":paramName" length should be equal or greater then ":min"'
    }
}

function translate(message, params, localization) {
    if (typeof localization === 'undefined') {
        localization = enLocalization;
    }

    var transMessage = get(localization, message, message);

    Object.keys(params).forEach(function(key) {
        var regex = new RegExp(escapeRegExp(':' + key), 'g');
        transMessage = replace(transMessage, regex, params[key]);
    });

    return transMessage;
}

module.exports = translate;