import { format } from 'date-fns';

import API from './api';
import layout from './components/layout';

// QUESTION: move fn inside class?
const replaceWithTemplate = function replaceWithTemplate(selector, template) {
  const el = document.querySelector(selector);
  el.replaceChildren();
  el.insertAdjacentHTML('beforeend', template);
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
  }

  addHandlers() {
    const searchForm = document.querySelector('.js-search-form');

    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // TODO: check for errors
      const city = searchForm.querySelector('[name="city"]').value;

      const geoData = await API.getGeoCoords(city);
      console.log(`geoData`, geoData);
      // TODO: render in one step
      this.renderLocation(geoData[0]);

      // TODO: pick right location
      const { lat, lon } = geoData[0];
      const weather = await API.getWeather(lat, lon);
      this.renderWeather(weather);

      // TODO: refactor
      this.renderForecast(weather.daily);
    });
  }

  renderLocation({ name, state, country }) {
    const stateStr = state ? `${state}, ` : '';
    const template = `<h1 class="mt-10 text-2xl font-bold text-center">${name}, ${stateStr} ${country}</h1>`;
    replaceWithTemplate('.js-location', template);
  }

  renderWeather({ current }) {
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
        <span
          class="inline-block border-b border-dotted cursor-default"
          title="feels like ${Math.round(current.feels_like)}&deg;C"
        >
          ${Math.round(current.temp)}&deg;C,
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
          <span>${Math.round(current.wind_speed)}m/s</span>
        </span>
      </span>
    </div>
    `;

    replaceWithTemplate('.js-weather', template);
  }

  renderForecast(data) {
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
          <span class="block">${Math.round(temp.day)}°C</span>
          <span class="block">${Math.round(wind_speed)}m/s</span>
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
}

const ui = new UI();

export default ui;
