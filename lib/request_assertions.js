var validator = require('./request_validator');

function ValidationError(validation) {
  this.name = 'ValidationError';
  this.message = validation.messages.join(', ');
  this.messages = validation.messages;
  this.stack = (new Error()).stack;
  this.errors = validation.errors;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

function ensure(properties, validations, validationStrategy) {
  var validation = validationStrategy(properties, validations);

  if (!validation.valid) {
    throw new ValidationError(validation);
  }

  return validation;
}

function assert(properties, validations) {
  return ensure(properties, validations, validator.validate);
}

function assertHeaders(req, validations) {
  return ensure(req, validations, validator.validateHeaders);
}

function assertParams(req, validations) {
  return ensure(req, validations, validator.validateParams);
}

function assertBody(req, validations) {
  return ensure(req, validations, validator.validateBody);
}

function assertQuery(req, validations) {
  return ensure(req, validations, validator.validateQuery);
}

function assertAll(req, validations) {
  return ensure(req, validations, validator.validateAll);
}

module.exports = {
  ValidationError: ValidationError,
  assert: assert,
  assertHeaders: assertHeaders,
  assertParams: assertParams,
  assertBody: assertBody,
  assertQuery: assertQuery,
  assertAll: assertAll
}
