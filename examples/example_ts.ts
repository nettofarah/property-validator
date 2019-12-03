import { assert, email, presence } from 'property-validator'

const user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}

assert(user, [presence('username'), email('email_address')])
