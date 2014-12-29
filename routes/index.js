var express= require('express');
var request= require('request');
var db= require('../db/dbmain');
var router= express.Router();

// var brewSchema= [
//   {
//     name: "Revolution Brewing",
//     address: "2323 North Milwaukee Avenue, Chicago, IL 60647"
//   },
//   {
//     name: "Half Acre Beer Company",
//     address: "4257 North Lincoln Avenue, Chicago, IL 60618"
//   },
//   {
//     name: "Haymarket Pub & Brewery",
//     address: "737 West Randolph Street, Chicago, IL 60661"
//   },
//   {
//     name: "Atlas Brewing Company",
//     address: "2747 North Lincoln Avenue, Chicago, IL 60614"
//   },
//   {
//     name: "DryHop Brewers",
//     address: "3155 North Broadway Street, Chicago, IL 60657"
//   },
//   {
//     name: "Goose Island",
//     address: "1800 North Clybourn Avenue, Chicago, IL 60614"
//   },
//   {
//     name: "Begyle Brewing Company",
//     address: "1800 West Cuyler Avenue, Chicago, IL 60613"
//   },
//   {
//     name: "Piece Brewery & Pizzeria",
//     address: "1927 West North Avenue, Chicago, IL 60622"
//   },
//   {
//     name: "Lagunitas Brewing Company Chicago",
//     address: "1843 South Washtenaw Avenue, Chicago, IL 60608"
//   }
// ];
// var brewSchema= updateBrew();
// function updateBrew() {
//   var brewSchemaHold= [];
//   db.getAll(function(breweries) {
//     for(var z= 0; z< breweries.length; z++) {
//       brewSchemaHold.push({name: breweries[z].name, address: breweries[z].address});
//     }
//   });
//   return brewSchemaHold;
// }
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
/* GET home page. */
router.get('/', function(req, res) {
  db.getAll(function(breweries) {
    return res.render('index', {
      title: 'Chicago Brewery Tour Planner',
      breweries: breweries
    });
  });
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