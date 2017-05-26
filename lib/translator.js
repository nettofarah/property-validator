var get = require('lodash/get');
var escapeRegExp = require('lodash/escapeRegExp');
var replace = require('lodash/replace');
var forOwn = require('lodash/forOwn');
var isUndefined = require('lodash/isUndefined');
var fallbackLocals = require('./translations/en');

function translate(message, params, localization) {
  if (isUndefined(localization)) {
    localization = fallbackLocals;
  }

  var fallbackTransMessage = get(fallbackLocals, message, message);
  var transMessage = get(localization, message, fallbackTransMessage);

  forOwn(params, function (value, key) {
    var regex = new RegExp(escapeRegExp(':' + key), 'g');
    transMessage = replace(transMessage, regex, params[key]);
  });

  return transMessage;
}

module.exports = translate;