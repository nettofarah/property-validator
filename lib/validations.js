var get = require('lodash/get');
var validator = require('validator')

var validations = {}

validations.presence = function presence(paramName) {
  return function(params) {

    return {
      field: paramName,
      message: "\""+ paramName +"\"" + " required",
      result: !!get(params, paramName)
    }
  }
}

function checkParam(paramName, message, validator) {
  var extraArgs = Array.prototype.slice.call(arguments, 3, arguments.length);

  return function(params) {
    var param = get(params, paramName)

    return {
      field: paramName,
      message: "\""+ paramName +"\" " + message,
      result: validator.apply(null, [param].concat(extraArgs))
    }
  }
}

validations.email = validations.isEmail = function email(paramName) {
  return checkParam(paramName, 'should look like an email address', validator.isEmail);
}

validations.contains = function contains(paramName, str) {
  return checkParam(paramName, 'should look like an email address', validator.contains, str);
}

validations.isAlpha = function isAlpha(paramName) {
  return checkParam(paramName, 'should contain only letters', validator.isAlpha)
}

validations.equals = validations.isEqual = function equals(paramName, comparison) {
  return checkParam(paramName, 'should be equal ' + comparison, validator.equals, comparison)
}

validations.isAlphanumeric = function isAlphanumeric(paramName) {
  return checkParam(paramName, 'should be alphanumeric', validator.isAlphanumeric)
}

validations.isCreditCard = function isCreditCard(paramName) {
  return checkParam(paramName, 'should look like a credit card', validator.isCreditCard);
}

validations.isCurrency = function isCurrency(paramName, options) {
  return checkParam(paramName, 'should look like currency', validator.isCurrency, options);
}

validations.matches = validations.format = function matches(paramName, pattern) {
  return checkParam(paramName, 'should match ' + pattern.toString(), validator.matches, pattern);
}

// TODO: write more tests (from isDate to isUUID)
validations.isDate = function isDate(paramName) {
  return checkParam(paramName, 'should be a date', validator.isDate);
}

validations.isDecimal = function isDecimal(paramName) {
  return checkParam(paramName, 'should be a decimal number', validator.isDecimal);
}

validations.isIn = function isIn(paramName, values) {
  return checkParam(paramName, 'should be one of ' + values.join(', '), validator.isIn, values);
}

validations.isInt = function isInt(paramName, options) {
  return checkParam(paramName, 'should be an integer', validator.isInt, options);
}

validations.isJSON = function isJSON(paramName) {
  return checkParam(paramName, 'should be a JSON', validator.isJSON);
}

validations.isNull = function isNull(paramName) {
  return checkParam(paramName, 'should be null', validator.isNull);
}

validations.isNumeric = function isNumeric(paramName) {
  return checkParam(paramName, 'should be a number', validator.isNumeric);
}

validations.isURL = function isURL(paramName, options) {
  return checkParam(paramName, 'should be an URL', validator.isURL, options);
}

validations.isUUID = function isUUID(paramName, version) {
  return checkParam(paramName, 'should be an UUID', validator.isUUID, version);
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
// isLength(paramName, min [, max])
// isLowercase(paramName)
// isMACAddress(paramName)
// isMobilePhone(paramName, locale)
// isMongoId(paramName)
// isMultibyte(paramName)
// isSurrogatePair(paramName)
// isUppercase(paramName)
// isVariableWidth(paramName)
// isWhitelisted(paramName, chars)


module.exports = validations;
