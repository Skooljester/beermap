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
    address: "3155 North Broadway Street, Chicago, IL 60657",
    phone: "(773) 857-3155",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1757835-dryhop-brewers/menu",
    lat: "41.939351",
    lng: "-87.644205"
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
  	title: 'Express',
  	breweries: brewSchema
  });
});

router.get('/dist', function(req, res) {
  var str= req.query.addresses.join('|'); //joins the array of addresses sent in `get` request
  //can move key out of URL and into env var
  //would need to turn `mode=driving` into a variable to allow for biking/walking
  request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode=driving&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
  });
});

module.exports = router;