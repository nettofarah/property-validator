function ValidationError(validation) {
  this.name = 'ValidationError'
  this.message = validation.messages.join(', ')
  this.messages = validation.messages
  this.stack = new Error().stack
  this.errors = validation.errors
}

ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError

module.exports = ValidationError
