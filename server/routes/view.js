import express from 'express';
var router = express.Router();

// default address /view
// GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
