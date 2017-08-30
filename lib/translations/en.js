var local = {
  required: '":paramName" required',
  email: '":paramName" should look like an email address',
  contains: '":paramName" should contain :str',
  isAlpha: '":paramName" should contain only letters',
  equals: '":paramName" should be equal :comparison',
  alphanumeric: '":paramName" should be alphanumeric',
  array: '":paramName" should be an array',
  creditcard: '":paramName" should look like a credit card',
  currency: '":paramName" should look like currency',
  matches: '":paramName" should match :pattern',
  uuid: '":paramName" should be an UUID',
  in: '":paramName" should be one of [:values]',
  date: '":paramName" should be a date',
  decimal: '":paramName" should be a decimal number',
  integer: '":paramName" should be an integer',
  json: '":paramName" should be a JSON',
  null: '":paramName" should be null',
  numeric: '":paramName" should be a number',
  url: '":paramName" should be an URL',
  plainobject: '":paramName" should be a plain object',
  length: {
    between:
      '":paramName" length should be equals or greater then :min and equals or less then :max',
    max: '":paramName" length should be equals or less then :max',
    min: '":paramName" length should be equals or greater then :min'
  }
}

module.exports = local
