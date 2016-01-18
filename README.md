# node-request-validator
:white_check_mark: Make Request Validation great again.

Built on top of [validator.js](https://github.com/chriso/validator.js), node-request-validator makes validating request parameters easy and fun.

All you have to do is import some base validation functions and declare the validation rules for your request.

```javascript
import express from 'express'
import { assertParams, presence, email, middleware } from 'node-request-validator' 

const app = express();
app.get('/hello', function(req, res){
  assertParams(req, [
    presence('username'),
    email('email_address')
  ]);

  res.status(200).json({ name: req.query.username });
});

app.use(middleware);
```
