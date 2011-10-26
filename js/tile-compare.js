/**
 * @file
 * Tile Compare main script.
 */

// Namespace jQuery
(function($) {

  // When Ext is ready
  Ext.onReady(function() {
    // Let's get some measurements from the page, as
    // it does not seem possible to define panels
    // that use percentage.
    var headerHeight = $('header').height();
    var windowHeight = $(window).height() - headerHeight;
    var windowWidth = $(window).width();
    var bingKey = 'AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf';
    var maps = {};
    
    // Data
    maps = {
      'google': {
        'title': 'Google',
        'layers': [ new OpenLayers.Layer.Google('Google Streets') ]
      },
      'bing': {
        'title': 'Bing',
        'layers': [ 
          new OpenLayers.Layer.Bing({ name: 'Bing Streets', key: bingKey, type: 'Road' }), 
          new OpenLayers.Layer.Bing({ name: 'Bing Aerial', key: bingKey, type: 'Aerial' }) ],
        'zoom_offset': -1
      },
      'yahoo': {
        'title': 'Yahoo',
        'layers': [ new OpenLayers.Layer.Yahoo('Yahoo Streets', {
          'sphericalMercator': true,
          'maxExtent': new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
        }) ]
      },
      'osm': {
        'title': 'OSM',
        'layers': [ new OpenLayers.Layer.OSM('OSM Default') ]
      }
    };
    
    // Got through maps
    var count = 0;
    for (var i in maps) {
      if (maps.hasOwnProperty(i)) {
        count++;
        
        // Define controls
        var controls = [
          new OpenLayers.Control.LayerSwitcher({'ascending':false}),
          new OpenLayers.Control.KeyboardDefaults(),
          new OpenLayers.Control.Attribution(),
          new OpenLayers.Control.Navigation()
        ];
        
        // Create new map and controls
        maps[i].map = new OpenLayers.Map('', {
          controls: controls,
          projection: new OpenLayers.Projection('EPSG:900913'),
          tile_compare_map: i,
          zoom_offset: (maps[i].zoom_offset) ? maps[i].zoom_offset : 0
        });
        
        // Add layers
        maps[i].map.addLayers(maps[i].layers);
        
        // Create panel
        maps[i].panel = new GeoExt.MapPanel({
          renderTo: 'map' + count,
          height: Math.floor(windowHeight / 2),
          width: Math.floor(windowWidth / 2),
          map: maps[i].map,
          title: maps[i].title
        });
        
        // Set center and zoom
        maps[i].map.setCenter(new OpenLayers.LonLat(100, 10), 4);
        
        // For the first map, lets add some helpful controls
        if (count == 1) {
          maps[i].map.addControl(new OpenLayers.Control.Permalink('permalink'));
          maps[i].map.addControl(new OpenLayers.Control.PanZoom());
        }
        
        // Generic event handler to mirror movement on all maps.
        var moveSharer = function(event) {
          var thisMap = event.object;
          for (var j in maps) {
            // Ensure there is a map and its not the current map
            if (maps.hasOwnProperty(j) && typeof maps[j].map != 'undefined' && j != thisMap.tile_compare_map) {
              maps[j].map.moveTo(thisMap.center, thisMap.zoom + maps[j].map.zoom_offset, { dragging: false });
            }
          }
        };
        
        // Hack so that the move event doesn't spawn infinite ones.  We keep track
        // of original mover in maps object.
        var moveHack = function(event) {
          var thisMap = event.object;
          var movingMap = false;
          
          // Check if any maps are moving.
          for (var m in maps) {
            if (maps.hasOwnProperty(j) && typeof maps[m].map != 'undefined') {
              if (typeof maps[m].isMoving != 'undefined' && maps[m].isMoving == true) {
                movingMap = m;
              }
            }
          }
          
          console.log(event.type);
          console.log(thisMap.tile_compare_map);
          console.log(movingMap);
          
          
          // For starting, if no moving maps, then this map is the primary map,
          // otherwise, un-register other move events.
          if (event.type == 'movestart') {
            if (!movingMap) {
              maps[thisMap.tile_compare_map].etf = 'etf';
              maps[thisMap.tile_compare_map].isMoving = 'true';
              maps[thisMap.tile_compare_map].map.events.on({ 'move': moveSharer });
console.log(maps[thisMap.tile_compare_map]);
            }
            else {
              for (var j in maps) {
                if (maps.hasOwnProperty(j) && typeof maps[j].map != 'undefined' && j != thisMap.tile_compare_map) {
                  maps[j].map.events.un({ 'move': moveSharer });
                }
              }
            }
          }
          
          // For ending, un-register all events
          if (event.type == 'moveend') {
            for (var j in maps) {
              if (maps.hasOwnProperty(j) && typeof maps[j].map != 'undefined') {
                maps[j].map.events.un({ 'move': moveSharer });
                maps[j].isMoving = false;
              }
            }
          }
        };
        
        // Define event listeners
        maps[i].map.events.on({ 'movestart': moveHack });
        maps[i].map.events.on({ 'moveend': moveHack });
      }
    }
  });
})(jQuery);