var express= require('express');
var request= require('request');
var db= require('../db/dbmain');
var router= express.Router();

//SCHEMA NOTES
/*
~ beer list
x name
x location + address
? type
? tour times
- description
x contact info
*/

router.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  db.getAll(function(breweries) {
    return res.render('index', {
      title: 'Chicago Brewery Tour Planner',
      breweries: breweries
    });
  });
});

router.get('/share/:id', function(req, res) {
  var sid= req.params.id;
  console.log("In share id");
  /*
  db.Share.find({_id: sid}, function(err, results) {
    var route= [];
    var names= [];
    for(var i= 0; i< results[0].length; i++) {
      route.push(results[0][i].addr);
      names.push(results[0][i].name);
    }
    var str= route.join('|');

    //Part of launch
    var infoHold= []
    function rend(infoHold) {
      return res.render('test', {
        title: 'Chicago Brewery Tour Planner',
        order: infoHold,
        pageid: sid
      });
    } 
    for(var j= 0; j< names.length; j++) {
      db.find(db.Brewery, {name: names[j]}, function(dbres) {
        infoHold.push(dbres[0]);
        if(infoHold.length== names.length)
          rend(infoHold);
      });
    }
    //End launch
  });
  */
});

router.get('/dist/:id', function(req, res) {//This is really dirty and I don't like doing it this way
  db.Share.find({_id: sid}, function(err, results) {
    var route= [];
    for(var i= 0; i< results[0].length; i++) {
      route.push(results[0][i].addr);
    }
    var str= route.join('|');
    //Get distance matrix
    request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode='+req.query.mode+'&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.send(body);
        }
    });
    //End distance matrix
  });
});

router.post('/share', function(req, res) {
  res.send("Sharing is caring");
});

/* Find distance between points */
router.get('/dist', function(req, res) {
  var str= req.query.addresses.join('|'); //joins the array of addresses sent in `get` request
  //can move key out of URL and into env var
  request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode='+req.query.mode+'&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
  });
});

router.get('/swap', function(req, res) { //sends array of name, address pairs
  db.getAll(function(breweries) {
    var brewSchemaHold= [];
    for(var i= 0; i< breweries.length; i++) {
      brewSchemaHold.push({name: breweries[i].name, address: breweries[i].address});
    }
    res.send(brewSchemaHold);
  });
});

router.get('/launch', function(req, res) { //renders out the template for launching the tour
  var infoPush= [];
  var rqo= req.query.order;
  function rend(infoPush) {
    return res.render('_tourWalk', {order: infoPush}, function(err, html) {
      if(err) return console.log(err);
      res.send(html);
    });
  } 
  for(var i= 0; i< rqo.length; i++) {
    db.find(db.Brewery, {name: rqo[i]}, function(dbres) {
      infoPush.push(dbres[0]);
      if(infoPush.length== rqo.length)
        rend(infoPush);
    });
  }
});

router.get('/uber', function(req, res) { //hits Uber API to get prices from one location to another
  var ukey= '3hqL2q4aQR2zqCftvN6AhH0WxFgk3oqCWeBAPzzb'
  var s= req.query.startCo;
  var e= req.query.endCo;
  request({url: 'https://api.uber.com/v1/estimates/price?server_token='+ukey+'&start_latitude='+s[0]+'&start_longitude='+s[1]+'&end_latitude='+e[0]+'&end_longitude='+e[1], json: true}, function (error, response, body) {
    if (!error && response.statusCode== 200) {
      res.render('_uberList', {ubl: body.prices}, function(err, html) {
        res.send(html);
      });
    }
  });
});

router.get('/untappd', function(req, res) {
  console.log("in here");
  var utcid= '4149526DC899177640B7E25BBB0D40D8A7F32E48';
  var utcs= 'E0B8914BF88C67A8645643B978BE65235BED4686';
  var holdarr= [];
  request({url: 'https://api.untappd.com/v4/venue/info/'+brewSchema[8].utvid+'?client_id='+utcid+'&client_secret='+utcs, json: true}, function (error, response, body) {
    if(!error&& response.statusCode== 200) {
      console.log(body.response.venue.top_beers);
      res.send(body);
      var tb= body.response.venue.top_beers;
      for(var i= 0; i< tb.count; i++) {
        var tbi= tb.items[i].beer;
        holdarr.push({bid: tbi.bid, name: tbi.beer_name, style: tbi.beer_style, score: tbi.rating_score});
      }
      console.log(holdarr);
    }
  });
});
module.exports = router;