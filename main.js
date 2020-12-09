const menuBtn = document.querySelector('.menu-btn');
const menuburger = document.querySelector('.menu-hamburger');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuburger.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuburger.classList.remove('open');
    menuOpen = false;
  }
});


$('.nav-item').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
});

let map;

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: -33.950430, lng: 151.106994},
    mapTypeId: "hybrid",
  });

  new google.maps.Marker({
    position: map.getCenter(),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeWeight: 10,
      scale: 4,
      strokeColor: "blue"
    },
    draggable: true,
    map: map,
  });

  var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
  };
  // loads databased saved coordinates
  var propertyCoords = '';
  var points = [
    {lat: -33.94961909444093, lng: 151.106277961731},
    {lat: -33.950139094533704, lng: 151.10250460147856},
    {lat: -33.95307300633199, lng: 151.10500761032108},
    {lat: -33.95144370293589, lng: 151.10790063098077},
    {lat: -33.95184351218144, lng: 151.1083045616746},
    {lat: -33.951379377574, lng: 151.10986344158653},
    {lat: -33.951732661333665, lng: 151.11023461937907},
    {lat: -33.95106867728546, lng: 151.11123446702962},
    {lat: -33.95082647055273, lng: 151.11104547977453},
    {lat: -33.95075144504557, lng: 151.1113541507721},
    {lat: -33.94963250597274, lng: 151.11031072616578},
    {lat: -33.949252248633954, lng: 151.11083371162417},
    {lat: -33.94902572706911, lng: 151.110635137558},
    {lat: -33.948821454813306, lng: 151.108124499321},
    {lat: -33.948884181197315, lng: 151.10771671295166},
    {lat: -33.94938428396876, lng: 151.1073515701294},
    {lat: -33.94961909444093, lng: 151.106277961731},
  ];

  var existingPolygon = null;

  var drawingManager = null;

  if (typeof points !== 'undefined') {
      if (!google.maps.Polygon.prototype.getBounds) {
          google.maps.Polygon.prototype.getBounds = function() {
              var bounds = new google.maps.LatLngBounds();
              this.getPath().forEach(function(element, _) {
                  bounds.extend(element);
              });
              return bounds;
          };
      }

      /**
       * used for tracking polygon bounds changes within the drawing manager
       */
      google.maps.Polygon.prototype.enableCoordinatesChangedEvent = function() {
          var me = this,
              isBeingDragged = false,
              triggerCoordinatesChanged = function() {
                  //broadcast normalized event
                  google.maps.event.trigger(me, "coordinates_changed");
              };

          //if  the overlay is being dragged, set_at gets called repeatedly, so either we can debounce that or igore while dragging, ignoring is more efficient
          google.maps.event.addListener(me, "dragstart", function() {
              isBeingDragged = true;
          });

          //if the overlay is dragged
          google.maps.event.addListener(me, "dragend", function() {
              triggerCoordinatesChanged();
              isBeingDragged = false;
          });

          //or vertices are added to any of the possible paths, or deleted
          var paths = me.getPaths();
          paths.forEach(function(path, i) {
              google.maps.event.addListener(path, "insert_at", function() {
                  triggerCoordinatesChanged();
              });
              google.maps.event.addListener(path, "set_at", function() {
                  if (!isBeingDragged) {
                      triggerCoordinatesChanged();
                  }
              });
              google.maps.event.addListener(path, "remove_at", function() {
                  triggerCoordinatesChanged();
              });
          });
      };

      function extractPolygonPoints(data) {
          var MVCarray = data.getPath().getArray();

          var to_return = MVCarray.map(function(point) {
              return `(${point.lat()},${point.lng()})`;
          });
          // first and last must be same
          return to_return.concat(to_return[0]).join(",");
      }

      existingPolygon = new google.maps.Polygon({
          paths: points,
          editable: true,
          draggable: true,
          map: map,
          ...polyOptions
      });
      map.fitBounds(existingPolygon.getBounds());

      existingPolygon.enableCoordinatesChangedEvent();

      google.maps.event.addListener(existingPolygon, 'coordinates_changed', function() {
          console.log('coordinates changed!', extractPolygonPoints(existingPolygon))
      });
      // My guess is to use a conditional statement to check if the map has any coordinates saved?
  } else {
      drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ["polygon"]
          },
          polylineOptions: {
              editable: true,
              draggable: true
          },
          rectangleOptions: polyOptions,
          circleOptions: polyOptions,
          polygonOptions: polyOptions,
          map: map
      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
          if (e.type !== google.maps.drawing.OverlayType.MARKER) {
              // Switch back to non-drawing mode after drawing a shape.
              drawingManager.setDrawingMode(null);
              // Add an event listener that selects the newly-drawn shape when the user
              // mouses down on it.
              var newShape = e.overlay;
              newShape.type = e.type;
              google.maps.event.addListener(newShape, 'click', function(e) {
                  if (e.vertex !== undefined) {
                      if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                          var path = newShape.getPaths().getAt(e.path);
                          path.removeAt(e.vertex);
                          if (path.length < 3) {
                              newShape.setMap(null);
                          }
                      }
                  }
                  setSelection(newShape);
              });
          }
          var coords = e.overlay.getPath().getArray();
          document.getElementById("propertyCoordinates").value = coords;
      });
  }

}