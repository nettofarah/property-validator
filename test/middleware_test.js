var assert = require('assert');

var express = require('express');
var request = require('supertest');

var nodeRequestValidator = require('../index');

var assertAll = nodeRequestValidator.assertAll;
var middleware = nodeRequestValidator.assertMiddleware;

var presence = nodeRequestValidator.presence;
var email = nodeRequestValidator.email;

describe('Validation Middleware', function() {

  var app;

  app = express();
  app.get('/hello', function(req, res){
    assertAll(req, [
      presence('username'),
      email('email_address')
    ]);

    res.status(200).json({ name: req.query.username });
  });

  app.get('/broken', function() {
    throw new Error('something unrelated');
    res.status(200);
  });

  app.use(middleware);

  it('sends the appropriate response code', function(done) {
    var response = request(app).get('/hello');
    response.expect(422, done);
  });

  it('sends all errors back in the response', function(done) {
    var response = request(app).
      get('/hello').
        set('Accept', 'application/json');


        var expectedResponse = {
          errors: [
            '"username" required',
            '"email_address" should look like an email address',
          ]
        };

        response.expect('Content-type', /json/);
        response.expect(422, expectedResponse, done);
  });

  it('respects the content type', function(done) {
    var response = request(app).get('/hello');
    response.expect('Content-type', 'text/plain; charset=utf-8');

    var expectedResponse = 'Invalid Request: "username" required, "email_address" should look like an email address';

    response.expect(422, expectedResponse, done);
  });

  it('does not intercept valid requests', function(done) {
    var response = request(app).get('/hello?username=netto&email_address=nettofarah@gmail.com');
    response.expect(200, { name: 'netto' }, done);
  });

  it('does not intercept unrelated errors', function(done) {
    var response = request(app).get('/broken');
    response.expect(500, done);
  });
});

