var transformRequest = (url, resourceType) => {
  var isMapboxRequest =
    url.slice(8, 22) === "api.mapbox.com" ||
    url.slice(10, 26) === "tiles.mapbox.com";
  return {
    url: isMapboxRequest
    ? url.replace("?", "?pluginName=sheetMapper&")
    : url
  };
};

mapboxgl.accessToken = 'pk.eyJ1IjoibmFudGVzYmVlcmNsdWIiLCJhIjoiY2s5Mmt4MmY5MDE1ZTNsa2Fma2gzbDd5NSJ9.XMmKEkOpwAGdIjiAydy70w';
var map = new mapboxgl.Map({
  container: 'map',
  style: "mapbox://styles/nantesbeerclub/ck92kzhyk0k9n1io09i1c9kj2",
  center: [-1.556, 47.20,],
  zoom: 11.43,
  transformRequest: transformRequest
});

map.on("load", function() {
  init();
});

function init() {
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1x8svBTaLETQd0AD2L57GwXbA1ZTP9iAWlIKON_fnwcI/edit#gid=0',
    callback: addPoints,
    simpleSheet: true
  });
}

function addPoints(data) {
  data.forEach(function(row) {
    var popup = new mapboxgl.Popup()
      .setHTML(`<h3>` + row.Name + `</h3>` + '<h4>' + '<b>' + 'Address: ' + '</b>' + row.Address + '</h4>' + '<h4>' + '<b>' + 'Phone: ' + '</b>' + row.Phone + '</h4>');

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
    console.log(row);
    <!-- el.style.color = row.properties['marker-col']; -->
    el.innerHTML = '<i class="fas fa-train"></i>';

    var marker = new mapboxgl.Marker(el)
      .setLngLat([row.Longitude, row.Latitude])
      .setPopup(popup)
      .addTo(map);
  });
}

