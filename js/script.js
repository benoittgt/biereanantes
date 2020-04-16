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

function buildPopup(row) {

  let barName = `<h3 class='bar-name'><a target="_blank" href=${row.Site}>${row.Nom}</a></h3>`

  let coupon = ''
  if (row.Coupon) {
    coupon = `<h3 class='coupon-link'><a target="_blank" href=${row.Coupon}>Coupon</a></h3>`
  }

  let webshop = ''
  if (row.Webshop) {
    coupon = `<h3 class='webshop-link'><a target="_blank" href=${row.Webshop}>Webshop</a></h3>`
  }

  let details = ''
  // if (row.Details) {
  //   details = `<i class='place-detail'>${row.Details}</i>`
  // }

  let addressType = `<h4><b>Type: </b>${row.Type}</h4>
                  <h4><b>Adresse: </b>${row.Adresse}</h4>`
  let popup = [
    barName,
    coupon,
    webshop,
    `<div class='detail'>`,
    details,
    addressType,
    `</div>`
  ].join('')

  return popup
}

function chooseIcon(placeType) {
  let iconType = {
    'Brasserie': 'fa-warehouse',
    'Cave': 'fa-store',
    'Coupon': 'fa-hand-holding-heart',
    'Point de vente':  'fa-shopping-basket'
  }

  return iconType[placeType] || 'fa-map-marker'
}

function addPoints(data) {
  data.forEach(function(row) {
    var popup = new mapboxgl.Popup().setHTML(buildPopup(row));

    var el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `<i class="fas ${chooseIcon(row.Type)} fa-lg"></i>`;

    var marker = new mapboxgl.Marker(el)
      .setLngLat(row.Position.split(', ').reverse())
      .setPopup(popup)
      .addTo(map);
  });
}

