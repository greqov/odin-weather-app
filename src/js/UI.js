const ui = {
  renderLocation({ name, state, country }) {
    const tmplt = `location: ${name}, ${state}, ${country}<br/>`;
    // TODO: append to container
    document.body.insertAdjacentHTML('beforeend', tmplt);
  },

  renderWeather({ current }) {
    const { icon, description, main } = current.weather[0];
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    const template = `
      mememe<br/>
      <img src="${iconUrl}" alt="${description}"/> ${main}<br/>
      <div class="flex items-center">
        wind:
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up inline-block" style="transform: rotate(${
          current.wind_deg
        }deg);"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up-circle inline" style="transform: rotate(${
          current.wind_deg
        }deg);"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
        ${Math.round(current.wind_speed)}m/s
      </div>
      temp: ${Math.round(current.temp)}<br/>
      feels: ${Math.round(current.feels_like)}<br/>
    `;

    document.body.insertAdjacentHTML('beforeend', template);
  },
};

export default ui;
