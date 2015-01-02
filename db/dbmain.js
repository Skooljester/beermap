var mongoose= require('mongoose');
mongoose.connect('mongodb://heroku_app32604585:qe861rle9hc06ojvfe3valfq2g@ds047040.mongolab.com:47040/heroku_app32604585');
//mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

// ----- SCHEMAS -----
var beerSchema= mongoose.Schema({
  bid: {
    type: Number,
    unique: true
  },
  name: String,
  style: String,
  score: Number
});
var brewSchema= mongoose.Schema({
  name: String,
  utvid: {
    type: Number,
    unique: true
  },
  address: String,
  phone: String,
  url: String,
  lat: String,
  lng: String,
  locbeers: [beerSchema]
});
var shareSchema= mongoose.Schema({
  route: [
    {
      name: String,
      addr: String
    }
  ]
});
// ----- END SCHEMAS -----

var Brewery= mongoose.model('Brewery', brewSchema);
var Share= mongoose.model('Share', shareSchema);

// ----- START SCHEMA EXPORTS -----
module.exports.Brewery= Brewery;
module.exports.Share= Share;
// ----- END SCHEMA EXPORTS -----

// ----- START FUNCTION EXPORTS -----
module.exports.getAll= function(cb){ //only returns breweries
  Brewery.find(function (err, breweries) {
    if (err) return console.error(err);
    cb(breweries);
  });
};
module.exports.dbsave= function(obj, cb) {
  obj.save(function (err) {
    if(err) return console.log(err);
    return cb();
  });
};
module.exports.find = function(schemaName, findData, callback) {
  schemaName.find(findData, function(err, results) {
    if(err) {
      return console.log(err);
    }
    callback(results);
  });
};
module.exports.upd= function(schemaName, findData, updateData, callback) {
  schemaName.update(findData, updateData, function(err, aff) {
    if(err) {
      return console.log(err);
    }
    console.log('affected rows %d', aff);
    callback();
  });
};
module.exports.del = function(schemaName, findData, callback) {
  schemaName.remove(findData, function(err) {
    if(err) {
      return console.log(err);
    }
    callback();
  })
};
module.exports.create = function(schemaName, createData, callback) {
  var sub = new schemaName(createData);
  sub.save(function(err, sub) {
    if(err) {
      res.send(500, "That did not work so well");
      return console.log(err);
    }
    callback(sub);
  });
};
// ----- END FUNCTION EXPORTS -----