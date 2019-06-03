const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Node Test Assignment. Please use /stack or /ttl-store routes to proceed');
});
module.exports = router;
