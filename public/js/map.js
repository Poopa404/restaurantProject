mapboxgl.accessToken = 'pk.eyJ1IjoiaGV4ZXIiLCJhIjoiY2xmdnE4OGs5MDlqcTN0bzIzcGp3dGtxciJ9.MiTLnjgH6OQev5kC6LJyDw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [98.97266123421693,18.759013125679765],
  zoom: 14
})
const marker1 = new mapboxgl.Marker()
    .setLngLat([98.97266123421693,18.759013125679765])
    .addTo(map);

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: 'en-EN',
    mapboxgl: mapboxgl
});
const geocoderBar = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: 'en-EN',
    mapboxgl: mapboxgl
});
map.addControl(geocoder);

geocoderBar.addTo('#geoBar')
$(document).ready(function () {
    $('#geoBar .mapboxgl-ctrl').addClass("w-full max-w-none h-full bg-sweed-dark")
    $('#geoBar .mapboxgl-ctrl-geocoder--input').addClass("text-sweed-white focus:text-sweed-white focus:animate-pulse")
    $('#geoBar .mapboxgl-ctrl-geocoder--button').addClass("bg-transparent")
    // $('#title').mouseup(function () { 
    //     //console.log(geocoder.getProximity())
    //     console.log(marker1.getLngLat())
    // });
});