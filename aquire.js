var mongoose = require('mongoose'),
    cheerio  = require('cheerio'),
    request  = require('request'),
    _        = require('lodash');

var db, pickupSchema, Pickup;

var source = 'http://www.gotlines.com/';

var categories = {
  'top': 'lines.php',
  'jokes': 'jokes/',
  'cheesy': 'lines/cheesy.php',
  'flattering': 'lines/flattering.php',
  'funny': 'lines/funny.php',
  'suggestive': 'lines/suggestive.php'
};

var category = process.argv[2] || 'all',
    count    = process.argv[3] || 25;

function init() {
  mongoose.connect('mongodb://localhost/pickups');
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', connectionOpen);
}

function connectionOpen() {
  pickupSchema = mongoose.Schema({
      text: String,
      category: String,
      rating: Number
  });

  Pickup = mongoose.model('Pickup', pickupSchema);

  getCategory(requestPage);
}

function getCategory(cb) {
  if (categories[category]) {
    if ('function' === typeof cb) {
      cb(categories[category], category);
    }
  } else {
    _.each(categories, function(mCat, pCat) {
      if ('function' === typeof cb) {
        cb(mCat, pCat);
      }
    });
  }
}

function requestPage(mCat, pCat) {
  request
    .get({
      url: source + mCat,
      timeout: 10000
    })
    .on('error', function(err) {
      console.log(err);
    })
    .on('response', function(response) {
      var body = '';

      response
        .on('data', function(data) {
          body += data;
        })
        .on('end', function() {
          if (200 === response.statusCode) {
            parsePage(body, pCat);
          } else {
            console.log(response.statusCode);
          }
        });
    });
}

function parsePage(page, cat) {
  var $ = cheerio.load(page);

  var rows = $('.line-row', '.indexcontain').parent('tr'), lines = [];

  rows.slice(0, count).each(function() {
    var temp = {};

    temp.category = cat;
    temp.text = $(this).find('a.linetext').text();
    temp.rating = parseInt($(this).find('span.up_votes').text()) - parseInt($(this).find('span.down_votes').text());

    lines.push(temp);
  });

  savePickups(lines);
}

function savePickups(pickupArr) {
  _.each(pickupArr, function(pickup) {
    pickup = new Pickup(pickup);

    Pickup
      .where({text: pickup.text})
      .findOne(function(err, results) {
        if (err) { return console.error(err); }

        if (!results) {
          pickup.save(function (err) {
            if (err) return console.error(err);
            console.log('New Pickup Saved');
          });
        } else {
          console.log('Duplicate Pickup');
        }
      });
  });
}

(function() {
  console.log('Getting pickup lines from category ' + category + ' at a count of ' + count + '.');
  init();
})();
