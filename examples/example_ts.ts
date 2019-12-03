import validator from 'property-validator'

const presence = validator.presence
const email = validator.email
const assert = validator.assert

const user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}

assert(user, [presence('username'), email('email_address')])
