var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
dotenv.load();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'WICit: Where to shop with WIC.',
    mapboxId: process.env.MAPBOX_ID,
    mapboxToken: process.env.MAPBOX_TOKEN
  });
});

module.exports = router;
