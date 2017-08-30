var ValidationError = require('./validation_error')

function assertMiddleware(err, req, res, next) {
  var isValidationError = err instanceof ValidationError

  if (!isValidationError) {
    return next(err)
  }

  var errors = err.messages
  res.status(422)

  res.format({
    text: function() {
      res.send('Invalid Request: ' + toText(errors))
    },
    json: function() {
      res.json({ errors: errors })
    }
  })

  res.end()
}

function toText(errors) {
  return errors.join(', ')
}

module.exports = assertMiddleware
