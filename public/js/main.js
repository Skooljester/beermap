$(function() {
  //May want to move all map stuff into `tourPlan`, but that may mess with calling map
  var map;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var currLoc;
  var markers= [];
  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(41.850033, -87.6500523)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    $('.brewery').each(function() { //Drop marker for each brewery
      var ll= new google.maps.LatLng($(this).find('header h1').data('lat'), $(this).find('header h1').data('lng'));
      var brewMarker= new google.maps.Marker({
        position: ll,
        map: map,
        title: $(this).find('header h1').text()
      });
      markers.push(brewMarker);
      google.maps.event.addListener(brewMarker, 'click', addBrew);
    }); //Will need to remove when plotting route
    directionsDisplay.setMap(map);
  }
  initialize();
  function addBrew() {
    console.log("test");
    console.log(this);
    var mtit= this.title;
    $('.brewery').each(function() {
      if($(this).find('header h1').text()== mtit) {
        console.log("in if");
        $(this).find('header button').trigger('click');
      }
    });
  }
  navigator.geolocation.getCurrentPosition(showPosition); //Not really doing anything with user loc atm
  function showPosition(position) { //Center map on current position
    currLoc= new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map: map,
      title: "You are here"
    });
  }
  var tourPlan= {
    init: function() {
      var self= this;
      self.binding();
      self.listeners();
      self.tileSpace();
    },
    binding: function() {
      var self= this;
      $('.brewery .addBrew').on('click', function() { //Add item to list
        var ch= true; // var for check
        var dind= $(this).siblings('h1').data('ind'); //index number of clicked h1
        $('.tourList li').each(function() { //Check if item is already in list
          if($(this).data('ind')== dind)
            return ch= false;
        });
        if(ch) {
          $('.tourList').append(self.listTmpl($(this).siblings('h1')));//remove `$(this).parent()` if not used
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
        else
          self.multiRoute(llp);
        for(var i= 0; i< markers.length; i++) {//hides all brewery markers on the map
          markers[i].setMap(null);
        }
      });
      $('#brewSearch').on('keyup', function() {
        var sval= $(this).val();
        var holdarr= [];
        if($(this).val().length>= 3) {
          console.log("longer");
          $('.brewery').each(function() {
            console.log($(this).find('header h1').text().match(sval));
            if($(this).find('header h1').text().match(sval)) {
              holdarr.push($(this));
            }
          });
          $('.brewery').hide();
          for(var i= 0; i< holdarr.length; i++)
            holdarr[i].show();
        }
        else
          $('.brewery').show();
        self.tileSpace();
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
      return '<li data-ind="'+obj.data('ind')+'" data-lat="'+obj.data('lat')+'" data-lng="'+obj.data('lng')+'" data-addr="'+obj.data('addr')+'">'+obj.text()+'<button type="button" class="btn btn-danger removeBrew">X</button></li>';
    },
    btnStateChange: function(bool, obj) { //Change state of button next to brewery name
      if(bool) {
        obj.removeClass('btn-primary').addClass('btn-success').prop('disabled', true);
        obj.text('Added');
      }
      else {
        obj.removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
        obj.text('Add Brewery');
      }
    },
    tileSpace: function() { //Spaces the tiles properly initially and after sort
      var c= 2;
      $('.brewery').not(":hidden").attr('style', '');
      $('.brewery').not(":hidden").each(function(i) {
        if(i== c) {
          $(this).css('margin-right', 0);
          c+= 3;
        }
      });
      c= 2;
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
      $.get('/dist', {addresses: arr}, function(data) { //send addresses to backend
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
          travelMode: google.maps.TravelMode.DRIVING //Can turn into variable to allow for biking to be an option
        };
        directionsService.route(request, function(response, status) { //When mapping need to put market next to name of brewery
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            //SORT LIST AT TOP -- messy as fuck, doesn't work if you remove and re-add breweries
            function sortTourList() {
              var route= response.routes[0];
              var l= route.legs.length-1;
              $(".tourList li[data-addr='"+route.legs[0].start_address.replace(/\, USA/, "")+"']").append('<a href="#">Start</a>');
              $(".tourList li[data-addr='"+route.legs[l].end_address.replace(/\, USA/, "")+"']").append('<a href="#">Final</a>');
              var first= $(".tourList li[data-addr='"+route.legs[0].start_address.replace(/\, USA/, "")+"']").clone(true, true);
              var last= $(".tourList li[data-addr='"+route.legs[l].end_address.replace(/\, USA/, "")+"']").clone(true, true);
              var holdarr= [];
              for(var i= 1; i< route.legs.length; i++) {
                holdarr.push($(".tourList li[data-addr='"+route.legs[i].start_address.replace(/\, USA/, "")+"']").data('order', i).clone(true, true));
              }
              first.data('order', -1);
              last.data('order', -2);

              $('.tourList').empty();
              $('.tourList').prepend(first);
              for(var j= 0; j< holdarr.length; j++) {
                $('.tourList').append(holdarr[j].append('<a href="#">'+holdarr[j].data('order')+'</a>'));
              }
              $('.tourList').append(last);
            }
            //END TOP SORT LIST

            // var summaryPanel = document.getElementById("directions_panel");
            // summaryPanel.innerHTML = "";
            // // For each route, display summary information.
            // for (var i = 0; i < route.legs.length; i++) {
            //   var routeSegment = i+1;
            //   summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
            //   summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            //   summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
            //   summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            // }
          }
        });
      }
    }
  };
  tourPlan.init();
});