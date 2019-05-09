import CONFIG from '../config';
const router = require('express').Router();
const knex = require('knex')(CONFIG.db);

router.use((req, res, next) => {
  const { host } = req.headers;
  const { protocol } = req;
  console.log(host, protocol);
  req.merchant = 2;
  next();
});

router.get('/info', (req, res, next) => {
  console.log(req.merchant);
  res.json({ title: 'info' });
});

module.exports = router;
