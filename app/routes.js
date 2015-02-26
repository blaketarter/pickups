var Pickup = require('./models/pickup');

module.exports = function(app) {

  app.get('/api/pickups', function(req, res) {
    var query = {},
        reqKeys = Object.keys(req.query);

    if (reqKeys.length) {
      reqKeys.forEach(function(v, k) {
        query[v] = req.query[v];
      });

      Pickup.find(query, function(err, pickups) {

        if (err) {
          res.send(err);
        }

        if (pickups.length) {
          res.json(pickups);
        } else {
          res.json({message: 'No Results'});
        }

      });
    } else {
      Pickup.find(function(err, pickups) {
          if (err) {
              res.send(err);
          }

          res.json(pickups);
      });
    }
  });

  app.get('/api/random', function(req, res) {
    var query = {},
        reqKeys = Object.keys(req.query);

    if (reqKeys.length) {
      reqKeys.forEach(function(v, k) {
        query[v] = req.query[v];
      });

      Pickup.find(query, function(err, pickups) {

        if (err) {
          res.send(err);
        }

        if (pickups.length) {
          res.json(pickups[Math.floor(Math.random() * pickups.length)]);
        } else {
          res.json({message: 'No Results'});
        }

      });
    } else {
      Pickup.find(function(err, pickups) {
          if (err) {
            res.send(err);
          }

          res.json(pickups[Math.floor(Math.random() * pickups.length)]);
      });
    }
  });
  
};
