var express= require('express');
var request= require('request');
var db= require('../db/dbmain');
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
    locbeers: [
      {
        bid: 848073,
        name: 'Nanosaurus Slumber Party',
        style: 'Saison / Farmhouse Ale',
        score: 3.44
      },
      {
        bid: 881545,
        name: 'Polish Falcon Baltic Porter',
        style: 'Baltic Porter',
        score: 3.774
      },
      {
        bid: 674844,
        name: 'Farmhouse Wheat Ale',
        style: 'Saison / Farmhouse Ale',
        score: 3.421
      },
      {
        bid: 890494,
        name: 'Monkey Shriek Hibiscus Sour Ale',
        style: 'Sour Ale',
        score: 3.466
      },
      {
        bid: 240724,
        name: 'Reaper\'s Breath',
        style: 'Belgian Strong Dark Ale',
        score: 3.473
      },
      {
        bid: 909848,
        name: 'Rookery Platinum Rye IPA',
        style: 'Rye Beer',
        score: 3.667
      },
      {
        bid: 877787,
        name: 'Passion For Glory Double IPA',
        style: 'American IPA',
        score: 3.728
      },
      {
        bid: 202373,
        name: 'Golden Ale',
        style: 'Golden Ale',
        score: 3.282
      },
      {
        bid: 684225,
        name: 'Rookery Rye IPA',
        style: 'American IPA',
        score: 3.596
      },
      {
        bid: 674875,
        name: 'Freight Handler',
        style: 'Milk / Sweet Stout',
        score: 3.655
      },
      {
        bid: 454662,
        name: 'Barrel-Aged Project Brew No. 8 - Sauternes',
        style: 'Belgian Strong Pale Ale',
        score: 3.739
      },
      {
        bid: 203556,
        name: 'Diversey Pale Ale',
        style: 'American Pale Ale',
        score: 3.446
      },
      {
        bid: 770177,
        name: 'T-Rex Hugs',
        style: 'Belgian Strong Dark Ale',
        score: 3.558
      },
      {
        bid: 878856,
        name: 'T-Rex Hugs Sauternes Barrel Aged',
        style: 'Belgian Strong Dark Ale',
        score: 3.348
      },
      {
        bid: 769023,
        name: 'Freight Handler (Cardamom Infused)',
        style: 'Milk / Sweet Stout',
        score: 3.808
      }
    ]
  },
  {
    name: "DryHop Brewers",
    utvid: "225374",
    address: "3155 North Broadway Street, Chicago, IL 60657", //correct address is 3155, but results are fucked sometimes if 3155 used
    phone: "(773) 857-3155",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1757835-dryhop-brewers/menu",
    lat: "41.939351",
    lng: "-87.644205",
    locbeers: [
      {
        bid: 521852,
        name: 'Milkstachio',
        style: 'Milk / Sweet Stout',
        score: 4.098
      },
      {
        bid: 532709,
        name: 'Heat Miser Meets Yuppie',
        style: 'American IPA',
        score: 3.685
      },
      {
        bid: 919109,
        name: 'Photobomb',
        style: 'Imperial / Double Red Ale',
        score: 0
      },
      {
        bid: 515829,
        name: 'Moustache and a Supernova',
        style: 'Bière de Garde',
        score: 3.664
      },
      {
        bid: 883109,
        name: 'Le Petit Démon',
        style: 'Other',
        score: 3.122
      },
      {
        bid: 889244,
        name: 'Money, Guns, & Coffee',
        style: 'Saison / Farmhouse Ale',
        score: 3.553
      },
      {
        bid: 381227,
        name: 'Shark Meets Hipster',
        style: 'American Pale Wheat Ale',
        score: 3.635
      },
      {
        bid: 24904,
        name: 'Bloom',
        style: 'Cider',
        score: 3.691
      },
      {
        bid: 503019,
        name: 'Heyoka',
        style: 'American IPA',
        score: 3.984
      },
      {
        bid: 428413,
        name: 'Deth\'s Tar',
        style: 'Russian Imperial Stout',
        score: 4.221
      },
      {
        bid: 521574,
        name: 'Christmas Ale',
        style: 'Herbed/Spiced Beer',
        score: 3.646
      }
    ]
  },
  {
    name: "Goose Island",
    utvid: "881",
    address: "1800 North Clybourn Avenue, Chicago, IL 60614",
    phone: "(312) 915-0071",
    menu: "http://www.gayot.com/restaurants/menu/goose-island-brewery-chicago-il-60614_5ch99343.html",
    lat: "41.913696",
    lng: "-87.653783",
    locbeers: [
      {
        bid: 539827,
        name: 'Candy Cane Cthulhu',
        style: 'Imperial Oatmeal Stout',
        score: 4.461
      },
      {
        bid: 914077,
        name: 'Coldthulu',
        style: 'Imperial Oatmeal Stout',
        score: 4.483
      },
      {
        bid: 906455,
        name: 'Barrel Aged Extremely Naughty Goose',
        style: 'American Brown Ale',
        score: 4.486
      },
      {
        bid: 913647,
        name: 'Cold Toddy',
        style: 'Imperial / Double Brown Ale',
        score: 3.833
      },
      {
        bid: 515970,
        name: 'Santa\'s Session',
        style: 'Winter Ale',
        score: 3.469
      },
      {
        bid: 913664,
        name: 'Honey And Rosemary Cran-Bruin',
        style: 'Flanders Oud Bruin',
        score: 3.556
      },
      {
        bid: 889788,
        name: 'Damen Silos',
        style: 'Oatmeal Stout',
        score: 3.582
      },
      {
        bid: 875071,
        name: 'Shred the Gnar',
        style: 'Imperial / Double IPA',
        score: 3.814
      },
      {
        bid: 914399,
        name: 'Pecan Pie Barrel Aged Barley Wine',
        style: 'American Barleywine',
        score: 4.047
      },
      {
        bid: 914728,
        name: 'British Invader',
        style: 'English IPA',
        score: 3.417
      },
      {
        bid: 384214,
        name: 'All Purpose IPA',
        style: 'American IPA',
        score: 3.608
      },
      {
        bid: 474233,
        name: 'Autobahn',
        style: 'German Pilsner',
        score: 3.334
      },
      {
        bid: 815325,
        name: 'The Grouch',
        style: 'Imperial / Double Pilsner',
        score: 3.451
      },
      {
        bid: 900563,
        name: 'Barrel-Aged Barleywine',
        style: 'American Barleywine',
        score: 4.269
      },
      {
        bid: 43152,
        name: 'King Henry',
        style: 'English Barleywine',
        score: 4.718
      }
    ]
  },
  {
    name: "Begyle Brewing Company",
    utvid: "386651",
    address: "1800 West Cuyler Avenue, Chicago, IL 60613", //ZIP code is weird, one says 60625 one says 60613s
    phone: "(773) 661-6963",
    menu: null,
    lat: "41.955284",
    lng: "-87.674506",
    locbeers: [
      {
        bid: 912943,
        name: 'Dr. Dreidel\'s Imperial Hanukkah Porter',
        style: 'Porter',
        score: 3.99
      },
      {
        bid: 633829,
        name: 'Tough Guy',
        style: 'American Brown Ale',
        score: 3.619
      },
      {
        bid: 588404,
        name: 'Free Bird',
        style: 'American Pale Ale',
        score: 3.614
      },
      {
        bid: 217591,
        name: 'Crash Landed',
        style: 'American Pale Wheat Ale',
        score: 3.59
      },
      {
        bid: 383885,
        name: 'Don\'t Bring Me Down, Zeus!',
        style: 'Imperial / Double IPA',
        score: 3.827
      },
      {
        bid: 217197,
        name: 'Begyle Blonde Ale',
        style: 'American Blonde Ale',
        score: 3.522
      },
      {
        bid: 913980,
        name: 'Dr. Dreidel\'s Imperial Hanukkah Porter',
        style: 'Imperial / Double Porter',
        score: 0
      },
      {
        bid: 278991,
        name: 'Hophazardly IPA',
        style: 'American IPA',
        score: 3.875
      },
      {
        bid: 260909,
        name: 'Flannel Pajamas',
        style: 'Oatmeal Stout',
        score: 3.561
      },
      {
        bid: 359084,
        name: 'Oh Hey!',
        style: 'English Porter',
        score: 3.713
      },
      {
        bid: 521574,
        name: 'Christmas Ale',
        style: 'Herbed/Spiced Beer',
        score: 3.646
      }
    ]
  },
  {
    name: "Piece Brewery & Pizzeria",
    utvid: "3852",
    address: "1927 West North Avenue, Chicago, IL 60622",
    phone: "(773) 772-4422",
    menu: "http://www.viewmenu.com/piece/menu",
    lat: "41.910327",
    lng: "-87.676104",
    locbeers: [
      {
        bid: 11708,
        name: 'Dark-N-Curvy',
        style: 'Dunkelweizen',
        score: 3.7
      },
      {
        bid: 15406,
        name: 'Golden Arm',
        style: 'Kölsch',
        score: 3.34
      },
      {
        bid: 901866,
        name: 'Ramber',
        style: 'American Amber / Red Ale',
        score: 3.48
      },
      {
        bid: 43158,
        name: 'Full Frontal Pale Ale',
        style: 'American Pale Ale',
        score: 3.658
      },
      {
        bid: 11207,
        name: 'Festivus',
        style: 'Belgian Brown Ale ',
        score: 3.632
      },
      {
        bid: 1573,
        name: 'Hitachino Nest White Ale',
        style: 'Witbier',
        score: 3.647
      },
      {
        bid: 10227,
        name: 'Camel Toe',
        style: 'Imperial / Double IPA',
        score: 3.957
      },
      {
        bid: 100924,
        name: 'Roland the Headless Assistant Brewer',
        style: 'Oatmeal Stout',
        score: 3.667
      },
      {
        bid: 4044,
        name: 'Maudite',
        style: 'Belgian Strong Dark Ale',
        score: 3.804
      },
      {
        bid: 910924,
        name: 'Rambler',
        style: 'American Amber / Red Ale',
        score: 0 },
      {
        bid: 229146,
        name: 'Bare Naked Organic Cider',
        style: 'Cider',
        score: 3.513
      },
      {
        bid: 183532,
        name: 'The Weight',
        style: 'American Pale Ale',
        score: 3.939
      },
      {
        bid: 4740,
        name: 'Brown Shugga\'',
        style: 'American Strong Ale',
        score: 3.888
      },
      {
        bid: 5411,
        name: 'Alpha Klaus',
        style: 'American Porter',
        score: 3.926
      }
    ]
  },
  {
    name: "Lagunitas Brewing Company Chicago",
    utvid: "1773303",
    address: "1843 South Washtenaw Avenue, Chicago, IL 60608",
    phone: "(707) 769-4495",
    menu: null,
    lat: "41.857202",
    lng: "-87.691988",
    locbeers: [
      {
        bid: 915092,
        name: 'Wet Hop Fusion 26 Ale',
        style: 'American Pale Ale',
        score: 4.041
      },
      {
        bid: 4740,
        name: 'Brown Shugga\'',
        style: 'American Strong Ale',
        score: 3.888
      },
      {
        bid: 584134,
        name: 'Hairy Eyeball (2014)',
        style: 'American Strong Ale',
        score: 3.775
      },
      {
        bid: 901719,
        name: 'Fusion 26',
        style: 'American Pale Ale',
        score: 4.043
      },
      {
        bid: 1351,
        name: 'Hairy Eyeball Ale',
        style: 'American Strong Ale',
        score: 3.683
      },
      {
        bid: 1071,
        name: 'Censored Rich Copper Ale (aka The Kronik)',
        style: 'American Amber / Red Ale',
        score: 3.596
      },
      {
        bid: 24331,
        name: 'Imperial Red Ale',
        style: 'Imperial / Double Red Ale',
        score: 3.872
      },
      {
        bid: 6725,
        name: 'Pils',
        style: 'Czech Pilsener',
        score: 3.432
      },
      {
        bid: 285026,
        name: 'Lagunitas Sucks',
        style: 'Imperial / Double IPA',
        score: 4.122
      },
      {
        bid: 1070,
        name: 'Imperial Stout',
        style: 'Russian Imperial Stout',
        score: 3.902
      },
      {
        bid: 6407,
        name: 'New Dogtown Pale Ale',
        style: 'American Pale Ale',
        score: 3.658
      },
      {
        bid: 198572,
        name: 'DayTime Fractional IPA',
        style: 'American IPA',
        score: 3.714
      },
      {
        bid: 5180,
        name: 'Hop Stoopid',
        style: 'Imperial / Double IPA',
        score: 3.982
      },
      {
        bid: 5771,
        name: 'Maximus',
        style: 'Imperial / Double IPA',
        score: 3.95
      },
      {
        bid: 6388,
        name: 'A Little Sumpin\' Wild Ale',
        style: 'Belgian IPA',
        score: 3.862
      }
    ]
  }
];
var brewSchema2= [
  {
    name: "Revolution Brewing",
    utvid: "2426",
    address: "2323 North Milwaukee Avenue, Chicago, IL 60647",
    phone: "(773) 227-2739",
    menu: "http://revbrew.com/brewpub/pub-menu",
    lat: "41.923618",
    lng: "-87.69814"
  },
  {
    name: "Half Acre Beer Company",
    utvid: "8453",
    address: "4257 North Lincoln Avenue, Chicago, IL 60618",
    phone: "(773) 248-4038",
    menu: "http://www.viewmenu.com/half-acre-tap-room/menu",
    lat: "41.9593418",
    lng: "-87.6819468"
  },
  {
    name: "Haymarket Pub & Brewery",
    utvid: "6962",
    address: "737 West Randolph Street, Chicago, IL 60661",
    phone: "(312) 638-0700",
    menu: "https://locu.com/places/haymarket-pub-brewery-chicago-us/#menu",
    lat: "41.884177",
    lng: "-87.647249"
  },
  {
    name: "Atlas Brewing Company",
    utvid: "298942",
    address: "2747 North Lincoln Avenue, Chicago, IL 60614",
    phone: "(773) 295-1270",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1714435-atlas-brewing-company/menu",
    lat: "41.931876",
    lng: "-87.657292"
  },
  {
    name: "DryHop Brewers",
    utvid: "225374",
    address: "3155 North Broadway Street, Chicago, IL 60657", //correct address is 3155, but results are fucked sometimes if 3155 used
    phone: "(773) 857-3155",
    menu: "http://www.urbanspoon.com/cities/2-chicago/restaurants/1757835-dryhop-brewers/menu",
    lat: "41.939351",
    lng: "-87.644205"
  },
  {
    name: "Goose Island",
    utvid: "881",
    address: "1800 North Clybourn Avenue, Chicago, IL 60614",
    phone: "(312) 915-0071",
    menu: "http://www.gayot.com/restaurants/menu/goose-island-brewery-chicago-il-60614_5ch99343.html",
    lat: "41.913696",
    lng: "-87.653783"
  },
  {
    name: "Begyle Brewing Company",
    utvid: "386651",
    address: "1800 West Cuyler Avenue, Chicago, IL 60613", //ZIP code is weird, one says 60625 one says 60613s
    phone: "(773) 661-6963",
    menu: null,
    lat: "41.955284",
    lng: "-87.674506"
  },
  {
    name: "Piece Brewery & Pizzeria",
    utvid: "3852",
    address: "1927 West North Avenue, Chicago, IL 60622",
    phone: "(773) 772-4422",
    menu: "http://www.viewmenu.com/piece/menu",
    lat: "41.910327",
    lng: "-87.676104"
  },
  {
    name: "Lagunitas Brewing Company Chicago",
    utvid: "1773303",
    address: "1843 South Washtenaw Avenue, Chicago, IL 60608",
    phone: "(707) 769-4495",
    menu: null,
    lat: "41.857202",
    lng: "-87.691988"
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
for(var z= 0; z< brewSchema.length; z++) {
  var brewery = new db.Brewery(brewSchema[z]);
  db.dbsave(brewery, function() {
    console.log("saved");
  });
}
/* GET home page. */
router.get('/', function(req, res) {
  db.tester(function(breweries) {
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
  var harr= [];
  for(var i= 0; i< brewSchema.length; i++) {
    harr.push({name: brewSchema[i].name, address: brewSchema[i].address});
  }
  res.send(harr);
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