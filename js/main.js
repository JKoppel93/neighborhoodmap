var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: 40.3918,
      lng: -74.3985
    }
  });

  document.getElementById('submit').addEventListener('click', function() {
    filterLocations();
  });
  ko.applyBindings(myViewModel);
}

var myViewModel = function() {

  var geocoder = new google.maps.Geocoder();

  var largeInfowindow = new google.maps.InfoWindow();

  var markers = [];

    locations = ko.observableArray([
      {title: 'Spotswood High School', location: {lat: 40.3986, lng: -74.3888}},
      {title: "Dunkin' Donuts", location: {lat: 40.3943, lng: -74.3870}},
      {title: 'ShopRite', location: {lat: 40.407455, lng: -74.385594}},
      {title: 'Taverna Pizza', location: {lat: 40.4066, lng: -74.3861}},
      {title: "Ryan's Pub", location: {lat: 40.3806, lng: -74.3883}},
      {title: 'RiteAid', location: {lat: 40.3962, lng: -74.3859}},
    ]);

    for (let i=0; i<locations().length; i++) {
      var position = locations()[i].location;
      var title = locations()[i].title;
      marker =
        new google.maps.Marker({
         position: position,
         title: title,
         animation: google.maps.Animation.DROP,
         id: i
       }
     );
     markers.push(marker);
     markers[i].setMap(null);
    }

    setMark = function() {
      var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (let i=0; i<markers.length;i++) {
        if (this.title == markers[i].title) {
          markers[i].setMap(map);
          markers[i].addListener('click', function() {
            populateInfoWindow(geocoder,this, largeInfowindow);
          });
        }
        bounds.extend(markers[i].position);
      }

      map.initialZoom = true;
      map.fitBounds(bounds);
    };

    removeMark = function() {
      for (let i=0; i<markers.length;i++) {
        if (this.title == markers[i].title) {
          markers[i].setMap(null);
        }
      }
    };

    togglePanel = function() {
      $("#panel").toggleClass("collapsed col-md-4");
      $("#map").toggleClass("col-md-12 col-md-8");

    }

};

function populateInfoWindow(geocoder, marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.address = geocodeLatLng(marker.position,geocoder,map,infowindow);
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function geocodeLatLng(marker, geocoder, map, infowindow) {
  var latlng = marker;
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        infowindow.setContent(results[0].formatted_address);
      }
    }
  });
}

function filterLocations(){
  var address = document.getElementById('address').value;
  // Declare variables
    var filter, div, ul, a, show, remove;
    filter = address.toUpperCase();
    div = document.getElementById("locations");
    ul = div.getElementsByTagName('ul');
    show = document.getElementsByClassName("show");
    remove = document.getElementsByClassName("remove");

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < ul.length; i++) {
        a = ul[i].textContent;
        if (a.toUpperCase().indexOf(filter) > -1) {
            ul[i].style.display = "";
            show[i].style.display = "";
            remove[i].style.display = "";
        } else {
            ul[i].style.display = "none";
            show[i].style.display = "none";
            remove[i].style.display = "none";
        }
    }
}

function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
