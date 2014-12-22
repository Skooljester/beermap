var express= require('express');
var request= require('request');
var fs= require('fs');
var router= express.Router();

var brewSchema= [
	{
		name: "Revolution Brewing",
    utvid: "2426",
		address: "2323 North Milwaukee Avenue, Chicago, IL 60647",
		phone: "(773) 227-2739",
		menu: "http://revbrew.com/brewpub/pub-menu",
    lat: "41.923618",
    lng: "-87.69814",
    locbeers: [
      {
        bid: 521475,
        name: 'Blue Gene',
        style: 'Imperial / Double Porter',
        score: 3.978
      },
      {
        bid: 34425,
        name: 'Samadhi',
        style: 'Imperial / Double IPA',
        score: 3.782
      },
      {
        bid: 263937,
        name: 'Bean Gene',
        style: 'American Porter',
        score: 4.137
      },
      {
        bid: 484971,
        name: 'Working Mom',
        style: 'Imperial / Double Brown Ale',
        score: 3.942
      },
      {
        bid: 7600,
        name: 'Eugene',
        style: 'American Porter',
        score: 3.781
      },
      {
        bid: 310056,
        name: 'Moby Wit',
        style: 'Witbier',
        score: 3.733
      },
      {
        bid: 911385,
        name: 'Executive Order',
        style: 'Wheat Wine',
        score: 3.66
      },
      {
        bid: 304264,
        name: 'Infiltrator',
        style: 'Doppelbock ',
        score: 3.603
      },
      {
        bid: 123854,
        name: 'A Little Crazy',
        style: 'Belgian Pale Ale',
        score: 3.816
      },
      {
        bid: 92280,
        name: 'Rise',
        style: 'American Stout',
        score: 3.814
      },
      {
        bid: 695996,
        name: 'Fist City',
        style: 'American Pale Ale',
        score: 3.828
      },
      {
        bid: 295520,
        name: 'Ivan\'s ESB',
        style: 'Extra Special/Strong Bitter',
        score: 3.572
      },
      {
        bid: 3351,
        name: 'Cross of Gold',
        style: 'Golden Ale',
        score: 3.598
      },
      {
        bid: 2983,
        name: 'Bottom Up Wit',
        style: 'Witbier',
        score: 3.553
      },
      {
        bid: 9275,
        name: 'Anti-Hero IPA',
        style: 'American IPA',
        score: 3.928
      }
    ]
	},
	{
		name: "Half Acre Beer Company",
    utvid: "8453",
		address: "4257 North Lincoln Avenue, Chicago, IL 60618",
		phone: "(773) 248-4038",
		menu: "http://www.viewmenu.com/half-acre-tap-room/menu",
    lat: "41.9593418",
    lng: "-87.6819468",
    locbeers: [
      {
        bid: 240832,
        name: 'Space India Pale Ale',
        style: 'American IPA',
        score: 3.996
      },
      {
        bid: 889825,
        name: 'Wooden Teeth',
        style: 'Saison / Farmhouse Ale',
        score: 3.556
      },
      {
        bid: 888973,
        name: 'Big Hugs (2014)',
        style: 'Imperial / Double Stout',
        score: 4.344
      },
      {
        bid: 7249,
        name: 'Daisy Cutter Pale Ale',
        style: 'American Pale Ale',
        score: 3.849
      },
      {
        bid: 905084,
        name: 'Tamayura',
        style: 'American Pale Ale',
        score: 3.734
      },
      {
        bid: 130087,
        name: 'The Hammer, The Bullet, & The Vise',
        style: 'English Brown Ale',
        score: 3.639
      },
      {
        bid: 303337,
        name: 'Crystal Norde',
        style: 'Baltic Porter',
        score: 3.818
      },
      {
        bid: 266540,
        name: 'Quakerbridge',
        style: 'American Barleywine',
        score: 3.851
      },
      {
        bid: 503019,
        name: 'Heyoka',
        style: 'American IPA',
        score: 3.984
      },
      {
        bid: 830187,
        name: 'Ghost Parade',
        style: 'Porter',
        score: 3.723
      },
      {
        bid: 910861,
        name: 'Big Hugs (With Chocolate City Coffee And Vanilla)',
        style: 'Stout',
        score: 4.074
      },
      {
        bid: 532548,
        name: 'Big Hugs Straight From A Bourbon Barrel',
        style: 'American Imperial / Double Stout',
        score: 4.029
      },
      {
        bid: 331215,
        name: 'Pony',
        style: 'Pilsner',
        score: 3.396
      },
      {
        bid: 13759,
        name: 'Double Fist',
        style: 'Imperial / Double IPA',
        score: 3.93
      },
      {
        bid: 123854,
        name: 'A Little Crazy',
        style: 'Belgian Pale Ale',
        score: 3.816
      }
    ]
	},
  {
    name: "Haymarket Pub & Brewery",
    utvid: "6962",
    address: "737 West Randolph Street, Chicago, IL 60661",
    phone: "(312) 638-0700",
    menu: "https://locu.com/places/haymarket-pub-brewery-chicago-us/#menu",
    lat: "41.884177",
    lng: "-87.647249",
    locbeers: [
      {
        bid: 23717,
        name: 'First Chance American IPA',
        style: 'American IPA',
        score: 3.685
      },
      {
        bid: 908598,
        name: 'Purple Sock Monkey Blackberry Saison',
        style: 'Saison / Farmhouse Ale',
        score: 3.618
      },
      {
        bid: 917889,
        name: 'Yet To Be Named Oatmeal Stout',
        style: 'Oatmeal Stout',
        score: 3.536
      },
      {
        bid: 892542,
        name: 'Mini Mathias IPA',
        style: 'American IPA',
        score: 3.608
      },
      {
        bid: 916280,
        name: 'Awkward Exchange',
        style: 'Belgian Brown Ale ',
        score: 3.583
      },
      {
        bid: 868541,
        name: 'Clare\'s Strong Scotch Ale',
        style: 'Scotch Ale / Wee Heavy',
        score: 3.593
      },
      {
        bid: 27280,
        name: 'Mathias® Imperial IPA',
        style: 'Imperial / Double IPA',
        score: 4.074
      },
      {
        bid: 884081,
        name: 'Too Hot For Sod',
        style: 'Dark Ale',
        score: 3.599
      },
      {
        bid: 855343,
        name: 'Girl And the Goatee VIII',
        style: 'Bière de Garde',
        score: 3.287
      },
      {
        bid: 876489,
        name: 'Batch #400 American IPA',
        style: 'American IPA',
        score: 3.932
      },
      {
        bid: 25294,
        name: 'Speakerswagon® Pilsner',
        style: 'Pilsner',
        score: 3.244
      },
      {
        bid: 9144,
        name: 'Shakespeare Oatmeal Stout',
        style: 'Oatmeal Stout',
        score: 3.747
      },
      {
        bid: 69073,
        name: 'Angry Birds',
        style: 'Belgian Strong Pale Ale',
        score: 3.74
      },
      {
        bid: 47454,
        name: 'Anthem Pear',
        style: 'Cider',
        score: 3.459
      },
      {
        bid: 307682,
        name: 'Neighborly Stout',
        style: 'Stout',
        score: 3.663
      }
    ]
  },
  {
    name: "Atlas Brewing Company",
    utvid: "298942",
    address: "2747 North Lincoln Avenue, Chicago, IL 60614",
    phone: "(773) 295-1270",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1714435-atlas-brewing-company/menu",
    lat: "41.931876",
    lng: "-87.657292",
    locbeers: []
  },
  {
    name: "DryHop Brewers",
    utvid: "225374",
    address: "3155 North Broadway Street, Chicago, IL 60657", //correct address is 3155, but results are fucked if 3155 used
    phone: "(773) 857-3155",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1757835-dryhop-brewers/menu",
    lat: "41.939351",
    lng: "-87.644205",
    locbeers: []
  },
  {
    name: "Goose Island",
    utvid: "881",
    address: "1800 North Clybourn Avenue, Chicago, IL 60614",
    phone: "(312) 915-0071",
    menu: "http://www.gayot.com/restaurants/menu/goose-island-brewery-chicago-il-60614_5ch99343.html",
    lat: "41.913696",
    lng: "-87.653783",
    locbeers: []
  },
  {
    name: "Begyle Brewing Company",
    utvid: "386651",
    address: "1800 West Cuyler Avenue, Chicago, IL 60613", //ZIP code is weird, one says 60625 one says 60613s
    phone: "(773) 661-6963",
    menu: null,
    lat: "41.955284",
    lng: "-87.674506",
    locbeers: []
  },
  {
    name: "Piece Brewery & Pizzeria",
    utvid: "3852",
    address: "1927 West North Avenue, Chicago, IL 60622",
    phone: "(773) 772-4422",
    menu: "http://www.viewmenu.com/piece/menu",
    lat: "41.910327",
    lng: "-87.676104",
    locbeers: []
  },
  {
    name: "Lagunitas Brewing Company Chicago",
    utvid: "1773303",
    address: "1843 South Washtenaw Avenue, Chicago, IL 60608",
    phone: "(707) 769-4495",
    menu: null,
    lat: "41.857202",
    lng: "-87.691988",
    locbeers: []
  }
];
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
  res.render('index', {
  	title: 'Chicago Brewery Tour Planner',
  	breweries: brewSchema
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
  var harr= [];
  for(var i= 0; i< brewSchema.length; i++) {
    harr.push({name: brewSchema[i].name, address: brewSchema[i].address});
  }
  res.send(harr);
});

