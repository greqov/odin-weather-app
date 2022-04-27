import { format } from 'date-fns';

import storage from './Storage';
import API from './api';
import layout from './components/layout';
import { ftoc, ctof, mphToMs, msToMph } from './utils';

// QUESTION: move fn inside class?
const replaceWithTemplate = function replaceWithTemplate(selector, template) {
  const el = document.querySelector(selector);
  el.replaceChildren();
  el.insertAdjacentHTML('beforeend', template);
};

const convertTempTo = function (units, val) {
  return units === 'metric' ? ftoc(val) : ctof(val);
};

const convertSpeedTo = function (units, val) {
  return units === 'metric' ? mphToMs(val) : msToMph(val);
};

const validateField = function (el) {
  if (el.getAttribute('name') === 'city') {
    const message = el.closest('.js-search-form').querySelector('.js-city-message');

    if (el.validity.valid) {
      // hide errors
      message.classList.add('hidden');
      message.textContent = '';
    } else {
      // show errors
      el.classList.add('has-validation');
      message.classList.remove('hidden');

      if (el.validity.valueMissing) {
        message.textContent = 'Such empty! Type location to get weather forecast.';
      } else if (el.validity.patternMismatch) {
        message.textContent = `Type a single word with 3 letters minimum. Without spaces please.`;
      }

      return false;
    }
  }

  return true;
};

class UI {
  init() {
    document.querySelector('html').classList.add('scroll-smooth');
    document.body.classList.add(
      'relative',
      'min-h-screen',
      'overflow-y-scroll',
      'flex',
      'flex-col',
      'font-sans',
      'bg-zinc-50',
      'selection:bg-pink-300'
    );
    document.body.insertAdjacentHTML('beforeend', layout);
    this.addHandlers();

    const location = storage.get('location');
    if (location) {
      this.renderMain(location);
    }
  }

  getUnits() {
    const tempUnits = storage.get('units') === 'imperial' ? '°F' : '°C';
    const speedUnits = storage.get('units') === 'imperial' ? 'mph' : 'm/s';

    return { tempUnits, speedUnits };
  }

  addHandlers() {
    const searchForm = document.querySelector('.js-search-form');
    const cityInput = searchForm.querySelector('[name="city"]');
    const message = searchForm.querySelector('.js-city-message');

    cityInput.addEventListener('input', () => {
      if (cityInput.classList.contains('has-validation')) {
        validateField(cityInput);
      }
    });

    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateField(cityInput)) {
        return;
      }

      const city = searchForm.querySelector('[name="city"]').value;
      const geoData = await API.getGeoCoords(city);

      if (geoData === null) {
        message.classList.remove('hidden');
        message.textContent = 'Hmmm... Looks like a network error.';
        return;
      }

      if (geoData.length === 0) {
        message.classList.remove('hidden');
        message.textContent = 'Nothing found. Try to adjust your query.';
        return;
      }

      storage.save('geo', geoData);

      const location = geoData[0];
      storage.save('location', location);

      this.renderMain(location);
    });

    const unitsBtn = document.querySelector('.js-units-btn');
    unitsBtn.addEventListener('click', () => {
      if (unitsBtn.dataset.units === 'metric') {
        unitsBtn.dataset.units = 'imperial';
        unitsBtn.textContent = '°F';
        storage.save('units', 'imperial');
      } else {
        unitsBtn.dataset.units = 'metric';
        unitsBtn.textContent = '°C';
        storage.save('units', 'metric');
      }

      this.convertPrintedValues();
    });
  }

  async renderMain(location) {
    // TODO: render in one step
    this.renderLocation(location);

    // TODO: pick right location
    const { lat, lon } = location;
    const weather = await API.getWeather(lat, lon);
    this.renderWeather(weather);

    // TODO: refactor
    this.renderForecast(weather.daily);
  }

  renderLocation({ name, state, country }) {
    const stateStr = state ? `${state}, ` : '';
    const template = `<h1 class="mt-20 text-2xl font-bold text-center">${name}, ${stateStr} ${country}</h1>`;
    replaceWithTemplate('.js-location', template);
  }

  renderWeather({ current }) {
    const { tempUnits, speedUnits } = this.getUnits();
    const { icon, description, main } = current.weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const template = `
    <div>
      <img
        class="block mx-auto"
        src="${iconUrl}"
        alt="${description}"
        width="100" height="100"
      />
      <span class="flex flex-wrap items-center justify-center italic space-x-2">
        <span class="inline-block">${main},</span>
        <span class="inline-block cursor-default">
          <span class="js-temp-value">${Math.round(current.temp)}</span>
          <span class="js-temp-units">${tempUnits}</span>,
        </span>
        <span class="inline-flex items-center">
          <span class="pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="inline"
              style="transform: rotate(${current.wind_deg}deg)"
              data-darkreader-inline-stroke=""
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 12 8 8 12"></polyline>
              <line x1="12" y1="16" x2="12" y2="8"></line>
            </svg>
          </span>
          <span>
            <span class="js-speed-value">${Math.round(current.wind_speed)}</span>
            <span class="js-speed-units">${speedUnits}</span>
          </span>
        </span>
      </span>
    </div>
    `;

    replaceWithTemplate('.js-weather', template);
  }

  renderForecast(data) {
    const { tempUnits, speedUnits } = this.getUnits();
    const daily = data;
    daily.length = 5;

    let str = '';

    /* eslint-disable camelcase */
    daily.forEach((day) => {
      const { dt, temp, wind_speed, weather } = day;
      const { icon, description } = weather[0];
      str += `
        <div class="text-center mb-8">
          <span class="block opacity-60">${format(dt * 1000, 'E d/L')}</span>
          <img
            class="block mx-auto"
            src="https://openweathermap.org/img/wn/${icon}@2x.png"
            alt="${description}"
            width="100" height="100"
          />
          <span class="block">
            <span class="js-temp-value">${Math.round(temp.day)}</span>
            <span class="js-temp-units">${tempUnits}</span>
          </span>
          <span class="block">
            <span class="js-speed-value">${Math.round(wind_speed)}</span>
            <span class="js-speed-units">${speedUnits}</span>
          </span>
        </div>
      `;
    });
    /* eslint-enable camelcase */

    const template = `
      <div class="mx-auto my-10 border-b w-4/6"></div>
      <div class="flex justify-center flex-wrap">${str}</div>
    `;

    replaceWithTemplate('.js-forecast', template);
  }

  convertPrintedValues() {
    // convert F/C and C/F without additional request
    const units = storage.get('units');
    const { tempUnits, speedUnits } = this.getUnits();

    const tempValues = document.querySelectorAll('.js-temp-value');
    tempValues.forEach((item) => {
      const el = item;
      el.textContent = Math.round(convertTempTo(units, el.textContent));
    });

    const speedValues = document.querySelectorAll('.js-speed-value');
    speedValues.forEach((item) => {
      const el = item;
      el.textContent = Math.round(convertSpeedTo(units, el.textContent));
    });

    // QUESTION: is better update together with values?
    document.querySelectorAll('.js-temp-units').forEach((item) => {
      const el = item;
      el.textContent = tempUnits;
    });

    document.querySelectorAll('.js-speed-units').forEach((item) => {
      const el = item;
      el.textContent = speedUnits;
    });
  }
}

const ui = new UI();

export default ui;
