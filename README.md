# property-validator
[![Build Status](https://travis-ci.org/nettofarah/property-validator.svg?branch=master)](https://travis-ci.org/nettofarah/property-validator)

:white_check_mark: Easy property validation for JavaScript, Node and Express

Built on top of [validator.js](https://github.com/chriso/validator.js), property-validator makes validating request parameters easy and fun.
No chaining, no prototype violations, no magic. Just some simple, stateless, javascript functions.

All you have to do is import some base validation functions and declare the validation rules for your request.

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Usage in NodeJS](#usage-in-nodejs)
    - [Request Validation](#request-validation)
        - [Request Parameters](#request-parameters)
        - [Query String](#query-string)
        - [Body](#body)
        - [Headers](#headers)
        - [Everything](#everything)
        - [Assert Middleware](#assert-middleware)
- [Advanced usage](#advanced-usage)
    - [Optional Validation](#optional-validation)
    - [Custom Error Messages](#custom-error-messages)
    - [Custom localization](#custom-localization)
    - [Custom Validation Functions](#custom-validation-functions)
- [Validation Helpers](#validation-helpers)
    - [Supported Helpers](#supported-helpers)
    - [Not currently supported](#not-currently-supported)
- [Usage with TypeScript](#usage-with-typescript)
- [Contributing](#contributing)
- [License](#license)

## Installation
```bash
npm install --save property-validator
```

## Usage
property-validator provides a suite of `validate` and `assert` functions to make request validation simple and easy to write.

`assert` functions halt the programs's execution if one of the validation rules breaks.

```javascript
import { assert, presence, email } from 'property-validator';

let user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}

assert(user, [
  presence('username'),
  email('email_address')
]);

// will throw a ValidationError

// /Users/netto/projects/property-validator/lib/request_assertions.js:8
//    throw new ValidationError(validation);
```

`validate` functions on the other hand, will return an object containing the result of all validations.

```javascript
import { validate, presence, email } from 'property-validator';

let user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}

validate(user, [
  presence('username'),
  email('email_address')
]);

// returns
{
  valid: false,
  errors :[
    {
      field: "email_address",
      message: "\"email_address\" should look like an email address"
    }
  ],
  messages: [
    "\"email_address\" should look like an email address"
  ]
}
```

`property-validator` really shines when you combine it with web servers.

## Usage in NodeJS

You can run validations and assertions against the request `body`, `query`, `params` and `headers`, or against all of them at once using `assertAll` or `validateAll`.

Using `assertAll`:

```javascript
import express from 'express';
import { assertAll, presence, email, assertMiddleware } from 'property-validator';

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
property-validator offers out of the box support for request params, query
string, body and header validations.

All you have to do is to import the correct function and annotate your request
handler.

#### Request Parameters

You can run validations against incoming request params.

```javascript
import { validateParams, presence } from 'property-validator';

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

or use the `assertParams` counterpart:
```javascript
import { assertParams, presence } from 'property-validator';

app.get('/hello/:username', function(req, res){
  assertParams(req, [
    presence('username')
  ]);

  // No need to check the validation result
  res.status(200).json({ name: req.query.username });
});
```

#### Query String

```javascript
import { validateQuery, email } from 'property-validator';

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

or use the `assertQuery` counterpart:
```javascript
import { assertQuery, email } from 'property-validator';

app.get('/hi', function(req, res){
  assertQuery(req, [
    email('primary_email_address')
  ]);

  // No need to check the validation result
  res.status(200).send('We promise not to send spam!');
});
```

#### Body

```javascript
import { validateBody, presence, email } from 'property-validator';

app.post('/sign-up', function(req, res){
  const validation = validateBody(req, [
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
or use the `assertBody` counterpart:

```javascript
import { assertBody, presence, email } from 'property-validator';

app.post('/sign-up', function(req, res){
  assertBody(req, [
    email('user.email'),
    presence('user.password'),
    presence('user.password_confirmation')
  ]);

  // No need to check the validation result
  res.status(200).send('Welcome!');
});
```

#### Headers
```javascript
import { validateHeaders, presence, format } from 'property-validator';

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

or use the `assertHeaders` counterpart:

```javascript
import { assertHeaders, presence, format } from 'property-validator';

app.get('/secret-stuff', function(req, res){
  assertHeaders(req, [
    presence('Authorization'),
    format('Authorization', /Token token="\w+"/)
  ]);

  // No need to check the validation result
  res.status(200).send('Here is all your secret stuff!');
});
```

#### Everything
You can use `validateAll` or `assertAll` to run validation rules against all properties at once (`body`, `params`, `query`).
Important: `validateAll` and `assertAll` will not run validations agains `headers` since they're pretty different use cases.

#### Assert Middleware
property-validator ships with a standard middleware that automatically handles assert errors.
All you have to do is to import `assertMiddleware` and mount it after all request handlers in your express app.

```javascript
import express from 'express';
import { assertAll, presence, email, assertMiddleware } from 'property-validator';

const app = express();

app.get('/hello', function(req, res){
  assertAll(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});

app.post('/bla', ...);
...

app.get('/test', ...);

app.use(assertMiddleware);
```

You can also roll your own middleware in case you need any sort of customization.

```javascript
import { ValidationError } from 'property-validator';

app.use(function(err, req, res, next) {
  // Do not swallow all kinds of errors
  const isValidationError = (err instanceof ValidationError);
  if (!isValidationError) {
    return next(err);
  }

  const messages = err.messages;
  res.status(422);

  res.json({
    notice: "Your request is invalid",
    errors: messages
  })
});
```

---

## Advanced usage

property-validator is extensible. You can set optional property validation, customize your custom messages and write your own validation functions.

### Optional Validation
`optional` is a special validation helper that can be used when fields are not
strictly required, but need to be validated in case they are present.

You can pass in any other validation helper, and propery-validator will only run
the helper function against the input params if the optional field is present.

Pagination is usually a good use case for optional params:

```javascript
var validation = validate(params, [
  optional(isNumeric('limit')),
  optional(isNumeric('offset'))
]);
```

### Custom Error Messages
Validation helpers allow custom messages to be set.
You can set the validation message to any string you want.

All you need to do is to pass in a custom error message as the last param when
calling any validation helper.

```javascript
var validation = validate(params, [
  presence('name', 'Oops, you forgot to tell us your name'),
  isCurrency('rent_in_brl', { symbol: 'R$' }, 'Reais should be prefixed with R$'),
  isCurrency('rent', 'This does not look like money')
]);
```

It is also possible to use some of the parameters of your validator in the error message.

```javascript
var validation = validate(params, [
  presence('name', 'Oops, you forgot to tell us your :paramName'),
  isLength('value', { min: 10, max: 99 }, 'The :paramName should be between :min and :max')
]);

//Oops, you forgot to tell us your name
//The value should be between 10 and 99
```

### Custom localization
It is possible to override the default locals. The locals is a simple object with keys refering to a validation function and there value the message.

```javascript
import { assert, presence, isLength, email, setLocals } from 'property-validator';
setLocals({
  required: 'Oops, you forgot to tell us your :paramName'
});

var validation = validate(params, [
  presence('name'),
  isLength('value', { min: 10, max: 99 }, 'The :paramName should be between :min and :max'),
  email('email')
]);

//Oops, you forgot to tell us your name
//The value should be between 10 and 99
//"email" should look like an email address
```
As you can see all kind of combinations are possible. You can override the default locals and still set a custom message. 
And if you neither supply a translation through the setLocals nor set a custom message, it will fall back to the default locals.

If you would like to restore the locals to the default locals simply call `restoreDefaultLocals` like so:

```javascript
import { restoreDefaultLocals } from 'property-validator';

restoreDefaultLocals();
```

### Custom Validation Functions
Writing your own validation functions is easy.

```javascript
// Your function will receive a property name as its argument
function isTheUltimateAnswer(propertyName) {
  // and then return a function that takes the
  // actual object you want to validate
  return function(subject) {
    var value = subject[propertyName]
    var isAnswer = value === 42

    // Make sure your function returns `result`, `message`
    // and `field`
    return {
      result: isAnswer,
      message: value + " is not the Answer to the Ultimate Question of Life, The Universe, and Everything",
      field: propertyName
    }
  }
}
```

You can now use your custom function as you would with any other validation helper:

```javascript
var subject = {
  'guess': 43
}

var validation = validate(subject, [
  isTheUltimateAnswer('guess')
]);
```

---

## Validation Helpers
Validation helpers are functions you can use to validate incoming request properties.

property-validator relies on the super battle tested [validator.js](https://github.com/chriso/validator.js) library.

### Supported Helpers
Here's a list of currently supported helpers:

| Helper | Description |
|--------|-------------|
|presence(paramName)| check if the current param is present. |
|optional(validationHelper(paramName, ...)) | takes in another validation helper and only runs the validation if the optional field is present. |
|oneOf(paramName, optionList)| checks if the input param is one of the values within a list of valid options. |
|contains(paramName, seed)| check if the string contains the seed. |
|equals(paramName, comparison)| check if the string matches the comparison. |
|isAlpha(paramName)| check if the string contains only letters (a-zA-Z). |
|isAlphanumeric(paramName)| check if the string contains only letters and numbers. |
|isArray(paramName)| check if the current param is an array. |
|isCreditCard(paramName)| check if the string is a credit card. |
|isCurrency(paramName, options)| check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`. |
|isDate(paramName)| check if the string is a date. |
|isDecimal(paramName)| check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc. |
|isEmail(paramName [, options])| check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true, require_tld: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part. If `require_tld` is set to false, e-mail addresses without having TLD in their domain will also be matched. |
|isIn(paramName, values)| check if the string is in a array of allowed values. |
|isInt(paramName [, options])| check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`). |
|isJSON(paramName)| check if the string is valid JSON (note: uses JSON.parse). |
|isNull(paramName)| check if the string is null. |
|isNumeric(paramName)| check if the string contains only numbers. |
|isURL(paramName [, options])| check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, require_valid_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`. |
|isUUID(paramName [, version])| check if the string is a UUID (version 3, 4 or 5). |
|matches(paramName, pattern [, modifiers])| check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`. |
|isPlainObject(paramName)| check if the current param is a plain object. |
|isLength(paramName, options) | check if the string's length falls in a range. Note: this function takes into account surrogate pairs. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`). |

### Not currently supported
These are a few other helpers avaliable in [validator.js](https://github.com/chriso/validator.js) that could be used in property-validator.
Feel free to submit a PR if you need any of these functions.

| Helper | Description |
|--------|-------------|
| isAfter(paramName [, date]) | check if the string is a date that's after the specified date (defaults to now). |
| isAscii(paramName) | check if the string contains ASCII chars only. |
| isBase64(paramName) | check if a string is base64 encoded. |
| isBefore(paramName [, date]) | check if the string is a date that's before the specified date. |
| isBoolean(paramName) | check if a string is a boolean. |
| isByteLength(paramName, min [, max]) | check if the string's length (in bytes) falls in a range. |
| isDivisibleBy(paramName, number) | check if the string is a number that's divisible by another. |
| isFQDN(paramName [, options]) | check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`. |
| isFloat(paramName [, options]) | check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`). |
| isFullWidth(paramName) | check if the string contains any full-width chars. |
| isHalfWidth(paramName) | check if the string contains any half-width chars. |
| isHexColor(paramName) | check if the string is a hexadecimal color. |
| isHexadecimal(paramName) | check if the string is a hexadecimal number. |
| isIP(paramName [, version]) | check if the string is an IP (version 4 or 6). |
| isISBN(paramName [, version]) | check if the string is an ISBN (version 10 or 13). |
| isISIN(paramName) | check if the string is an [ISIN][ISIN] (stock/security identifier). |
| isISO8601(paramName) | check if the string is a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date. |
| isLowercase(paramName) | check if the string is lowercase. |
| isMACAddress(paramName) | check if the string is a MAC address. |
| isMobilePhone(paramName, locale) | check if the string is a mobile phone number, (locale is one of `['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ', 'en-IN']`). |
| isMongoId(paramName) | check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid]. |
| isMultibyte(paramName) | check if the string contains one or more multibyte chars. |
| isSurrogatePair(paramName) | check if the string contains any surrogate pairs chars. |
| isUppercase(paramName) | check if the string is uppercase. |
| isVariableWidth(paramName) | check if the string contains a mixture of full and half-width chars. |
| isWhitelisted(paramName, chars) | checks characters if they appear in the whitelist. |

## Usage with TypeScript

There is no need to install additional type definitions for property-validator since it ships with TypeScript definition files.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/nettofarah/property-validator. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Code of Conduct](https://github.com/nettofarah/property-validator/blob/master/CODE_OF_CONDUCT.md).

To run the specs check out the repo and follow these steps:

```bash
$ npm install
$ npm run test
```

## License

The module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
