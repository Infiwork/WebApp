
var templates = {
    homeViewTemplate:"views/homeViewTemplate.html",
    restaurantCategoriesViewTemplate:"views/restaurantCategoriesViewTemplate.html",
    restaurantListViewTemplate:"views/restaurantListViewTemplate.html",
    restaurantViewTemplate:"views/restaurantViewTemplate.html",
    nextToMeViewTemplate:"views/nextToMeViewTemplate.html",
    filtersSearchViewTemplate:"views/filtersSearchViewTemplate.html",
    conectErrorViewTemplate:"views/conectErrorViewTemplate.html",
    loadingViewTemplate:"views/loadingViewTemplate.html",
    mapViewTemplate:"views/mapViewTemplate.html",
    /*searchResultsViewTemplate:"views/searchResultsViewTemplate.html",
    searchViewTemplate:"views/searchViewTemplate.html",*/
    loaded: 0,
    requested: 0
};

var ___templatesLoadedCallback;

function loadTemplates(callback) {
    ___templatesLoadedCallback = callback;
    
    //load Mousetache HTML templates
    for (var key in templates) {
        (function() {
             var _key = key.toString();
             if ( _key != "loaded" && _key != "requested" ){
                 templates.requested ++;
                 var templateLoaded = function( template ){
                    onTemplateLoaded( template, _key );
                 }
                 $.get( templates[ _key ], templateLoaded, "html" );
             }
         })();
    }
}

function onTemplateLoaded(template, key) {
    templates[ key ] = template;
    templates.loaded ++;
    
    if ( templates.loaded == templates.requested ) {
        ___templatesLoadedCallback();
    }
}

function isTablet() {
    var _w = $(window).width();
    var _h = $(window).height();
    return (Math.min(_w,_h) >= 600);
}

function ViewAssembler() {
    this.touchSupported = 'ontouchstart' in window;
    //this.CLICK_EVENT = this.touchSupported ? 'touchend' : 'click';
    this.CLICK_EVENT = 'click';
    return this;
}

ViewAssembler.prototype.homeView = function() {
    var el = $( templates.homeViewTemplate );
    el.find("#restaurantes").on( this.CLICK_EVENT, onRestaurantCategoriesViewClick );
    //el.find("#eventos").on( this.CLICK_EVENT, onEventsListViewClick );
    el.find("#cerca-de-mi").on( this.CLICK_EVENT, onNextToMeViewClick );
    return el;
}

ViewAssembler.prototype.restaurantCategoriesView = function() {
    var el = $(templates.restaurantCategoriesViewTemplate );
    el.find(".item-categories").on( this.CLICK_EVENT, onRestaurantListViewClick );
    el.find(".item-filter").on( this.CLICK_EVENT, onFiltersSearchViewClick );
    return el;
}

ViewAssembler.prototype.restaurantListView = function(data) {
    var template = templates.restaurantListViewTemplate ;     
    var el = $( Mustache.to_html(template, data));
    el.find(".item-list").on( this.CLICK_EVENT, onRestaurantViewClick );
    return el;
}

ViewAssembler.prototype.restaurantView = function(data) {
    var template = templates.restaurantViewTemplate ;     
    var el = $( Mustache.to_html(template, data));
    el.find(".image-principal").on( this.CLICK_EVENT, onImagePrincipal );
    el.find("#panel-call").on( this.CLICK_EVENT, onPanelCall );
    el.find("#see-map").on( this.CLICK_EVENT, onImageMapClick );

   var point;
    
    setTimeout( function(){
    $.each(data.data, function(i,item){
            point = (item.mapa).split(',');
    });

    var map = L.map('map-image', {
    zoomControl:false,
    dragging:false
    }).setView([point[0],point[1]], 16);
  
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy;Globalisimo.com'
    }).addTo(map);
    L.marker([point[0],point[1]]).addTo(map);

    }, 120 );
    
    return el;
}

ViewAssembler.prototype.filtersSearchView = function() {
    var el = $( templates.filtersSearchViewTemplate );
    return el;
}

ViewAssembler.prototype.nextToMeView = function(data) {
    var template = templates.nextToMeViewTemplate;
    var el = $( Mustache.to_html(template, data));
    return el;
}

ViewAssembler.prototype.mapView = function() {
    var el = $( templates.mapViewTemplate );
    return el;
}

ViewAssembler.prototype.conectErrorView = function() {
    var el = $( templates.conectErrorViewTemplate );
    return el;
}

ViewAssembler.prototype.loadingView = function() {
    var el = $( templates.loadingViewTemplate );
    return el;
}

