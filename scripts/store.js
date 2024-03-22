// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

const locations = require('../src/_data/locations.json');

module.exports = {
  makeLocations: function() {
    return JSON.stringify(locations);
  }
};
