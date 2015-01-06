$(function() {
  // ---------- MAP SHIT ----------
  var map;
  var directionsDisplay= new google.maps.DirectionsRenderer();
  var directionsService= new google.maps.DirectionsService();
  var stepDisplay;
  function initialize() {
    var mapOptions= {
      zoom: 16,
      center: new google.maps.LatLng($('.tab-pane.active').data('lat'), $('.tab-pane.active').data('lng'))
    };
    map= new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions({preserveViewport: true});//Keeps it from zooming out to 12 when directions rendered
    stepDisplay= new google.maps.InfoWindow();
    $('#map-canvas').append('<header id="directionsHeader"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span><a href="#" id="directionToggle">Hide Directions</a></header><div id="directions"></div>');
  }
  initialize(); //initialize google maps
  // ---------- END MAP ----------
  var tester= {
    socket: io.connect(location.origin.replace(/^http/, 'ws'), {secure: true}),//so that it works with heroku
    init: function() {
      var self= this;
      self.sockets();
      self.binding();
    },
    binding: function() {
      $('body').on('click', '#tourWalk .tab-pane.active .nextStep', function(e) { //Moves through steps of tour
        //Do uber call if `uber` selected
        var curr= $('#transportSelect .active');
        var ac= $('#tourWalk .tab-pane.active');
        var s= [ac.data('lat'), ac.data('lng')];
        var e= [ac.next().data('lat'), ac.next().data('lng')];
        if(curr.data('mode')== "driving"&& !curr.data('uber')) {
          $(window).scrollTop($('#map-canvas').position().top);
          $('#directionsHeader').show();
          $('#directions').slideDown(300);
          map.setCenter(new google.maps.LatLng(e[0], e[1]));
          $('#tourNav .active').next().find('a').tab('show');
        }
        //Show directions if `driving` selected
        else if(curr.data('mode')== "driving"&& curr.data('uber')) {
          $.get('/uber', {startCo: s, endCo: e}, function(data) {
            $(ac).prepend(data);
          });// Allow Uber app to be launched from here?
          $('.tab-pane.active').children().not('.nextStep').hide();
        }//Have another `else if` that launches if Divvy is selected
        else {
          e.preventDefault();
          $('#tourNav .active').next().find('a').tab('show');
        }
      });
      $('body').on('click', '.uberCall', function() {//May not need form if just lat+lng can be used
        var urlpart= '&product_id='+$(this).parent().data('pid')+'&pickup_latitude='+$('#tourWalk .tab-pane.active').data('lat')+'&pickup_longitude='+$('#tourWalk .tab-pane.active').data('lng')+
        '&dropoff_latitude='+$('#tourWalk .tab-pane.active').next().data('lat')+'&dropoff_longitude='+$('#tourWalk .tab-pane.active').next().data('lng'); //add more to this if needed
        window.open('https://m.uber.com/sign-up?client_id=q7EfkpqdZ0oenw8hpI2U9kuEzoZ5lA-t'+urlpart, '_blank');
        $('#tourNav .active').next().find('a').tab('show');
      });
      $('body').on('click', '#directionToggle', function() { //Slides directions panel up and down
        if($('#directions').is(':visible')) {
          $('#directions').slideUp(300);
          $(this).text('Show Directions');
          $(this).siblings('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
        else {
          $('#directions').slideDown(300);
          $(this).text('Hide Directions');
          $(this).siblings('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
        return false;
      });
    },
    loadMap: function() {
      var self= this;
    },
    sockets: function() {
      var self= this;
      var socket= self.socket;
      socket.on('distmat', function (data) {
        self.multiRoute(data);
      });
      socket.on('paneRender', function (data) {
        $('.tab-content').append(data.pane);//If data gets sent weird may need to match index to name
      });
    },
    multiRoute: function(data) { //Multi-place routing
      var self= this;
      var transportMode= google.maps.TravelMode.DRIVING;
      if($('#transportSelect button.active').data('mode')== "bicycling")
        transportMode= google.maps.TravelMode.BICYCLING;
      var gmr= data.gmres;
      var dist= 0;
      var jc; //address for origin location
      var ic; //address for dest location
      for(var i= 0; i< gmr.rows.length; i++) {
        for(var j= 0; j< gmr.rows[i].elements.length; j++) {
          if (gmr.rows[i].elements[j].distance.value> dist) {
            dist= gmr.rows[i].elements[j].distance.value;
            jc= gmr.origin_addresses[j]; //assign address for origin location
            ic= gmr.destination_addresses[i]; //assign address for dest location
          }
        }
      }
      multiMap(jc.replace(/\, USA/, ""), ic.replace(/\, USA/, ""), data.rarr); //removes `, USA` in order to match with array
      function multiMap (start, end, arr) {
        var waypts= arr.filter(function(obj) { //Different way to do it, not sure if better performance or not
          return obj.location!= start&& obj.location!= end;
        });
        var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: transportMode //Can turn into variable to allow for biking to be an option
        };
        directionsService.route(request, function(response, status) { //When mapping need to put market next to name of brewery
          if (status== google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route= response.routes[0];
            // For each route, display summary information.
            directionsDisplay.setPanel(document.getElementById('directions'));
          }
        });
      }
    }
  };
  tester.init();
});