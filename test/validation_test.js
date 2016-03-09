var assert = require('assert');
var validator = require('../index')

var email = validator.email;
var presence = validator.presence;
var validate = validator.validate;

describe('Validation', function() {
  var params;

  before(function() {
    params = {}
  });

  it('runs validations on the request params', function() {
    params = {
      login: 'nettofarah',
      password: 'secret',
      email: 'nettofarah@gmail.com'
    };

    var validation = validate(params, [
      presence('login'),
      presence('password'),
      email('email')
    ]);

    assert(validation.valid);
    assert(validation.errors.length == 0);
  });

  describe('failed validations', function() {
    var validation;

    before(function() {
      params = {
        login: 'nettofarah',
        email: 'nettofarahatgmail.com'
      };

      validation = validate(params, [
        presence('login'),
        presence('password'),
        email('email')
      ]);
    });

    it('only passes if all validations pass', function() {
      assert(validation.valid == false);
    });

    it('returns all failed validations', function() {
      assert(validation.errors.length == 2);
      assert(validation.errors[0].field == 'password');
      assert(validation.errors[1].field == 'email');
    });

    it('returns all the error messages', function() {
      assert.deepEqual(validation.messages, [
        '"password" required',
        '"email" should look like an email address'
      ]);
    });
  });

  describe('optional validation', function() {
    var params;
    var optional = validator.optional;

    before(function() {
      params = {}
    });

    it('allows optional fields', function() {
      var validation = validate(params, [
        optional(email('email_address')),
        optional(validator.isCreditCard('primary_cc'))
      ]);

      assert(validation.valid);
      assert(validation.errors.length == 0);
    });

    it('fails when the fields are present (and invalid)', function() {
      params = {
        primary_cc: '123 456'
      };

      var validation = validate(params, [
        optional(email('email_address')),
        optional(validator.isCreditCard('primary_cc'))
      ]);

      assert(!validation.valid);
      assert(validation.errors.length == 1);
      assert.deepEqual({
        field: 'primary_cc',
        message: '"primary_cc" should look like a credit card'
      }, validation.errors[0]);
    });

    it('does not interfere with good validations', function() {
      params = {
        email_address: 'nettofarah@gmail.com'
      };

      var validation = validate(params, [
        optional(email('email_address'))
      ]);

      assert(validation.valid);
      assert(validation.errors.length == 0);
    });
  });

  describe('Custom validation messages', function() {

    it('allows custom validation messages', function() {
      var validation = validate({}, [
        presence('name', 'Oops, you forgot to tell us your name')
      ]);

      var errors = validation.errors[0];
      assert.equal(errors.message, 'Oops, you forgot to tell us your name')
    });

    it('works with multi param helpers', function() {
      var isCurrency = validator.isCurrency;

      var params = {
        brl: '10.00',
        usd: '$$1.99',
        yen: '1000.00'
      };

      var validation = validate(params, [
        isCurrency('usd', 'Oops, this does not look like US dollars'),
        isCurrency('brl', { symbol: 'R$', require_symbol: true }, 'Reais are required to be prefixed with R$'),
        isCurrency('yen', { symbol: '¥', require_symbol: true })
      ]);

      var expectedErrors = [
        { field: 'usd', message: 'Oops, this does not look like US dollars' },
        { field: 'brl', message: 'Reais are required to be prefixed with R$' },
        { field: 'yen', message: '"yen" should look like currency' } // default error message
      ];

      assert.deepEqual(expectedErrors, validation.errors);
    });
  })
});


