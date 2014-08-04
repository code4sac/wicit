var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
dotenv.load();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WIC.it: Where to shop with WIC.', constants: JSON.stringify(process.env) });
});

module.exports = router;
