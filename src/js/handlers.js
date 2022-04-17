import API from './api';
import UI from './UI';

function addHandlers() {
  const searchForm = document.querySelector('.js-search-form');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // TODO: check for errors
    const city = searchForm.querySelector('[name="city"]').value;

    const geoData = await API.getGeoCoords(city);
    console.log(`geoData`, geoData);
    // TODO: render in one step
    UI.renderLocation(geoData[0]);

    // TODO: pick right location
    const { lat, lon } = geoData[0];
    const weather = await API.getWeather(lat, lon);
    UI.renderWeather(weather);
  });
}

export default addHandlers;
