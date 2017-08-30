var get = require('lodash/get')
var escapeRegExp = require('lodash/escapeRegExp')
var replace = require('lodash/replace')
var forOwn = require('lodash/forOwn')
var isUndefined = require('lodash/isUndefined')
var fallbackLocals = require('./translations/en')

function translator(message, params, localization) {
  if (isUndefined(localization)) {
    localization = fallbackLocals
  }

  var fallbackTranslationMessage = get(fallbackLocals, message, message)
  var translatedMessage = get(localization, message, fallbackTranslationMessage)

  forOwn(params, function(value, key) {
    var regex = new RegExp(escapeRegExp(':' + key), 'g')
    translatedMessage = replace(translatedMessage, regex, params[key])
  })

  return translatedMessage
}

module.exports = translator
