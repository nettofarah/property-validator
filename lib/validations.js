var get = require('lodash/get');
var isString = require('lodash/isString');
var isArrayValidator = require('lodash/isArray');
var isPlainObjectValidator = require('lodash/isPlainObject');
var includes = require('lodash/includes');
var validator = require('validator');

var validations = {}

function message(paramName, message) {
  return '"'+ paramName +'" ' + message;
}

validations.presence = function presence(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: customMessage || message(paramName, "required"),
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
      result: validator.apply(null, [param + ""].concat(extraArgs))
    }
  }
}

validations.optional = function optional(validation, customMessage) {
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
    customMessage || message(paramName, 'should look like an email address'),
    validator.isEmail
  );
}

validations.contains = function contains(paramName, str, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should contain '+ str),
    validator.contains,
    str
  );
}

validations.isAlpha = function isAlpha(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should contain only letters'),
    validator.isAlpha
  );
}

validations.equals = validations.isEqual = function equals(paramName, comparison, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be equal ' + comparison),
    validator.equals,
    comparison
  );
}

validations.isAlphanumeric = function isAlphanumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be alphanumeric'),
    validator.isAlphanumeric
  );
}

validations.isArray = function isArray(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: customMessage || message(paramName, 'should be an array'),
      result: isArrayValidator(get(params, paramName))
    }
  }
}

validations.isCreditCard = function isCreditCard(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should look like a credit card'),
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
    customMessage || message(paramName, 'should look like currency'),
    validator.isCurrency,
    options
  );
}

validations.matches = validations.format = function matches(paramName, pattern, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should match ' + pattern.toString()),
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
    customMessage || message(paramName, 'should be an UUID'),
    validator.isUUID, version
  );
}

validations.isIn = validations.oneOf = function isIn(paramName, values, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be one of [' + values.join(', ') + ']'),
    validator.isIn,
    values
  );
}

// TODO: write more tests (from isDate to isURL)
validations.isDate = function isDate(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be a date'),
    validator.isDate
  );
}

validations.isDecimal = function isDecimal(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be a decimal number'),
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
    customMessage || message(paramName, 'should be an integer'),
    validator.isInt, options
  );
}

validations.isJSON = function isJSON(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be a JSON'),
    validator.isJSON
  );
}

validations.isNull = function isNull(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be null'),
    validator.isNull
  );
}

validations.isNumeric = function isNumeric(paramName, customMessage) {
  return checkParam(
    paramName,
    customMessage || message(paramName, 'should be a number'),
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
    customMessage || message(paramName, 'should be an URL'),
    validator.isURL,
    options
  );
}

validations.isPlainObject = function isPlainObject(paramName, customMessage) {
  return function(params) {

    return {
      field: paramName,
      message: customMessage || message(paramName, 'should be a plain object'),
      result: isPlainObjectValidator(get(params, paramName))
    }
  }
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
