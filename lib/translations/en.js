var local = {
    'required': 'The ":paramName" is required',
    'email': 'The ":paramName" must be a valid email address',
    'contains': 'The ":paramName" must contain ":str"',
    'isAlpha': 'The ":paramName" must only contains letters',
    'equals': 'The ":paramName" and ":comparison" must match',
    'alphanumeric': 'The ":paramName" may only contain letters and numbers',
    'array': 'The ":paramName" must be an array',
    'creditcard': 'The ":paramName" must be a valid creditcard number',
    'currency': 'The ":paramName" must be a valid currency',
    'matches': 'The ":paramName" must match the given pattern',
    'uuid': {
        'all': 'The ":paramName" must be a UUID',
        'version': 'The ":paramName" must be a UUID version ":version"'
    },
    'in': 'The ":paramName" must be either of ":values"',
    'date': 'The ":paramName" is not a valid date',
    'decimal': 'The ":paramName" must be a decimal number',
    'integer': 'The ":paramName" must be a integer number',
    'json': 'The ":paramName" must be a valid JSON string',
    'null': 'The ":paramName" must be null',
    'numeric': 'The ":paramName" must be a numeric value',
    'url': 'The ":paramName" is not a valid URL',
    'plainobject': 'The ":paramName" must be a plain object',
    'length': {
        'between': 'The ":paramName" length must be equal or greater then ":min" and equal or less then ":max"',
        'max': 'The ":paramName" length must be equal or less then ":max"',
        'min': 'The ":paramName" length must be equal or greater then ":min"'
    }
}

module.exports = local;