router.get('/launch', function(req, res) { //renders out the template for launching the tour
  var infoPush= [];
  var rqo= req.query.order;
  for(var i= 0; i< rqo.length; i++) {
    for(var j= 0; j< brewSchema.length; j++) {
      if(rqo[i]== brewSchema[j].name)
        infoPush.push(brewSchema[j]);
    }
  }
  res.render('_tourWalk', {order: infoPush}, function(err, html) {
    if(!err)
      res.send(html);
  });
});

router.get('/uber', function(req, res) { //hits Uber API to get prices from one location to another
  var ukey= '3hqL2q4aQR2zqCftvN6AhH0WxFgk3oqCWeBAPzzb'
  var s= req.query.startCo;
  var e= req.query.endCo;
  request({url: 'https://api.uber.com/v1/estimates/price?server_token='+ukey+'&start_latitude='+s[0]+'&start_longitude='+s[1]+'&end_latitude='+e[0]+'&end_longitude='+e[1], json: true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('_uberList', {ubl: body.prices}, function(err, html) {
        res.send(html)
      });
    }
  });
});

router.get('/untappd', function(req, res) {
  console.log("in here");
  var utcid= '4149526DC899177640B7E25BBB0D40D8A7F32E48';
  var utcs= 'E0B8914BF88C67A8645643B978BE65235BED4686';
  var holdarr= [];
  request({url: 'https://api.untappd.com/v4/venue/info/'+brewSchema[3].utvid+'?client_id='+utcid+'&client_secret='+utcs, json: true}, function (error, response, body) {
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