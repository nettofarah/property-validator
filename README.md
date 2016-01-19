# node-request-validator
:white_check_mark: Make Request Validation great again.

Built on top of [validator.js](https://github.com/chriso/validator.js), node-request-validator makes validating request parameters easy and fun.
No chaining, no prototype violations, no magic. Just some simple, stateless, javascript functions.

All you have to do is import some base validation functions and declare the validation rules for your request.

## Instalation
```bash
npm install --save node-request-validator
```

## Usage
node-request-validator provides a suite of `validate` and `assert` functions to make request validation simple and easy to write.

`assert` functions halt the request handler's exection if one of the validation rules breaks.

`validate` functions on the other hand, will return an object that you can query containing the result of all validations.

You can run validations and assertions against the request `body`, `query`, `params` and `headers`, or against all of them at once using `assertAll` or `validateAll`.

Using `assertAll`:

```javascript
import express from 'express';
import { assertAll, presence, email, assertMiddleware } from 'node-request-validator';

const app = express();

app.get('/hello', function(req, res){
  assertAll(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});

app.use(assertMiddleware);
```

### Request Validation
node-request-validator offers out of the box support for request params, query
string, body and header validations.

All you have to do is to import the correct function and annotate your request
handler.

#### Request Parameters

You can run validations agains incoming request params.

```javascript
import { validateParams, presence } from 'node-request-validator';

app.get('/hello/:username', function(req, res){
  const validation = validateParams(req, [
    presence('username')
  ]);

  if (validation.valid) {
    res.status(200).json({ name: req.query.username });
  } else {
    res.status(422).json({ errors: validation.errors });
  }
});
```

#### Query String

```javascript
import { validateQuery, email } from 'node-request-validator';

app.get('/hi', function(req, res){
  const validation = validateQuery(req, [
    email('primary_email_address')
  ]);

  if (validation.valid) {
    res.status(200).send('We promise not to send spam!');
  } else {
    res.status(422).json({ errors: validation.errors });
  }
});
```

#### Body

```javascript
import { validateBody, presence, email } from 'node-request-validator';

app.post('/sign-up', function(req, res){
  const validation = validateQuery(req, [
    email('user.email'),
    presence('user.password'),
    presence('user.password_confirmation')
  ]);

  if (validation.valid) {
    res.status(200).send('Welcome!');
  } else {
    res.status(422).send({ errors: validation.errors });
  }
});
```

#### Headers
```javascript
import { validateHeaders, presence, format } from 'node-request-validator';

app.get('/secret-stuff', function(req, res){
  const validation = validateHeaders(req, [
    presence('Authorization'),
    format('Authorization', /Token token="\w+"/)
  ]);

  if (validation.valid) {
    res.status(200).send('Here is all your secret stuff!');
  } else {
    res.status(401).send('You shall not pass!');
  }
});
```

#### Everything
You can use `validateAll` to run validation rules against all properties at once (`body`, `params`, `query` and `headers`).

### Validation Helpers
Validation helpers are functions you can use to validate incoming request properties.

```javascript
import { presence, email  } from 'node-request-validator';

const presenceValidator = presence('username');
const emailValidator = email('email_address');

console.log(presenceValidator({ username: 'nettofarah' }));
// { field: 'username', message: 'username required', result: true }

console.log(emailValidator({ email_address: 'nettofarahatgmail.com' }));
// { field: 'email_address', message: 'email_address should look like an email address', result: false }
```
Check out the [complete list of supported validation functions](#).
