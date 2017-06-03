var get = require('lodash/get');
var isString = require('lodash/isString');
var isArrayValidator = require('lodash/isArray');
var isPlainObjectValidator = require('lodash/isPlainObject');
var isUndefinedValidator = require('lodash/isUndefined');
var includes = require('lodash/includes');
var validator = require('validator');
var translator = require('./translator');
var defaultLocals = require('./translations/en');
var locals = defaultLocals;

var validations = {}

validations.setLocals = function(newLocals) {
  locals = newLocals;
}

validations.restoreDefaultLocals = function() {
  locals = defaultLocals;
}

validations.presence = function presence(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: translator(customMessage || 'required', {paramName: paramName}, locals),
      result: get(params, paramName) != null
    }
  }
}

function checkParam(paramName, message, validator) {
  var extraArgs = Array.prototype.slice.call(arguments, 3, arguments.length);

  return function(params) {
    var param = get(params, paramName)

    return {
      field: paramName,
      message: message,
      result: (!isUndefinedValidator(param)) && validator.apply(null, [param + ""].concat(extraArgs))
    }
  }
}

validations.optional = function optional(validation) {
  return function(params) {
    var validationResult = validation(params);
    var optionalField = validationResult.field;

    var isPresent = !!get(params, optionalField);
    var successfulValidation = { result: true, field: optionalField };

    return isPresent ? validationResult : successfulValidation;
  }
}

validations.email = validations.isEmail = function email(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'email', {paramName: paramName}, locals),
    validator.isEmail
  );
}

validations.contains = function contains(paramName, str, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'contains', {paramName: paramName, str: str}, locals),
    validator.contains,
    str
  );
}

validations.isAlpha = function isAlpha(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isAlpha', {paramName: paramName}, locals),
    validator.isAlpha
  );
}

validations.equals = validations.isEqual = function equals(paramName, comparison, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'equals', {paramName: paramName, comparison: comparison}, locals),
    validator.equals,
    comparison
  );
}

validations.isAlphanumeric = function isAlphanumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'alphanumeric', {paramName: paramName}, locals),
    validator.isAlphanumeric
  );
}

validations.isArray = function isArray(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: translator(customMessage || 'array', {paramName: paramName}, locals),
      result: isArrayValidator(get(params, paramName))
    }
  }
}

validations.isCreditCard = function isCreditCard(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'creditcard', {paramName: paramName}, locals),
    validator.isCreditCard
  );
}

validations.isCurrency = function isCurrency(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'currency', {paramName: paramName}, locals),
    validator.isCurrency,
    options
  );
}

validations.matches = validations.format = function matches(paramName, pattern, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'matches', {paramName: paramName, pattern: pattern.toString()}, locals),
    validator.matches, pattern
  );
}

validations.isUUID = validations.uuid = function isUUID(paramName, version, customMessage) {
  if (isString(version)) {
    customMessage = version
    version = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'uuid', {paramName: paramName, version: version}, locals),
    validator.isUUID, version
  );
}

validations.isIn = validations.oneOf = function isIn(paramName, values, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'in', {paramName: paramName, values: values.join(', ')}, locals),
    validator.isIn,
    values
  );
}

// TODO: write more tests (from isDate to isURL)
validations.isDate = function isDate(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'date', {paramName: paramName}, locals),
    validator.isDate
  );
}

validations.isDecimal = function isDecimal(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'decimal', {paramName: paramName}, locals),
    validator.isDecimal
  );
}

validations.isInt = function isInt(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'integer', {paramName: paramName}, locals),
    validator.isInt, options
  );
}

validations.isJSON = function isJSON(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'json', {paramName: paramName}, locals),
    validator.isJSON
  );
}

validations.isNull = function isNull(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'null', {paramName: paramName}, locals),
    validator.isNull
  );
}

validations.isNumeric = function isNumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'numeric', {paramName: paramName}, locals),
    validator.isNumeric
  );
}

validations.isURL = function isURL(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'url', {paramName: paramName}, locals),
    validator.isURL,
    options
  );
}

validations.isPlainObject = function isPlainObject(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: translator(customMessage || 'plainobject', {paramName: paramName}, locals),
      result: isPlainObjectValidator(get(params, paramName))
    }
  }
}

validations.isLength = validations.length = function isLength(paramName, options, customMessage) {
  var validationMsg = 'length.between';
  if (isUndefinedValidator(options.min)) validationMsg = 'length.max';
  if (isUndefinedValidator(options.max)) validationMsg = 'length.min';

  return checkParam(
    paramName,
    translator(customMessage || validationMsg, {paramName: paramName, min: options.min, max: options.max}, locals),
    validator.isLength,
    options
  );
}

validations.isBoolean = function isBoolean(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isBoolean', {paramName: paramName}, locals),
    validator.isBoolean
  )
}

