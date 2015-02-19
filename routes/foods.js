var fs = require('fs');
var express = require('express');
var router = express.Router();

var MAX_RESULTS = 100;

/* GET foods by search parameter. */
router.get('/', function(req, res) {
  // Get the query parameter 'q'
  var query = req.query.q;
  if ( ! query) {
    res.json([]);
  }
  // Read load foods JSON from file.
  fs.readFile('sample_data/foods.json', null, function (err, data) {
    if (err) {
      res.status(500).send("Error loading locations.");
    } else {
      var foods = JSON.parse(data);
      // Filter by search term.
      var filteredFoods = filterSearchResult(query, foods);
      res.json({
        count: filteredFoods.length,
        results: filteredFoods.slice(0, MAX_RESULTS)
      });
    }
  });

  /**
   * Two-pass, multi-field search. Combines all fields
   *   into one searchable string, then checks to see if:
   *   (1) The query appears in order within a single field
   *   (2) The fields (combined) contain all words of the query.
   *   Results satisfying (1) are given first, then (2).
   *
   * @param {string} query
   * @param {array} foods
   * @returns {array} filteredFoods
   */
  function filterSearchResult(query, foods)
  {
    query = query.trim();

    // Prefer matches in order
    var bestRegex = new RegExp(RegExp.quote(query), 'i');

    // Also accept arbitrarily ordered keywords
    var words = query.split(/\W/);
    var regex = '';
    for (var i = 0; i < words.length; i++) {
      if (words[i]) {
        regex += '(?=.*' + RegExp.quote(words[i]) + ')';
      }
    }
    regex = new RegExp(regex, 'i');

    var results = [];
    var bestResults = [];

    // Iterate over each food, concatenate the fields,
    //  and search against the result.
    for (var i = 0; i < foods.length; i++) {
      var text = [];
      for (var value in foods[i]) {
        text.push(foods[i][value]);
      }
      text = text.join(' | ');

      // Results where the query matches a single field,
      //  in order, are shown first.
      if (text.match(bestRegex)) {
        bestResults.push(foods[i]);
      } else if (text.match(regex)) {
        results.push(foods[i]);
      }
    }

    // Return best results first, then the rest.
    return bestResults.concat(results);
  }

  /**
   * Escape characters for inclusion in a regular expression.
   * @param  {string} unescaped
   * @return {string} escaped
   */
  RegExp.quote = function (string)
  {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };

});

module.exports = router;
