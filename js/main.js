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
      console.log(this);
      markers[0].setMap(map);
      bounds.extend(markers[0].position);

      google.maps.event.addListener(map,'zoom_changed',function() {
        zoomChangeBoundsListener =
              google.maps.event.addListener(map, 'bounds_changed', function(event) {
                  if (this.getZoom() > 18 && this.initialZoom === true) {
                      // Change max/min zoom here
                      this.setZoom(18);
                      this.initialZoom = false;
                  }
              google.maps.event.removeListener(zoomChangeBoundsListener);
          });
      });
      map.initialZoom = true;
      map.fitBounds(bounds);
    };

    removeMark = function() {
      for (var i = 0; i < markers.length; i++) {
        if (i===marker.id){
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
