var express = require('express');
var validator = require('../index');

var assertAll = validator.assertAll;
var assertBody = validator.assertBody;
var assertQuery = validator.assertQuery;
var presence = validator.presence;
var email = validator.email;

var app = express();

app.get('/any-param', function(req, res){
  assertAll(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});


app.post('/body-params', function(req, res){
  assertBody(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});


app.get('/query-params', function(req, res){
  assertQuery(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});

app.use(validator.assertMiddleware);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
