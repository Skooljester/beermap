$(function() {
  //May want to move all map stuff into `tourPlan`, but that may mess with calling map
  var map;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var stepDisplay;
  var currLoc;
  var markers= [];
  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(41.850033, -87.6500523)
    };
    map= new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    $('.brewery').each(function() { //Drop marker for each brewery
      var ll= new google.maps.LatLng($(this).find('header h1').data('lat'), $(this).find('header h1').data('lng'));
      var brewMarker= new google.maps.Marker({
        position: ll,
        map: map,
        title: $(this).find('header h1').text()
      });
      markers.push(brewMarker);
      google.maps.event.addListener(brewMarker, 'click', addBrew);
    });
    directionsDisplay.setMap(map);
    stepDisplay = new google.maps.InfoWindow();
    $('#map-canvas').append('<header id="directionsHeader"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span><a href="#" id="directionToggle">Hide Directions</a></header><div id="directions"></div>');
  }
  initialize(); //initialize google maps
  function addBrew() {
    var mtit= this.title;
    var btnTmpl= '<button type="button" class="btn btn-primary markerAdd">Add</button>';
    $('.tourList li').each(function() {
      if($(this).text().replace(/X/, "")== mtit) //will need to change `replace` regex if button text changes
        btnTmpl= '<button type="button" class="btn btn-success markerAdd" disabled= true>Added</button>';
    });
    stepDisplay.setContent('<p>'+mtit+ '</p>'+ btnTmpl);
    stepDisplay.open(map, this);
  }
  // --- Current location stuff
  navigator.geolocation.getCurrentPosition(showPosition); //Not really doing anything with user loc atm
  function showPosition(position) { //Center map on current position
    currLoc= new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: map,
      title: "You are here"
    });
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on,
      // containing the text of the step.
      stepDisplay.setContent("You are here");
      stepDisplay.open(map, marker);
    });
  }
  // --- end current location

  // ---------- IO STUFF ----------
  var socket= io.connect(window.location.hostname);
  socket.on('message', function (data) {
    console.log(data);
    //socket.emit('my other event', { my: 'data' });
  });
  // ---------- END IO ----------
  
  var tourPlan= {
    swapArr: null,
    init: function() {
      var self= this;
      $.get('/swap', function(data) {
        self.swapArr= data;
      });
      self.binding();
      self.listeners();
    },
    binding: function() {
      var self= this;
      // FIRST STAGE
      $('#transportSelect button').on('click', function() { //Select transport mode from button group
        $(this).siblings().removeClass('btn-success active').addClass('btn-default').prop('disabled', false);
        $(this).removeClass('btn-default').addClass('btn-success active').prop('disabled', true);
      });
      $('.brewery .addBrew').on('click', function() { //Add item to list
        var ch= true; // var for check
        var dind= $(this).siblings('h1').data('ind'); //index number of clicked h1
        $('.tourList li').each(function() { //Check if item is already in list
          if($(this).data('ind')== dind)
            return ch= false;
        });
        if(ch) {
          $('.tourList').append(self.listTmpl($(this).siblings('h1')));
          self.btnStateChange(true, $(this));
          $.event.trigger({type: "tourAdd"});
        }
        return false;
      });
      $('.tourList').on('click', 'li .removeBrew', function() { //Remove item from list
        var dind= $(this).parent().data('ind');
        $('.breweryList .brewery h1').each(function() {
          if($(this).data('ind')== dind)
            self.btnStateChange(false, $(this).siblings('button'));
        });
        $(this).parent().remove();
        $.event.trigger({type: "tourRemove"});
        return false;
      });
      $('.mapTour').on('click', function() { //Maps out brewery route
        var llp= [];
        $('.tourList li').each(function() {
          llp.push($(this).data('addr'));
        });
        if($('.tourList li').length== 2)
          self.singleRoute(llp[0], llp[1]);
        else {
          self.multiRoute(llp);
          $(this).button('loading');
        }
        for(var i= 0; i< markers.length; i++) {//hides all brewery markers on the map
          markers[i].setMap(null);
        }
      });
      $('#brewSearch').on('keyup', function() { //Search function, not very robust
        var sval= $(this).val().toLowerCase();
        if($(this).val().length>= 3) {
          $('.brewery').each(function() {
            if(!$(this).find('header h1').text().toLowerCase().match(sval))
              $(this).parent().fadeOut(300);
          });
        }
        else
          $('.brewery').parent().fadeIn(300);
      });
      $('body').on('click', '.markerAdd', function() { //Add brewery to list from within map marker
        var hold= $(this);
        $('.brewery').each(function() {
          if($(this).find('header h1').text()== hold.prev('p').text()) {
            $(this).find('header button').trigger('click');
            hold.text('Added').removeClass('btn-primary').addClass('btn-success').prop('disabled', true);
          }
        });
      });
      $('#directions_panel').on('click', '#tourShare', function() { //Will save brewery route once DB linked in, will require sign-in
        var t= $(this);
        var so2= {};
        var sw= self.swapArr;
        $('#plannedRoute li').each(function() {
          for(var i= 0; i< sw.length; i++) {
            if($(this).text()== sw[i].name)
              so2[$(this).text()]= sw[i].address;
          }
        });
        $.post('/share', so2, function(data) {
          t.parent().parent().append('<a href="'+data+'>Share link</a>');
        });
      });
      $('#directions_panel').on('click', '#tourLaunch', function() { //Starts going through tour
        var tourOrder= [];
        $('#plannedRoute li').each(function() {
          tourOrder.push($(this).text());
        });
        $.get('/launch', {order: tourOrder}, function(data) {
          $(data).insertAfter('#map-canvas');
          $('.breweryList').fadeOut(200);
          $(window).scrollTop($('#tourWalk').position().top);
          $('.tourListTitle, .tourList').hide();
          map.setOptions({
            zoom: 16,
            center: new google.maps.LatLng($('.tab-pane.active').data('lat'), $('.tab-pane.active').data('lng'))
          });
          $('#directions_panel').hide();
        });
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
      // END FIRST STAGE BINDING
      // SECOND STAGE
      $('body').on('click', '#tourWalk .tab-pane.active .nextStep', function(e) { //Moves through steps of tour
        //Do uber call if `uber` selected
        var curr= $('#transportSelect .active');
        var ac= $('#tourWalk .tab-pane.active');
        var s= [ac.data('lat'), ac.data('lng')];
        var e= [ac.next().data('lat'), ac.next().data('lng')];
        if(curr.data('mode')== "driving"&& !curr.data('uber')) {
          console.log("in if"); //Might need multiple other maps to show directions in panes
          $(window).scrollTop($('#map-canvas').position().top);
          $('#directionsHeader').show();
          $('#directions').slideDown(300);
          map.setCenter(new google.maps.LatLng(e[0], e[1]));
          $('#tourNav .active').next().find('a').tab('show');
        }
        //Show directions if `driving` selected
        else if(curr.data('mode')== "driving"&& curr.data('uber')) {
          console.log("in else if");
          $.get('/uber', {startCo: s, endCo: e}, function(data) {
            $(ac).prepend(data);
          });// Allow Uber app to be launched from here?
          $('.tab-pane.active').children().not('.nextStep').hide();
        }//Have another `else if` that launches if Divvy is selected
        else {
          console.log("in else");
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
    },
    listeners: function() { //Listeners for custom emitted events
      var self= this;
      $(document).on('tourAdd', function(e) {
        if($('.tourList li').length== 10)
          return alert("can't add more than 10 locations");
        else if($('.tourList li').length> 1)
          $('.mapTour').prop('disabled', false);
      }); 
      $(document).on('tourRemove', function() {
        if($('.tourList li').length<= 1)
          $('.mapTour').prop('disabled', true);
      });
    },
    listTmpl: function(obj) { //Template out list item
      return '<li data-ind="'+obj.data('ind')+'" data-lat="'+obj.data('lat')+'" data-lng="'+obj.data('lng')+'" data-addr="'+obj.data('addr')+'" class="list-group-item">'+obj.text()+'<button type="button" class="btn btn-danger removeBrew">X</button></li>';
    },
    btnStateChange: function(bool, obj) { //Change state of button next to brewery name
      if(bool)//If `true` disable and change text
        obj.text('Added').removeClass('btn-primary').addClass('btn-success').prop('disabled', true);
      else //If `false` enable
        obj.text('Add Brewery').removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
    },
    nameAddrSwap: function(addr) {
      var self= this;
      var sw= self.swapArr;
      for(var i= 0; i< sw.length; i++) { //See if filter can be used here
        if(addr.replace(/\, USA/, "")== sw[i].address)
          return sw[i].name;
      }
    },
    singleRoute: function(start, dest) { //Two-place routing
      var request = {
        origin: start,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    },
    multiRoute: function(arr) { //Multi-place routing
      var self= this;
      var waypts = [];
      var transportMode= google.maps.TravelMode.DRIVING;
      if($('#transportSelect button.active').data('mode')== "bicycling")
        transportMode= google.maps.TravelMode.BICYCLING;
      $.get('/dist', {addresses: arr, mode: $('#transportSelect button.active').data('mode')}, function(data) { //send addresses to backend
        var dist= 0;
        var jc; //address for origin location
        var ic; //address for dest location
        for(var i= 0; i< data.rows.length; i++) {
          for(var j= 0; j< data.rows[i].elements.length; j++) {
            if (data.rows[i].elements[j].distance.value> dist) {
              dist= data.rows[i].elements[j].distance.value;
              jc= data.origin_addresses[j]; //assign address for origin location
              ic= data.destination_addresses[i]; //assign address for dest location
            }
          }
        }
        multiMap(jc.replace(/\, USA/, ""), ic.replace(/\, USA/, "")); //removes `, USA` in order to match with array
      });
      function multiMap (start, end) {
        for (var i = 0; i < arr.length; i++) {
          if(arr[i]!= start&& arr[i]!= end) { //make sure that the address in array is neither the start or the end
            waypts.push({
              location: arr[i],
              stopover: true
            });
          }
        }
        var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: transportMode //Can turn into variable to allow for biking to be an option
        };
        directionsService.route(request, function(response, status) { //When mapping need to put market next to name of brewery
          if (status == google.maps.DirectionsStatus.OK) {
            $('.mapTour').button('reset');
            $('.brewery .btn-success').each(function() { //loop through buttons and change their state
              self.btnStateChange(false, $(this));
            });
            $('.tourList').empty();   
            directionsDisplay.setDirections(response);
            //END TOP SORT LIST
            var route= response.routes[0];
            // For each route, display summary information.
            directionsDisplay.setPanel(document.getElementById('directions'));
            if($('#plannedRoute li'))
              $('#plannedRoute').empty();
            for(var j= 0; j< route.legs.length; j++) {
              $('#plannedRoute').append('<li>'+self.nameAddrSwap(route.legs[j].start_address)+'</li>');
              if((j+1)== route.legs.length)
                $('#plannedRoute').append('<li>'+self.nameAddrSwap(route.legs[j].end_address)+'</li>');
            }
            $('#directions_panel').append('<div role="group" class="btn-group" id="saveStart"><button type="button" class="btn btn-default" id="tourShare">Share Route</button><button type="button" class="btn btn-success" id="tourLaunch">Start Crawl</button></div>');
          }
        });
      }
    }
  };
  tourPlan.init();
});