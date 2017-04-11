var get = require('lodash/get');
var escapeRegExp = require('lodash/escapeRegExp');
var replace = require('lodash/replace');

var enLocalization = {
    'required': 'The ":paramName" is required',
    'email': 'The ":paramName" must be a valid email address',
    'contains': 'The ":paramName" must contain ":str"',
    'isAlpha': 'The ":paramName" must only contains letters',
    'equals': 'The ":paramName" and ":comparison" must match',
    'alphanumeric': 'The ":paramName" may only contain letters and numbers',
    'array': 'The ":paramName" must be an array',
    'creditcard': 'The ":paramName" must be a valid creditcard number',
    'currency': 'The ":paramName" must be a valid currency',
    'matches': 'The ":paramName" must match the given pattern',
    'uuid': {
        'all': 'The ":paramName" must be a UUID',
        'version': 'The ":paramName" must be a UUID version ":version"'
    },
    'in': 'The ":paramName" must be either of ":values"',
    'date': 'The ":paramName" is not a valid date',
    'decimal': 'The ":paramName" must be a decimal number',
    'integer': 'The ":paramName" must be a integer number',
    'json': 'The ":paramName" must be a valid JSON string',
    'null': 'The ":paramName" must be null',
    'numeric': 'The ":paramName" must be a numeric value',
    'url': 'The ":paramName" is not a valid URL',
    'plainobject': 'The ":paramName" must be a plain object',
    'length': {
        'between': 'The ":paramName" length must be equal or greater then ":min" and equal or less then ":max"',
        'max': 'The ":paramName" length must be equal or less then ":max"',
        'min': 'The ":paramName" length must be equal or greater then ":min"'
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