/*


ViewAssembler.prototype.defaultView = function() {
    var el = $( templates.defaultViewTemplate );
    //el.find("#nearMe").on( this.CLICK_EVENT, onNearbyViewClick );
    //el.find("#search").on( this.CLICK_EVENT, onSearchViewClick );
    el.find("#about").on( this.CLICK_EVENT, onAboutViewClick );
    return el;
}

ViewAssembler.prototype.aboutView = function() {
    var el = $( templates.aboutViewTemplate );
    return el;
}

ViewAssembler.prototype.findNearbyView = function() {
    var el = $( templates.findMarketsNearMeViewTemplate );
    return el;
}

ViewAssembler.prototype.nearbyMarketsView = function( latitude, longitude, marketsArr ) {
    var result = [];
    for ( var i=0; i< marketsArr.length; i++ ) {
        var market = arrayToMarketObject( marketsArr[i] );
        
        var lat1 = parseFloat(market.y);
        var lon1 = parseFloat(market.x);
        var lat2 = parseFloat(latitude);
        var lon2 = parseFloat(longitude);
        
        market.distance = Math.round( distance( lat1, lon1, lat2, lon2 ) );
        result.push( market );
    }
    
    result.sort( function(a, b){
        if ( a.distance < b.distance ) { return -1; }
        else if (a.distance > b.distance ) { return 1; }
        else return 0;
    });
    
    window.filteredMarkesList = result;    
    
    var viewModel = {   latitude: latitude,
                        longitude: longitude,
                        mapWidth: $(window).width(),
                        mapHeight: 100,
                        markets: result
                    };
    var template = templates.marketsNearMeViewTemplate;
                  
    var el = $( Mustache.to_html(template, viewModel) );
    el.find( "li" ).on( this.CLICK_EVENT, onNearbyListItemClick );
    el.find( "#mapButton" ).on( this.CLICK_EVENT, onMapButtonClick );
    return el;
}

ViewAssembler.prototype.marketDetailsView = function( market ) {
    var template = templates.marketDetailsViewTemplate;
    return $( Mustache.to_html(template, market) );
}

ViewAssembler.prototype.searchView = function () {
    var el = $( templates.searchViewTemplate );
    var $state = el.find( "#search_state" );
    
    var states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
    for ( var i in states ) {
        $state.append($("<option></option>").text(states[i])); 
    }
    
    el.find( "#searchButton" ).on( this.CLICK_EVENT, onSearchButtonClick );
    return el;
}

ViewAssembler.prototype.searchResultsView = function( marketsArr, criteria ) {
    var viewModel = {markets:[]};
    for ( var i=0; i< marketsArr.length; i++ ) {
        var market = arrayToMarketObject( marketsArr[i] );
        viewModel.markets.push( market );
    }
    
    viewModel.markets.sort( function(a, b){
        if ( a.marketName < b.marketName ) { return -1; }
        else if (a.marketName > b.marketName ) { return 1; }
        else return 0;
    });
    
    viewModel.overLength = viewModel.markets.length > 50;
    viewModel.markets = viewModel.markets.slice( 0, Math.min(49, viewModel.markets.length-1));
    
    viewModel.criteria = criteriaToString(criteria);
    window.filteredMarkesList = viewModel.markets;  
    
    var template = templates.searchResultsViewTemplate;
                  
    var el = $( Mustache.to_html(template, viewModel) );
    el.find( "li" ).on( this.CLICK_EVENT, onNearbyListItemClick );
    el.find( "#mapButton" ).on( this.CLICK_EVENT, onSearchResultMapButtonClick );
    
    
    
    return el;
}

ViewAssembler.prototype.geoPermissionDenied = function() {
    var el = $( templates.geoPermissionDeniedViewTemplate );
    return el;
}

ViewAssembler.prototype.mapView = function(centerLatLng) {
    var el = $( templates.mapViewTemplate );
    setTimeout( function(){
    var map = new L.Map('map');

    //cloudmadeUrl = 'http://{s}.tile.cloudmade.com/YOUR-API-KEY/997/256/{z}/{x}/{y}.png',
    var cloudmadeUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});
    
    map.addLayer(cloudmade);
    

    var blueMarkerIcon = L.Icon.extend({
        iconUrl: 'assets/map/marker-lightblue.png',
        shadowUrl: 'assets/map/shadow.png',
        iconSize: new L.Point(26, 40),
        shadowSize: new L.Point(32, 39),
        iconAnchor: new L.Point(14, 39),
        popupAnchor: new L.Point(0, -35)
    });
    var yellowMarkerIcon = L.Icon.extend({
        iconUrl: 'assets/map/marker-yellow.png',
        shadowUrl: 'assets/map/shadow.png',
        iconSize: new L.Point(26, 40),
        shadowSize: new L.Point(32, 39),
        iconAnchor: new L.Point(14, 40),
        popupAnchor: new L.Point(13, 12)
    });
    
    var blueIcon = new blueMarkerIcon();
    var yellowIcon = new yellowMarkerIcon();
    
    var markersLayer = new L.LayerGroup();
    var southWestBounds, northEastBounds, bounds;
    if ( window.filteredMarkesList ) {
    
        for ( var x=0; x<window.filteredMarkesList.length; x++ ) {
            var market = window.filteredMarkesList[x];
            
            if ( market.x != "" && market.y != "" ) {
            
                var latLng = new L.LatLng(market.y, market.x);
                var marker = new L.Marker(latLng, {icon: yellowIcon});
    
                var popupContent = "<a class='button' href='javascript:showMarketDetailsFromMapClick(" + market.index + ");'>" + market.marketName + "</a>"; 
                
                var popup = marker.bindPopup( popupContent, {offset:new L.Point(0,-35)} );
                markersLayer.addLayer(marker);
                
                if ( !southWestBounds ) {
                    southWestBounds = { lat:market.y, lon:market.x};
                    northEastBounds = { lat:market.y, lon:market.x};
                }
                else {
                    southWestBounds.lat = Math.min( southWestBounds.lat, market.y );
                    southWestBounds.lon = Math.min( southWestBounds.lon, market.x );
                    northEastBounds.lat = Math.max( northEastBounds.lat, market.y );
                    northEastBounds.lon = Math.max( northEastBounds.lon, market.x );
                }
			}
        }
			
        if ( southWestBounds ) {
            //console.log(southWestBounds, northEastBounds);
            var southWest = new L.LatLng(southWestBounds.lat,southWestBounds.lon),
                northEast = new L.LatLng(northEastBounds.lat,northEastBounds.lon),
                bounds = new L.LatLngBounds(southWest, northEast);
        }
        map.addLayer(markersLayer);
    }
    
    var onLocationFound = function (e) {
    		var radius = e.accuracy / 2;

			var marker = new L.Marker(e.latlng, {icon: blueIcon});
			markersLayer.addLayer(marker);
			marker.bindPopup("You are within " + radius + " meters from this point");

			var circle = new L.Circle(e.latlng, radius);
			markersLayer.addLayer(circle);
		}
		
		var onLocationError = function (e) {
			alert(e.message);
		}
    
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
    

        if ( centerLatLng == undefined ){
            
            if ( bounds ) {
                map.fitBounds(bounds);
                map.locate();
            }
            else {
                map.locateAndSetView(7);
            }
        }
        else {
            if ( bounds ) {
                map.fitBounds(bounds);
                map.locate();
            }
            else {
                map.setView( centerLatLng, (isTablet() ? 7 : 6) ); 
            }
        }
        
        var currentViewDescriptor = window.viewNavigator.history[ window.viewNavigator.history.length-1 ];
        currentViewDescriptor.showCallback = function() {
         
            //this is to work around a weird issue in Leaflet maps in iOS, where 
            //dragging stops working after a new view has been pushed onto the stack
                
            var latLng = map.getCenter();
            var zoom = map.getZoom();
            map.removeLayer( cloudmade );
            map.removeLayer( markersLayer );
            
            $('#mapContainer').children().remove();
            $('#mapContainer').append( $("<div id='map' style='width:100%; height:100%'></div>") );
            map = new L.Map('map');
            
            map.addLayer( cloudmade );
            map.addLayer( markersLayer );
            map.setView( latLng, zoom, true );
            
        }
    
    }, 150 );
    
    
    return el;
}

ViewAssembler.prototype.marketMapView = function(market) {
    var template = templates.marketMapViewTemplate;
    var el = $( Mustache.to_html(template, market) );
    setTimeout( function(){
    var map = new L.Map('map');

    //cloudmadeUrl = 'http://{s}.tile.cloudmade.com/YOUR-API-KEY/997/256/{z}/{x}/{y}.png',
    var cloudmadeUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});
    
    map.addLayer(cloudmade);
    

    var blueMarkerIcon = L.Icon.extend({
        iconUrl: 'assets/map/marker-lightblue.png',
        shadowUrl: 'assets/map/shadow.png',
        iconSize: new L.Point(26, 40),
        shadowSize: new L.Point(32, 39),
        iconAnchor: new L.Point(14, 39),
        popupAnchor: new L.Point(0, -35)
    });
    var yellowMarkerIcon = L.Icon.extend({
        iconUrl: 'assets/map/marker-yellow.png',
        shadowUrl: 'assets/map/shadow.png',
        iconSize: new L.Point(26, 40),
        shadowSize: new L.Point(32, 39),
        iconAnchor: new L.Point(14, 40),
        popupAnchor: new L.Point(13, 12)
    });
    
    var blueIcon = new blueMarkerIcon();
    var yellowIcon = new yellowMarkerIcon();
    
    var markersLayer = new L.LayerGroup();;
    if ( market ) {    
        var latLng = new L.LatLng(market.y, market.x);
        var marker = new L.Marker(latLng, {icon: yellowIcon});

        var popupContent = "<a class='button' href='javascript:showMarketDetailsFromMapClick(" + market.index + ");'>" + market.marketName + "</a>"; 
        
        marker.bindPopup( popupContent, {offset:new L.Point(0,-35)} );
       
        markersLayer.addLayer(marker);
        map.addLayer(markersLayer);
    }
    
    var onLocationFound = function (e) {
    		var radius = e.accuracy / 2;

			var marker = new L.Marker(e.latlng, {icon: blueIcon});
			markersLayer.addLayer(marker);
			marker.bindPopup("You are within " + radius + " meters from this point");

			var circle = new L.Circle(e.latlng, radius);
			markersLayer.addLayer(circle);
		}
		
		var onLocationError = function (e) {
			alert(e.message);
		}
    
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);

        map.locate();
        map.setView( new L.LatLng( market.y, market.x ), 14 ); 
    
    }, 150 );
    
    return el;
}
*/