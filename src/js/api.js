import storage from './Storage';

const API_KEY = '0b409c06e12f4db8a7524fbfcca483c4';
const limit = 5;

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Wut!', error);
    return null;
  }
}

const API = {
  async getGeoCoords(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_KEY}`;

    const data = await getData(url);
    return data;
  },

  async getWeather(lat, lon) {
    const exclude = 'hourly,minutely';
    const units = storage.get('units') || 'metric';
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${API_KEY}`;

    const data = await getData(url);
    return data;
  },
};

export default API;
