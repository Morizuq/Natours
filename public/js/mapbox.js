export const renderMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9yaXp1cSIsImEiOiJjbDh4NnB5M2IwM3h4M3VudjN1cGhybW5vIn0.QGGF_tb6vc2OL85_kungqw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/morizuq/cl8z69d5p000015pfhipaozac',
    scrollZoom: false,
    zoom: 10,
    center: [-118.2772506, 33.968655],
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
