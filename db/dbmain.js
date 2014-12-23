var mongoose= require('mongoose');
mongoose.connect('mongodb://heroku_app32604585:qe861rle9hc06ojvfe3valfq2g@ds047040.mongolab.com:47040/heroku_app32604585');
//mongoose.connect('mongodb://localhost/test3');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
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

var Brewery= mongoose.model('Brewery', brewSchema);

module.exports.Brewery= Brewery;

module.exports.getAll= function(cb){ 
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