var express= require('express');
var request= require('request');
var router= express.Router();

var brewSchema= [
	{
		name: "Revolution Brewing",
		address: "2323 North Milwaukee Avenue, Chicago, IL 60647",
		phone: "(773) 227-2739",
		menu: "http://revbrew.com/brewpub/pub-menu",
    lat: "41.923618",
    lng: "-87.69814"
	},
	{
		name: "Half Acre Beer Company",
		address: "4257 North Lincoln Avenue, Chicago, IL 60618",
		phone: "(773) 248-4038",
		menu: "http://www.viewmenu.com/half-acre-tap-room/menu",
    lat: "41.9593418",
    lng: "-87.6819468"
	},
  {
    name: "Haymarket Pub & Brewery",
    address: "737 West Randolph Street, Chicago, IL 60661",
    phone: "(312) 638-0700",
    menu: "https://locu.com/places/haymarket-pub-brewery-chicago-us/#menu",
    lat: "41.884177",
    lng: "-87.647249"
  },
  {
    name: "Atlas Brewing Company",
    address: "2747 North Lincoln Avenue, Chicago, IL 60614",
    phone: "(773) 295-1270",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1714435-atlas-brewing-company/menu",
    lat: "41.931876",
    lng: "-87.657292"
  },
  {
    name: "DryHop Brewers",
    address: "3156 North Broadway Street, Chicago, IL 60657", //correct address is 3155, but results are fucked if 3155 used
    phone: "(773) 857-3155",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1757835-dryhop-brewers/menu",
    lat: "41.939351",
    lng: "-87.644205"
  },
  {
    name: "Goose Island",
    address: "1800 North Clybourn Avenue, Chicago, IL 60614",
    phone: "(312) 915-0071",
    menu: "http://www.gayot.com/restaurants/menu/goose-island-brewery-chicago-il-60614_5ch99343.html",
    lat: "41.913696",
    lng: "-87.653783"
  },
  {
    name: "Begyle Brewing Company",
    address: "1800 West Cuyler Avenue, Chicago, IL 60613", //ZIP code is weird, one says 60625 one says 60613s
    phone: "(773) 661-6963",
    menu: null,
    lat: "41.955284",
    lng: "-87.674506"
  },
  {
    name: "Piece Brewery & Pizzeria",
    address: "1927 West North Avenue, Chicago, IL 60622",
    phone: "(773) 772-4422",
    menu: "http://www.viewmenu.com/piece/menu",
    lat: "41.910327",
    lng: "-87.676104"
  },
  {
    name: "Lagunitas Brewing Company Chicago",
    address: "1843 South Washtenaw Avenue, Chicago, IL 60608",
    phone: "(707) 769-4495",
    menu: null,
    lat: "41.857202",
    lng: "-87.691988"
  }
];
//SCHEMA NOTES
/*
- beer list
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
  	title: 'Brewery Tour Planner',
  	breweries: brewSchema
  });
});

/* Find distance between points */
router.get('/dist', function(req, res) {
  console.log(req.query.addresses);
  var str= req.query.addresses.join('|'); //joins the array of addresses sent in `get` request
  //can move key out of URL and into env var
  console.log(str);
  request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode='+req.query.mode+'&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
  });
});

router.get('/swap', function(req, res) {
  var harr= [];
  for(var i= 0; i< brewSchema.length; i++) {
    harr.push({name: brewSchema[i].name, address: brewSchema[i].address});
  }
  res.send(harr);
});

router.get('/launch', function(req, res) {
  res.render('_tourWalk', {order: req.query.order}, function(err, html) {
    if(!err)
      res.send(html);
  });
});

router.get('/uber', function(req, res) {
  var ukey= '3hqL2q4aQR2zqCftvN6AhH0WxFgk3oqCWeBAPzzb'
  var s= req.query.startCo;
  var e= req.query.endCo;
  request({url: 'https://api.uber.com/v1/estimates/price?server_token='+ukey+'&start_latitude='+s[0]+'&start_longitude='+s[1]+'&end_latitude='+e[0]+'&end_longitude='+e[1], json: true}, function (error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

module.exports = router;