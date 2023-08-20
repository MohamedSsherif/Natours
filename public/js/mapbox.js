const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);


mapboxgl.accessToken =
 'pk.eyJ1IjoibWVkby0yMDAiLCJhIjoiY2xsZWhvNDE2MG4wdTNzbWc4NGRjcGF6MyJ9.S5PTrj_Wwqud7qYjedWDXA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});


