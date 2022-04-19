import API from './api';
import layout from './components/layout';

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

    // TODO: render default containers for location/weather?
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
      this.renderForecast();
    });
  }

  renderLocation({ name, state, country }) {
    const stateStr = state ? `${state}, ` : '';
    const template = `<h1 class="mt-10 text-2xl font-bold text-center">${name}, ${stateStr} ${country}</h1>`;
    const containerEl = document.querySelector('.js-main');
    containerEl.insertAdjacentHTML('beforeend', template);
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

    const containerEl = document.querySelector('.js-main');
    containerEl.insertAdjacentHTML('beforeend', template);
  }

  renderForecast() {
    const template = `
    <div class="mx-auto my-10 border-b w-4/6"></div>

    <div class="flex justify-center flex-wrap">
      <div class="text-center">
        <span class="block opacity-60">4/20</span>
        <img
          class="block mx-auto"
          src="https://openweathermap.org/img/wn/04n@2x.png"
          alt="overcast clouds"
        />
        <span class="block">2°C</span>
        <span class="block">4m/s</span>
      </div>

      <div class="text-center">
        <span class="block opacity-60">4/21</span>
        <img
          class="block mx-auto"
          src="https://openweathermap.org/img/wn/04n@2x.png"
          alt="overcast clouds"
        />
        <span class="block">2°C</span>
        <span class="block">4m/s</span>
      </div>
    </div>
    `;

    const containerEl = document.querySelector('.js-main');
    containerEl.insertAdjacentHTML('beforeend', template);
  }
}

const ui = new UI();

export default ui;
