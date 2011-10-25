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
    var maps = [];
    
    // Google
    maps['mapGoogle'] = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.Google('Google Streets');
    maps['mapGoogle'].addLayer(layer);
    var panelGoogle = new GeoExt.MapPanel({
      renderTo: 'map1',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: maps['mapGoogle'],
      title: 'Google Street'
    });
    
    // Bing
    maps['mapBing'] = new OpenLayers.Map();
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var road = new OpenLayers.Layer.Bing({ key: apiKey, type: 'Road' });
    var aerial = new OpenLayers.Layer.Bing({ key: apiKey, type: 'Aerial' });
    maps['mapBing'].addLayer(road);
    var panelBing = new GeoExt.MapPanel({
      renderTo: 'map2',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: maps['mapBing'],
      title: 'Bing Aerial'
    });
    
    // OSM
    maps['mapOSM'] = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    maps['mapOSM'].addLayer(layer);
    var panelOSM = new GeoExt.MapPanel({
      renderTo: 'map3',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: maps['mapOSM'],
      title: 'OSM'
    });
    
    // Yahoo
    maps['mapYahoo'] = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.Yahoo( "Yahoo");
    maps['mapYahoo'].addLayer(layer);
    var panelYahoo = new GeoExt.MapPanel({
      renderTo: 'map4',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: maps['mapYahoo'],
      title: 'Yahoo'
    });
    
    
    // Event listeners
    for (var i in maps) {
      if (maps.hasOwnProperty(i)) {
        maps[i].events.on('moveend', function(e) { console.log(e); });
        maps[i].events.on('zoomend', function(e) { console.log(e); });
      }
    }

    
  });
})(jQuery);