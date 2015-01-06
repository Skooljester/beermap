var express= require('express');
var request= require('request');
var db= require('../db/dbmain');
var io= require('../io');
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

/* GET home page. */
router.get('/', function(req, res) {
  db.getAll(function(breweries) {
    return res.render('index', {
      title: 'Chicago Brewery Tour Planner',
      breweries: breweries
    });
  });
});

// ---------- SHARE STUFF ----------
router.param('id', function (req, res, next, id) {
  db.Share.find({_id: id}, function(err, results) {
    req.dbret= results[0].route;
    req.id= req.param('id');
    next();
    // --- TESTING ---
    // Not sure if I want this here or not
    var str= [];
    var route= [].map.call(results[0].route, function(obj) {
      str.push(obj.addr);
      return {location: obj.addr, stopover: true};
    });
    io.getDistMat(route, str.join('|'));
    // --- END TEST ---
  });
});
/*
router.get('/share/:id', function(req, res) {
  var names= [].map.call(req.dbret, function(obj) {
    return obj.name;
  });
  var infoHold= [];
  function rend(infoHold) {
    return res.render('test', {
      title: 'Chicago Brewery Tour Planner',
      order: infoHold,
      pageid: req.id
    });
  } 
  for(var j= 0; j< names.length; j++) {
    db.find(db.Brewery, {name: names[j]}, function(dbres) {
      infoHold.push(dbres[0]);
      if(infoHold.length== names.length)
        rend(infoHold);
    });
  }
  // May need to use this if order continues to be a problem
  // var z= 0;
  // function makeBlock() {
  //   db.find(db.Brewery, {name: names[z]}, function(dbres) {
  //     infoHold.push(dbres[0]);
  //     if(infoHold.length== names.length)
  //       rend(infoHold);
  //     else {
  //       z++;
  //       makeBlock();
  //     }
  //   });
  // }
});
*/

// ---------- SOCKET TEST ----------
router.get('/share/:id', function(req, res) {
  console.log("in share");
  var dbret= req.dbret;
  var names= [].map.call(dbret, function(obj) {
    return obj.name;
  });
  io.paneRender(res, names);//Calling this as soon as possible to get all calls done ASAP
  db.find(db.Brewery, {name: names[0]}, function(dbres) {
    return res.render('test2', {
      title: 'Chicago Brewery Tour Planner',
      order: dbres[0],
      names: names,
      pageid: req.id
    });
  });
});
// ---------- END SOCKET TEST ----------
/*
router.get('/dist/:id', function(req, res) {//This is really dirty and I don't like doing it this way
  var str= [];
  var route= [].map.call(req.dbret, function(obj) {
    str.push(obj.addr);
    return {location: obj.addr, stopover: true};
  });
  str= str.join('|');
  //Get distance matrix
  request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode='+req.query.mode+'&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200)
        res.send({gmres: body, rarr: route});
  });
  //End distance matrix
});
*/
router.post('/share', function(req, res) {
  var saveRoute= [];
  var shareRoute= req.body;
  for(var rkey in shareRoute)//Seems to preserve order
    saveRoute.push({"name": rkey, "addr": shareRoute[rkey]});
  db.create(db.Share, {route: saveRoute}, function(sub) {
    res.send('/share/'+sub._id);
  });
});

// ---------- END SHARE ----------

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
  for(var i= 0; i< rqo.length; i++) { //problem here with order not being correct
    db.find(db.Brewery, {name: rqo[i]}, function(dbres) {
      /*
      //If ordering becomes a problem, may need to use this instead
      for(var j= 0; j< rqo.length; j++) {
        if(dbres[0].name== rqo[j])
          rqo[j]= dbres[0];
      }
      */
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
module.exports= router;