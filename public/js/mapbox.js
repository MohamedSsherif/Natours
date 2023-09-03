/* eslint-disable */
const locations =JSON.parse( document.getElementById('map').dataset.locations);
 console.log(locations);



mapboxgl.accessToken =
 'pk.eyJ1IjoibWVkby0yMDAiLCJhIjoiY2xsZWd5MXdzMGtzNzNkbno4N3RkdGdhYSJ9.vNuJNtQrXTBPwpACuuxYAA';

var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/mapbox/streets-v11'
  style:'mapbox://styles/medo-200/cllmnlkl600da01pec8ndg75h',
  // center: [-118.113491, 34.111745],
  // zoom: 4,
  scrollZoom:false
  // interactive:false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc=>{
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element:el,
    anchor:'bottom'
  }).setLngLat(loc.coordinates).addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset:30
  }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);

  //Extend map bounds to include current location
  bounds.extend(loc.coordinates);
})

map.fitBounds(bounds,{
  padding:{
    top:200,
    bottom:150,
    left:100,
    right:100
  }
})


