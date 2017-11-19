var map; // map variable
var query;

function initMap() { // initialize map function

  map = new google.maps.Map(document.getElementById('map'), { // will create new map instance, center map on Spotswood, NJ with zoom level 15
    zoom: 15,
    center: {
      lat: 40.3918,
      lng: -74.3985
    }
  });

  ko.applyBindings(MyViewModel); // apply knockout bindings taken from MyViewModel
}

var MyViewModel = function() { // contains knockout bindings

  var geocoder = new google.maps.Geocoder(); // used for geocoding google map API

  var largeInfowindow = new google.maps.InfoWindow(); // new infowindow instance

  var markers = []; // array of location markers
  query = ko.observable('');

  locations = ko.observableArray([ // a knockout observableArray containing locations used for HTML bindings
    {
      title: 'Spotswood High School',
      location: {
        lat: 40.3986,
        lng: -74.3888
      }
    },
    {
      title: "Dunkin' Donuts",
      location: {
        lat: 40.3943,
        lng: -74.3870
      }
    },
    {
      title: 'ShopRite',
      location: {
        lat: 40.407455,
        lng: -74.385594
      }
    },
    {
      title: 'Taverna Pizza',
      location: {
        lat: 40.4066,
        lng: -74.3861
      }
    },
    {
      title: "Ryan's Pub",
      location: {
        lat: 40.3806,
        lng: -74.3883
      }
    },
    {
      title: 'RiteAid',
      location: {
        lat: 40.3962,
        lng: -74.3859
      }
    },
    {
      title: "MJ's Pizza Bar & Grill",
      location: {
        lat: 40.3968,
        lng: -74.3862
      }
    },
  ]);

  for (let i = 0; i < locations().length; i++) { // loop will create Google Marker variables and push them into the markers array
    var position = locations()[i].location;
    var title = locations()[i].title;
    marker =
      new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
    markers.push(marker);
    markers[i].setMap(map);
  }

  setMark = function() { // function used to display a marker onto the map
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (let i = 0; i < markers.length; i++) {
      if (this.title == markers[i].title) { // if knockout click: event's title is equal to the title of the index marker's title in the array
        markers[i].setMap(map); // display marker
        markers[i].addListener('click', function() { // clicking marker will
          populateInfoWindow(geocoder, this, largeInfowindow); // open infowindow
        });
      }
      bounds.extend(markers[i].position); // extend map to encapsulate markers
    }

    map.initialZoom = true; // set zoom level to intial value
    map.fitBounds(bounds);
  };

  removeMark = function() { // function used ot remove a marker from the map
    for (let i = 0; i < markers.length; i++) {
      if (this.title == markers[i].title) {
        markers[i].setMap(null); // removes marker from map
      }
    }
  };

  togglePanel = function() { // function used to toggle panel display on side
    $("#panel").toggleClass("collapsed col-md-4");
    $("#map").toggleClass("col-md-12 col-md-8");

  };

  filterLocations = function() { // function used to take search query and apply it to a filter for the marker locations
    // var address = this.value;
    // Declare variables
    var filter, div, ul, a, show, remove;
    filter = query().toUpperCase(); // search query converted to all caps to ensure stability
    div = document.getElementById("locations"); // grab #locations div
    ul = div.getElementsByTagName('ul'); // grab all ul inside #locations
    show = document.getElementsByClassName("show"); // grab #show button
    remove = document.getElementsByClassName("remove"); // grab #remove button

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < ul.length; i++) {
      a = ul[i].textContent;
      if (a.toUpperCase().indexOf(filter) > -1) { // keep location in list display
        ul[i].style.display = "";
        show[i].style.display = ""; // along with
        remove[i].style.display = ""; // buttons
        markers[i].setMap(map); // show marker
      } else { // remove location in list display
        ul[i].style.display = "none";
        show[i].style.display = "none";
        remove[i].style.display = "none";
        markers[i].setMap(null); // remove marker
      }
    }
  };
};

function populateInfoWindow(geocoder, marker, infowindow) { // function used to create infowindow
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.address = geocodeLatLng(marker.position, geocoder, map, infowindow);
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function geocodeLatLng(marker, geocoder, map, infowindow) { // function used to convert latlng to string address
  var latlng = marker;
  geocoder.geocode({
    'location': latlng
  }, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        infowindow.setContent(results[0].formatted_address);
      }
    }
  });
}

/**
 * Error callback for GMap API request
 */
var googleError = function()  {
  initMap(); // retry displaying map
};
