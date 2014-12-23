var mongoose= require('mongoose');
mongoose.connect('mongodb://heroku_app32604585:qe861rle9hc06ojvfe3valfq2g@ds047040.mongolab.com:47040/heroku_app32604585');
//mongoose.connect('mongodb://localhost/test4');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

// ----- SCHEMAS -----
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});
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
// ----- END SCHEMAS -----

var Brewery= mongoose.model('Brewery', brewSchema);

// ----- START SCHEMA EXPORTS -----
module.exports.Brewery= Brewery;
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
// ----- END FUNCTION EXPORTS -----