validations.isAscii = function isAscii(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isAscii', {paramName: paramName}, locals),
    validator.isAscii
  )
}

validations.isBase64 = function isBase64(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isBase64', {paramName: paramName}, locals),
    validator.isBase64
  )
}

validations.isFullWidth = function isFullWidth(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isFullWidth', {paramName: paramName}, locals),
    validator.isFullWidth
  )
}

validations.isHalfWidth = function isHalfWidth(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isHalfWidth', {paramName: paramName}, locals),
    validator.isHalfWidth
  )
}

validations.isHexColor = function isHexColor(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isHexColor', {paramName: paramName}, locals),
    validator.isHexColor
  )
}

validations.isHexadecimal = function isHexadecimal(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isHexadecimal', {paramName: paramName}, locals),
    validator.isHexadecimal
  )
}

validations.isISIN = function isISIN(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isISIN', {paramName: paramName}, locals),
    validator.isISIN
  )
}

validations.isISO8601 = function isISO8601(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isISO8601', {paramName: paramName}, locals),
    validator.isISO8601
  )
}

validations.isLowercase = function isLowercase(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isLowercase', {paramName: paramName}, locals),
    validator.isLowercase
  )
}

validations.isMACAddress = function isMACAddress(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isMACAddress', {paramName: paramName}, locals),
    validator.isMACAddress
  )
}

validations.isMongoId = function isMongoId(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isMongoId', {paramName: paramName}, locals),
    validator.isMongoId
  )
}

validations.isMultibyte = function isMultibyte(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isMultibyte', {paramName: paramName}, locals),
    validator.isMultibyte
  )
}

validations.isSurrogatePair = function isSurrogatePair(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isSurrogatePair', {paramName: paramName}, locals),
    validator.isSurrogatePair
  )
}

validations.isUppercase = function isUppercase(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isUppercase', {paramName: paramName}, locals),
    validator.isUppercase
  )
}

validations.isVariableWidth = function isVariableWidth(paramName, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isVariableWidth', {paramName: paramName}, locals),
    validator.isVariableWidth
  )
}

validations.isDivisibleBy = function isDivisibleBy(paramName, number, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isDivisibleBy', {paramName: paramName}, locals),
    validator.isDivisibleBy, number
  )
}

validations.isBefore = function isBefore(paramName, date, customMessage) {
  if (!validator.isDate(date)) {
    customMessage = date;
    //always set date to now if no date supplied, same default as validator itself
    //we need this to be able to generate a proper translation message
    date = String(new Date());
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isBefore', {paramName: paramName, date: date}, locals),
    validator.isBefore, date
  )
}

validations.isAfter = function isAfter(paramName, date, customMessage) {
  if (!validator.isDate(date)) {
    customMessage = date;
    //date gets set for the same reason as in the `isBefore`
    date = String(new Date());
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isAfter', {paramName: paramName, date: date}, locals),
    validator.isAfter, date
  )
}

validations.isMobilePhone = function isMobilePhone(paramName, locale, customMessage) {
  return checkParam(
    paramName,
    translator(customMessage || 'isMobilePhone', {paramName: paramName, locale: locale}, locals),
    validator.isMobilePhone, locale
  )
}

validations.isWhitelisted = function isWhitelisted(paramName, chars, customMessage) {
  var joinedChars = isArrayValidator(chars) ? chars.join('') : chars;
  return checkParam(
    paramName,
    translator(customMessage || 'isWhitelisted', {paramName: paramName, chars: joinedChars}, locals),
    validator.isWhitelisted, chars
  )
}

validations.isByteLength = function isByteLength(paramName, options, customMessage) {
  var validationMsg = 'byteLength.between';
  if (isUndefinedValidator(options.min)) validationMsg = 'byteLength.max';
  if (isUndefinedValidator(options.max)) validationMsg = 'byteLength.min';

  return checkParam(
    paramName,
    translator(customMessage || validationMsg, {paramName: paramName, min: options.min, max: options.max}, locals),
    validator.isByteLength, options
  );
}

validations.isFQDN = function isFQDN(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isFQDN', {paramName: paramName}, locals),
    validator.isFQDN, options
  );
}

validations.isFloat = function isFloat(paramName, options, customMessage) {
  if (isString(options)) {
    customMessage = options
    options = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isFloat', {paramName: paramName}, locals),
    validator.isFloat, options
  );
}

validations.isIP = function isIP(paramName, version, customMessage) {
  if (isString(version)) {
    customMessage = version
    version = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isIP', {paramName: paramName, version: version}, locals),
    validator.isIP, version
  );
}

validations.isISBN = function isISBN(paramName, version, customMessage) {
  if (isString(version)) {
    customMessage = version
    version = undefined
  }

  return checkParam(
    paramName,
    translator(customMessage || 'isISBN', {paramName: paramName, version: version}, locals),
    validator.isISBN, version
  );
}

module.exports = validations;
