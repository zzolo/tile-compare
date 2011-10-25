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
    
    // Google
    var mapGoogle = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.Google('Google Streets');
    mapGoogle.addLayer(layer);
    var panelGoogle = new GeoExt.MapPanel({
      renderTo: 'map1',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: mapGoogle,
      title: 'Google Street'
    });
    
    // Bing
    var mapBing = new OpenLayers.Map();
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var road = new OpenLayers.Layer.Bing({ key: apiKey, type: 'Road' });
    var aerial = new OpenLayers.Layer.Bing({ key: apiKey, type: 'Aerial' });
    mapBing.addLayer(road);
    var panelBing = new GeoExt.MapPanel({
      renderTo: 'map2',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: mapBing,
      title: 'Bing Aerial'
    });
    
    // OSM
    var mapOSM = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    mapOSM.addLayer(layer);
    var panelOSM = new GeoExt.MapPanel({
      renderTo: 'map3',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: mapOSM,
      title: 'OSM'
    });
    
    // Yahoo
    var mapYahoo = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.Yahoo( "Yahoo");
    mapYahoo.addLayer(layer);
    var panelYahoo = new GeoExt.MapPanel({
      renderTo: 'map4',
      height: Math.floor(windowHeight / 2),
      width: Math.floor(windowWidth / 2),
      map: mapYahoo,
      title: 'Yahoo'
    });
    
  });

})(jQuery);