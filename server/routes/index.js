import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index', { title: process.env.WEB_TITLE });
});

export default router;
