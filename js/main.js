var map; // map variable
var query; // search query for filtering locations
var filteredLocations = ko.observableArray(); // array of temporary locations
var markers = []; // array of location markers
var infoTemplate;
var largeInfowindow;


function initMap() { // initialize map function
  largeInfowindow = new google.maps.InfoWindow(); // new infowindow instance
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

  var visible = true; // for filteredLocations
  var active = false; // for animations

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

  // MARKERS //

  for (let i = 0, len = locations().length; i < len; i++) { // loop will create Google Marker variables and push them into the markers array
    var position = locations()[i].location;
    var title = locations()[i].title;
    var previousMarker;
    filteredLocations()[i] = locations()[i]; // locations array is stored in a temporary array filteredLocations for filter manipulation
    filteredLocations()[i].isVisible = ko.observable(visible); // filtered locations in panel are set to visible on init
    marker =
      new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
    google.maps.event.addListener(marker, 'click', function() { // add click listener for each marker present on the map
      populateInfoWindow(geocoder, markers[i], largeInfowindow); // which will then bring up the infowWindow
      markers[i].setAnimation(google.maps.Animation.BOUNCE); // animate active marker
      for (let i = 0; i < markers.length; i++) {
        if (markers[i].active === true) { // if a previous active marker is present
          markers[i].setAnimation(null); // set previous marker animation to null
          markers[i].active = false; // set its active value to false
        }
      }
      markers[i].active = true;
    });
    markers.push(marker);
    markers[i].setMap(map);
    markers[i].active = active;
  }

  setMark = function() { // function used to display a marker onto the map
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].active === true) { // if a previous active marker is present
        markers[i].setAnimation(null); // set previous marker animation to null
        markers[i].active = false; // set its active value to false
      }
      if (this.title == markers[i].title) { // if knockout click: event's title is equal to the title of the index marker's title in the array
        toggleMarker(markers[i]);
      }
      bounds.extend(markers[i].position); // extend map to encapsulate markers
      markers[i].active = true; // set marker active value to true
    }

    map.initialZoom = true; // set zoom level to intial value
    map.fitBounds(bounds);
  };

  toggleMarker = function(mark) { // used to toggle between visible and invisible markers when clicking on location text
    var isActive = mark.active; // initial marker visible boolean value
    if (isActive === true) {
      mark.setAnimation(null); // remove animation
      closeInfowWindow(geocoder, mark, largeInfowindow);
      mark.active = false;
    } else if (x === false) {
      mark.setAnimation(google.maps.Animation.BOUNCE); // reanimate
      populateInfoWindow(geocoder, mark, largeInfowindow); // open infowindow
      mark.active = false;
    }
  };

  // PANEL //

  togglePanel = function() { // function used to toggle panel display on side
    $("#panel").toggleClass("collapsed col-md-4");
    $("#map").toggleClass("col-md-12 col-md-8");

  };

  filterLocations = function() { // function used to take search query and apply it to a filter for the marker locations
    var filter, a;
    filter = query().toUpperCase(); // search query converted to all caps to ensure stability

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0, len = locations().length; i < len; i++) {
      a = filteredLocations()[i].title;
      if (a.toUpperCase().indexOf(filter) > -1) { // keep location in list display
        filteredLocations()[i].isVisible(true); // if filtered locations are visible in panel
        markers[i].setVisible(true); // show marker
        markers[i].setAnimation(google.maps.Animation.DROP); // reanimate
      } else { // remove location in list display
        filteredLocations()[i].isVisible(false); // if filtered locations are not visible in panel
        markers[i].setVisible(false); // remove marker
        markers[i].setAnimation(null); // remove animation
      }
    }
  };

  this.filterQuery = ko.computed(() => { // credits to Sang for this live filter method
    if (this.query().length <= 0) {
      for (var i = 0; i < locations().length; i++) {
        filteredLocations()[i].isVisible(true); // if filtered locations are visible in panel
        markers[i].setVisible(true); // show marker
        markers[i].setAnimation(google.maps.Animation.DROP); // reanimate
      }

    } else {
      return ko.utils.arrayFilter(this.filterLocations(), (location) => {
        return location.title.toUpperCase().indexOf(this.query().toUpperCase()) !== -1;
      });
    }
  });
};

// INFO WINDOW //

