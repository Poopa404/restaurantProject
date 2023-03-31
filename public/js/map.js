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
    mapboxgl: mapboxgl,
    enableGeolocation: true,
});

map.addControl(geocoder);

geocoder.on('result', (result) => {
    console.log(result.result);
    const thing = {
        test: 1
    };
    $.post("/addLocation", thing, (data, status) => {
    });
})

// $(document).ready(function () {

//      $('#title').mouseup(function () { 
//         console.log(geocoder.getProximity())
//      });
// });