// No need to overtest here
// We can trust validator.js
describe('Validation Helpers', function() {
  var v = validator;

  function t(validation) {
    assert(validation.result);
  }

  function f(validation) {
    assert(!validation.result);
  }

  function m(validation, message) {
    assert.equal(validation.message, message)
  }

  it('works with nested props', function() {
    var params = {
      person: {
        email: 'nettofarah@gmail.com'
      }
    };

    var emailValidator = validator.email('person.email');
    assert(emailValidator(params).result);

    var invalidParams = {
      person: {
        email: 'invalid email'
      }
    };

    assert(emailValidator(invalidParams).result == false);
  });

  it('emails', function () {
    t(v.isEmail('i')({ i: 'nettofarah@gmail.com' }));
    f(v.isEmail('i')({ i: 'nettofarahatgmail.com' }));

    m(
      v.isEmail('i', 'bad email')({}),
      'bad email'
    );
  });

  it('contains', function() {
    t(v.contains('i', 'netto')({ i: 'nettofarah' }));
    f(v.contains('i', 'netto')({ i: 'martaleal' }));

    m(
      v.contains('i', 'netto', 'where is the thing?')({}),
      'where is the thing?'
    );
  });

  it('optional', function() {
    t(v.optional(v.isEmail('i'))({}));
    f(v.optional(v.isEmail('i'))({ i: 'nettofarahatgmail' }));
  })

  it('oneOf', function() {
    t(v.oneOf('fruit', ['banana', 'apple', 'orange'])({
      fruit: 'banana'
    }));

    t(v.oneOf('fruit', ['banana', 'apple', 'orange'])({
      fruit: 'apple'
    }));

    t(v.oneOf('fruit', ['banana', 'apple', 'orange'])({
      fruit: 'orange'
    }));

    f(v.oneOf('fruit', ['banana', 'apple', 'orange'])({ fruit: 'grape' }));
    f(v.oneOf('fruit', ['banana', 'apple', 'orange'])({ }));

    m(
      v.oneOf('fruit', ['banana', 'apple'])({ fruit: 'grape' }),
      '"fruit" should be one of [banana, apple]'
     )
  })

  it('isAlpha', function() {
    t(v.isAlpha('i')({ i: 'nettofarah' }));
    f(v.isAlpha('i')({ i: '123123' }));
  });

  it('equals', function() {
    t(v.equals('i', 'nettofarah')({ i: 'nettofarah' }));
    f(v.equals('i', 'nettofarah')({ i: 'buhh' }));

    t(v.isEqual('i', 'nettofarah')({ i: 'nettofarah' }));
    f(v.isEqual('i', 'nettofarah')({ i: 'buhh' }));
  });

  it('isAlphaNumeric', function() {
    t(v.isAlphanumeric('i')({ i: 'nettofarah123' }));
    f(v.isAlphanumeric('i')({ i: '#@' }));
  });

  it('isArray', function() {
    t(v.isArray('i')({ i: [1, 2, 3] }));
    f(v.isArray('i')({ i: 'bla' }));

    m(v.isArray('i')({ i: 'test' }), '"i" must be an array');
  });

  it('isCreditCard', function() {
    t(v.isCreditCard('i')({ i: '375556917985515' }));
    f(v.isCreditCard('i')({ i: '123123' }));
  });

  it('isCurrency', function() {
    t(v.isCurrency('i')({ i: '$10,123.45' }));
    f(v.isCurrency('i')({ i: 'bla' }));
  });

  it('matches', function() {
    t(v.matches('i', /\d+/)({ i: '123' }));
    t(v.matches('i', /\w+/)({ i: 'bla' }));
    f(v.matches('i', /\d+/)({ i: 'bla' }));

    t(v.format('i', /\d+/)({ i: '123' }));
    t(v.format('i', /\w+/)({ i: 'bla' }));
    f(v.format('i', /\d+/)({ i: 'bla' }));
  });

  it('isUUID / uuid', function() {
    t(v.isUUID('i')({ i: 'b7e34a19-1e65-4912-b43f-f68a93d4a1bd' }));
    t(v.isUUID('i')({ i: 'A987FBC9-4BED-4078-8F07-9141BA07C9F3' }));
    f(v.isUUID('i')({ i: 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3' }));
    f(v.isUUID('i')({ i: 'bla' }));

    t(v.uuid('i')({ i: 'b7e34a19-1e65-4912-b43f-f68a93d4a1bd' }));
    t(v.uuid('i')({ i: 'A987FBC9-4BED-4078-8F07-9141BA07C9F3' }));
    f(v.uuid('i')({ i: 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3' }));
    f(v.uuid('i')({ i: 'bla' }));
  });

  it('isPlainObject', function() {
    t(v.isPlainObject('i')({ i: { foo: true } }));
    f(v.isPlainObject('i')({ i: 'bla' }));
    m(v.isPlainObject('i')({ i: 'test' }), '"i" must be a plain object');
  });
});