function populateInfoWindow(geocoder, marker, infowindow) { // function used to create infowindow
  // Check to make sure the infowindow is not already opened on this marker.
  if (largeInfowindow.marker != marker) {
    infoTemplate = '<h2 id="infoTitle">' + marker.title + '</h2>' +
      '<div><span id="infoAddress">loading..</span><br>' +
      '<img id="infoImage" src="img/loading.gif"/><br><a id="foursquareAnchor">Loading..</a></div>'; // credit to Viraj-3 for the template idea
    largeInfowindow.setContent(infoTemplate);
    infowindow.open(map, marker);
    geocodeLatLng(geocoder, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

function closeInfowWindow(geocoder, marker, infowindow) { // function used to close infowindow, used if location text is clicked
  infowindow.marker = null;
  infowindow.close();
}

function geocodeLatLng(geocoder, marker) { // function used to convert latlng to string address
  var latlng = marker.position;
  var contentString;
  getFourSquare(latlng.lat(), latlng.lng(), marker.title, marker); // gets foursquareID
  geocoder.geocode({
    'location': latlng
  }, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var streetviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=320x240&location=' + latlng.lat() + "," + latlng.lng() + '&key=AIzaSyCUP0AwDXlaMWhMJX54WLgF-FsWA1CJO-Q&v=3'; // variable to obtain streetview
        var formattedAddress = results[0].formatted_address;
        infoTemplate = '<h2 id="infoTitle">' + marker.title + '</h2>' +
          '<div><span id="infoAddress">' + formattedAddress +
          '<br><img id="infoImage" src='+ streetviewURL +
          '/><br><a id="foursquareAnchor">Loading..</a></div>';
        largeInfowindow.setContent(infoTemplate);
      }
    }
  });
}

// FOUR SQUARE //
function getFourSquare(lat, lng, title, marker) {

  var apiURL = 'https://api.foursquare.com/v2/venues/';
  var latlng = lat + ',' + lng;
  var CLIENT_ID = 'ZDJME44NMAR2EQ4DOVZ4Y3ALRJEUWCZC0RBKXQ2KBE0N4EGX';
  var CLIENT_SECRET = "UDCLN50BPLGYKMPYS2UZJGXGWOR0NYN5R00STZJPCUIBUFFA";
  var version = 20161016;
  var intent = 'checkin';

  var foursquareURL = apiURL + 'search?v=' + version + '&ll=' + latlng + '&intent=' + intent + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;


  return fetch(foursquareURL, {
    method: 'get'
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    for (var i = 0; i < json.response.venues.length; i++) {
      if (json.response.venues[i].name.toUpperCase() == title.toUpperCase()) { // if ajax response venue is equal to marker title
        marker.fsID = json.response.venues[i].id;
      } else {
        marker.fsID = json.response.venues[0].id;
      }
    }
    version = 201310168;
    intent = 'browse';
    foursquareURL = apiURL + marker.fsID + '?v=' + version + '&intent=' + intent + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

    fetch(foursquareURL, {
      method: 'get'
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      if (json.response.venue.shortUrl === "") { // if shortUrl is empty
        marker.fsText = "FourSquare location not found."; // give message that a location was not found
      } else { // apply an anchor link to the shortUrl
        marker.fsText = "<a href='" + json.response.venue.shortUrl +
          "'>" + json.response.venue.shortUrl + '</a>';
        infoTemplate = largeInfowindow.content.replace('<a id="foursquareAnchor">Loading..</a>', marker.fsText); // required to keep formattedAddress and streetviewURL content from previous function, replaces "loading..." text with marker.fsText link
      }
    }).catch(function(data) {
      if (data.status == 404) // if shortURL cannot be found
        alert('FourSquare location could not found. [404]');
      else if (data.status == 400)
        alert('A request error was made. Try clicking again to resolve. [400]');
      else if (data.status == 401 || data.status == 403)
        alert('You are not authorized to make this request. [' + data.status + ']');
      else if (data.status == 408)
        alert('The request timed out. The request took too long to connect. [408]');
      else
        alert('Unspecified error');
    });
  }).catch(function(data) {
    if (data.status == 404) // if shortURL cannot be found
      alert('FourSquare location could not found. [404]');
    else if (data.status == 400)
      alert('A request error was made. Try clicking again to resolve. [400]');
    else if (data.status == 401 || data.status == 403)
      alert('You are not authorized to make this request. [' + data.status + ']');
    else if (data.status == 408)
      alert('The request timed out. The request took too long to connect. [408]');
    else
      alert('Unspecified error');
  });
}

/**
 * Error callback for GMap API request
 */
var googleError = function() {
  alert("Error loading Google Maps API");
};
