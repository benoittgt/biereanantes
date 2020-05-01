// Detect when element are loaded
function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    let element = document.querySelector(selector);

    if(element) {
      resolve(element);
      return;
    }

    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        let nodes = Array.from(mutation.addedNodes);
        for(let node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

// Hide loader when markers are visible
waitForElement(".marker").then(function(element) {
  document.querySelector('.loader').style.display = 'none'
});

let transformRequest = (url, resourceType) => {
  const isMapboxRequest = url.indexOf('mapbox.com') !== -1;

  return {
    url: isMapboxRequest
    ? url.replace("?", "?pluginName=sheetMapper&")
    : url
  };
};

function mapZoom() {
  width = document.documentElement.clientWidth
  if (width < 768) {
    return 10.2;
  }  else {
    return 12;
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoibmFudGVzYmVlcmNsdWIiLCJhIjoiY2s5Mmt4MmY5MDE1ZTNsa2Fma2gzbDd5NSJ9.XMmKEkOpwAGdIjiAydy70w';
let map = new mapboxgl.Map({
  container: 'map',
  style: "mapbox://styles/nantesbeerclub/ck92kzhyk0k9n1io09i1c9kj2",
  center: [-1.566839, 47.217261],
  zoom: mapZoom(),
  transformRequest: transformRequest
});

map.on("load", function() {
  init();
});

function init() {
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1XiDdnLFx94EopYhj1jsFr1QH3zRXpk7BjoQjtTRMcQ8/edit#gid=0',
    callback: addPoints,
    simpleSheet: true
  });
}

function buildPopup(row) {
  let coupon, webshop, details, timetable, contact = ''

  let barName = `<h3 class='bar-name'><a target="_blank" href=${row.Site}>${row.Nom}</a></h3>`

  if (row.Coupon) {
    coupon = `<h3 class='coupon-link'><a target="_blank" href=${row.Coupon}>Coupon</a></h3>`
  }

  if (row.Webshop) {
    coupon = `<h3 class='webshop-link'><a target="_blank" href=${row.Webshop}>Webshop</a></h3>`
  }

  if (row.Details) {
    details = `<i class='place-detail'>${row.Details}</i>`
  }

  if (row.Horaires) {
    timetable = `<h4><i class="fas fa-clock"></i> : </b>${row.Horaires}</h4>`
  }

  if (row.Contact) {
    contact = `<h4><b><i class="fas fa-phone-alt"></i> : </b>${row.Contact}</h4>`
  }

  let addressType = `<h4><b><i class="fas fa-map"></i> : </b>${row.Adresse}</h4>`

  let popup = [
    barName,
    coupon,
    webshop,
    `<div class='detail'>`,
    details,
    timetable,
    contact,
    addressType,
    `</div>`
  ].join('')

  return popup
}

function chooseIcon(placeType, livraison, customIcon) {
  let iconType = {
    'Brasserie': 'fa-warehouse fa-lg',
    'Cave à bière': 'fa-store fa-lg',
    'Cave': 'fa-store fa-sm',
    'Coupon': 'fa-hand-holding-heart fa-sm',
    'Point de vente':  'fa-shopping-basket fa-sm'
  }
  let icon = customIcon || iconType[placeType] || 'fa-map-marker'
  if (livraison == 'Oui') {
    return `${icon} delivery`
  } else {
    return `${icon} no-delivery`
  }

}

function addPoints(data) {
  data.forEach(function(row) {
    let popup = new mapboxgl.Popup().setHTML(buildPopup(row));

    let el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `<i class="fas ${chooseIcon(row.Type, row.Livraison, row.CustomIcon)}"></i>`;

    try {
      let marker = new mapboxgl.Marker(el)
        .setLngLat(row.Position.replace(/\s/g, '').split(',').reverse())
        .setPopup(popup)
        .addTo(map);
    }
    catch(error) {
      console.log(`Error: ${error}. Row: ${row.Nom}`);
    }
  });
}

