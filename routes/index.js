var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
dotenv.load();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'WICit: Where to shop with WIC.',
    description: 'Where and how to get and use WIC: '
      + 'Find locations that accept WIC in California, '
      + 'using data from the California Department of '
      + 'Public Health.',
    mapboxId: process.env.MAPBOX_ID,
    mapboxToken: process.env.MAPBOX_TOKEN,
    apiToken: process.env.API_TOKEN,
    env: process.env.NODE_ENV
  });
});

module.exports = router;
