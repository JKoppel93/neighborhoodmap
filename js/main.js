var map;

function initMap() {
  var geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {
      lat: 40.3918,
      lng: -74.3985
    }
  });

  var largeInfowindow = new google.maps.InfoWindow();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
  ko.applyBindings(myViewModel);
}

var myViewModel = function() {

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
};

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({
    'address': address
  }, function(results, status) {
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
