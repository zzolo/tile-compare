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
        'layers': [ 
          new OpenLayers.Layer.Google('Google Streets', 
            { tile_compare_type: 'streets', numZoomLevels: 20 }),
          new OpenLayers.Layer.Google('Google Satellite', 
            { tile_compare_type: 'satellite', type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22 }),
          new OpenLayers.Layer.Google('Google Physical', 
            { tile_compare_type: 'satellite', type: google.maps.MapTypeId.TERRAIN, numZoomLevels: 20 })
        ]
      },
      'bing': {
        'title': 'Bing',
        'layers': [ 
          new OpenLayers.Layer.Bing(
            { name: 'Bing Streets', key: bingKey, tile_compare_type: 'streets', type: 'Road', wrapDateLine: true }), 
          new OpenLayers.Layer.Bing(
            { name: 'Bing Aerial', key: bingKey, tile_compare_type: 'satellite', type: 'Aerial', wrapDateLine: true })
        ],
        'zoom_offset': -1
      },
      'yahoo': {
        'title': 'Yahoo',
        'layers': [ 
          new OpenLayers.Layer.Yahoo('Yahoo Streets', {
            sphericalMercator: true,
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
            type: YAHOO_MAP_REG,
            tile_compare_type: 'streets'
          }),
          new OpenLayers.Layer.Yahoo('Yahoo Satellite', {
            sphericalMercator: true,
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
            type: YAHOO_MAP_SAT,
            tile_compare_type: 'satellite'
          })
        ]
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
          maps[i].map.addControl(new OpenLayers.Control.PanZoom());
        }
        // Add permalink now, so that it overrides center
        maps[i].map.addControl(new OpenLayers.Control.Permalink('permalink'));
        
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
        
        // Define event listeners.  Only define for first one, as hacking
        // around the move event handling is very difficult.
        if (count == 1) {
          maps[i].map.events.on({ 'movestart': moveSharer });
          maps[i].map.events.on({ 'move': moveSharer });
          maps[i].map.events.on({ 'moveend': moveSharer });
        
          // Geo locate user.  But first check if we have a permalink
          var argParser = new OpenLayers.Control.ArgParser();
          var args = argParser.getParameters();
          if (!args.lat && !args.lon) {
            var geolocate = new OpenLayers.Control.Geolocate({
              'bind': true,
              'geolocationOptions': {
                'enableHighAccuracy': true,
                'maximumAge': 0,
                'timeout': 4000
              }
            });
            maps[i].map.addControl(geolocate);
            
            // Add some event handling
            geolocate.events.on({ 'locationupdated': 
              function(e) {
                maps[i].map.moveTo(new OpenLayers.LonLat(e.point.x, e.point.y));
                
                // Hack for yahoo layers
                maps.yahoo.map.layers[0].redraw();
              }
            });
            geolocate.events.on({ 'locationfailed':
              function(e) {
                OpenLayers.Console.log('Location detection failed');
              }
            });
            
            // Activiate!
            geolocate.activate();
          }
        }
        
        // Hack around google map not loading correctly :(
        maps.google.map.layers[0].redraw();
      }
    }
    
    // Add some basic buttons for show street tiles and
    // satelite tiles
    var streetsButton = new Ext.Button({
      renderTo: 'streets-button',
      text: 'Streets',
      handler: function() {
        for (var j in maps) {
          if (maps.hasOwnProperty(j) && typeof maps[j].map != 'undefined') {
            var layers = maps[j].map.getLayersBy('tile_compare_type', 'streets');
            if (layers.length > 0 && typeof layers[0] != 'undefined') {
              maps[j].map.setBaseLayer(layers[0]);
            } 
          }
        }
      }
    });
    var satelliteButton = new Ext.Button({
      renderTo: 'satellite-button',
      text: 'Satellite',
      handler: function() {
        for (var j in maps) {
          if (maps.hasOwnProperty(j) && typeof maps[j].map != 'undefined') {
            var layers = maps[j].map.getLayersBy('tile_compare_type', 'satellite');
            if (layers.length > 0 && typeof layers[0] != 'undefined') {
              maps[j].map.setBaseLayer(layers[0]);
            } 
          }
        }
      }
    });
  });
})(jQuery);