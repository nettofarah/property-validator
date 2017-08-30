import express from 'express'

import {
  assertAll,
  assertBody,
  assertQuery,
  presence,
  email,
  assertMiddleware
} from '../index'

const app = express()

app.get('/any-param', (req, res) => {
  assertAll(req, [presence('username'), email('email_address')])

  res.status(200).json({ name: req.query.username })
})

app.post('/body-params', (req, res) => {
  assertBody(req, [presence('username'), email('email_address')])

  res.status(200).json({ name: req.query.username })
})

app.get('/query-params', (req, res) => {
  assertQuery(req, [presence('username'), email('email_address')])

  res.status(200).json({ name: req.query.username })
})

app.use(assertMiddleware)

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
