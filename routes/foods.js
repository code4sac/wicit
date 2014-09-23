var fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET foods by search parameter. */
router.get('/', function(req, res) {
  // Get the query parameter 'q'
  var query = req.query.q;
  if ( ! query) {
    res.json([]);
  }
  // Save a lowercase version of the query.
  var lcQuery = query.toLowerCase();
  // Read load foods JSON from file.
  fs.readFile('sample_data/foods.json', null, function (err, data) {
    if (err) {
      res.status(500).send("Error loading locations.");
    } else {
      var foods = JSON.parse(data);
      // Filter by search term.
      var filteredFoods = foods.filter(filterSearchResult);
      res.json(filteredFoods);
    }
  });

  /**
   * Super simple search: "Does food object contain query string in any of its attributes?"
   * TODO: Break query up by word.
   * @param food
   * @returns {boolean}
   */
  function filterSearchResult(food)
  {
    for(value in food) {
      if (food[value].toLowerCase().match(lcQuery)) {
        return true;
      }
    }
    return false;
  }

});

module.exports = router;
