var get = require('lodash/get')
var isString = require('lodash/isString')
var isArrayValidator = require('lodash/isArray')
var isPlainObjectValidator = require('lodash/isPlainObject')
var includes = require('lodash/includes')
var validator = require('validator')
var translator = require('./translator')
var defaultLocals = require('./translations/en')
var locals = defaultLocals

var validations = {}

validations.setLocals = function(newLocals) {
  locals = newLocals
}

validations.restoreDefaultLocals = function() {
  locals = defaultLocals
}

validations.presence = function presence(paramName, customMessage) {
  return function(params) {
    return {
      field: paramName,
      message: translator(
        customMessage || 'required',
        { paramName: paramName },
        locals
      ),
      result: get(params, paramName) != null
    }
  }
}

function checkParam(paramName, message, validator) {
  var extraArgs = Array.prototype.slice.call(arguments, 3, arguments.length)

  return function(params) {
    var param = get(params, paramName)

    return {
      field: paramName,
      message: message,
      result:
        typeof param !== 'undefined' &&
        validator.apply(null, [param + ''].concat(extraArgs))
    }
  }
}

validations.optional = function optional(validation, customMessage) {
  return function(params) {
    var validationResult = validation(params)
    var optionalField = validationResult.field

    var isPresent = !!get(params, optionalField)
    var successfulValidation = { result: true, field: optionalField }

    return isPresent ? validationResult : successfulValidation
  }
}

validations.email = validations.isEmail = function email(
  paramName,
  customMessage
) {
  return checkParam(
    paramName,
    translator(customMessage || 'email', { paramName: paramName }, locals),
    validator.isEmail
  )
}

validations.contains = function contains(paramName, str, customMessage) {
  return checkParam(
    paramName,
    translator(
      customMessage || 'contains',
      { paramName: paramName, str: str },
      locals
    ),
    validator.contains,
    str
  )
}

validations.isAlpha = function isAlpha(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isAlpha', { paramName: paramName }, locals),
    validator.isAlpha
  )
}

validations.equals = validations.isEqual = function equals(
  paramName,
  comparison,
  customMessage
) {
  return checkParam(
    paramName,
    translator(
      customMessage || 'equals',
      { paramName: paramName, comparison: comparison },
      locals
    ),
    validator.equals,
    comparison
  )
}

validations.isAlphanumeric = function isAlphanumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(
      customMessage || 'alphanumeric',
      { paramName: paramName },
      locals
    ),
    validator.isAlphanumeric
  )
}

validations.isArray = function isArray(paramName, customMessage) {
  return function(params) {
    return {
      field: paramName,
      message: translator(
        customMessage || 'array',
        { paramName: paramName },
        locals
      ),
      result: isArrayValidator(get(params, paramName))
    }
  }
}

validations.isCreditCard = function isCreditCard(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'creditcard', { paramName: paramName }, locals),
    validator.isCreditCard
  )
}

validations.isCurrency = function isCurrency(
  paramName,
  options,
  customMessage
) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'currency', { paramName: paramName }, locals),
    validator.isCurrency,
    options
  )
}

validations.matches = validations.format = function matches(
  paramName,
  pattern,
  customMessage
) {
  return checkParam(
    paramName,
    translator(
      customMessage || 'matches',
      { paramName: paramName, pattern: pattern.toString() },
      locals
    ),
    validator.matches,
    pattern
  )
}

validations.isUUID = validations.uuid = function isUUID(
  paramName,
  version,
  customMessage
) {
  if (isString(version)) {
    customMessage = version
    version = undefined
  }

  return checkParam(
    paramName,
    translator(
      customMessage || 'uuid',
      { paramName: paramName, version: version },
      locals
    ),
    validator.isUUID,
    version
  )
}

validations.isIn = validations.oneOf = function isIn(
  paramName,
  values,
  customMessage
) {
  return checkParam(
    paramName,
    translator(
      customMessage || 'in',
      { paramName: paramName, values: values.join(', ') },
      locals
    ),
    validator.isIn,
    values
  )
}

// TODO: write more tests (from isDate to isURL)
validations.isDate = function isDate(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'date', { paramName: paramName }, locals),
    validator.isDate
  )
}

validations.isDecimal = function isDecimal(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'decimal', { paramName: paramName }, locals),
    validator.isDecimal
  )
}

validations.isInt = function isInt(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'integer', { paramName: paramName }, locals),
    validator.isInt,
    options
  )
}

validations.isJSON = function isJSON(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'json', { paramName: paramName }, locals),
    validator.isJSON
  )
}

validations.isNull = function isNull(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'null', { paramName: paramName }, locals),
    validator.isNull
  )
}

validations.isNumeric = function isNumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'numeric', { paramName: paramName }, locals),
    validator.isNumeric
  )
}

validations.isURL = function isURL(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'url', { paramName: paramName }, locals),
    validator.isURL,
    options
  )
}

validations.isPlainObject = function isPlainObject(paramName, customMessage) {
  return function(params) {
    return {
      field: paramName,
      message: translator(
        customMessage || 'plainobject',
        { paramName: paramName },
        locals
      ),
      result: isPlainObjectValidator(get(params, paramName))
    }
  }
}

validations.isLength = validations.length = function isLength(
  paramName,
  options,
  customMessage
) {
  var validationMsg = 'length.between'
  if (typeof options.min === 'undefined') validationMsg = 'length.max'
  if (typeof options.max === 'undefined') validationMsg = 'length.min'

  return checkParam(
    paramName,
    translator(
      customMessage || validationMsg,
      { paramName: paramName, min: options.min, max: options.max },
      locals
    ),
    validator.isLength,
    options
  )
}

// TODO: Implement these validators
//
// isAfter(paramName [, date])
// isAscii(paramName)
// isBase64(paramName)
// isBefore(paramName [, date])
// isBoolean(paramName)
// isByteLength(paramName, min [, max])
// isDivisibleBy(paramName, number)
// isFQDN(paramName [, options])
// isFloat(paramName [, options])
// isFullWidth(paramName)
// isHalfWidth(paramName)
// isHexColor(paramName)
// isHexadecimal(paramName)
// isIP(paramName [, version])
// isISBN(paramName [, version])
// isISIN(paramName)
// isISO8601(paramName)
// isLowercase(paramName)
// isMACAddress(paramName)
// isMobilePhone(paramName, locale)
// isMongoId(paramName)
// isMultibyte(paramName)
// isSurrogatePair(paramName)
// isUppercase(paramName)
// isVariableWidth(paramName)
// isWhitelisted(paramName, chars)

module.exports = validations
