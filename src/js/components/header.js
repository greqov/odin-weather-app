import storage from '../Storage';

let units = storage.get('units');

if (!units) {
  units = 'metric';
}

function header() {
  return `
    <header class="mb-6 border-b">
      <div class="container mx-auto py-6 px-4">
        <div class="flex items-center justify-between">
          <span class="block text-3xl font-bold">Weather App</span>
          <button
            class="js-units-btn text-2xl italic border-b border-dotted cursor-pointer"
            title="Change units"
            data-units="${units}"
            type="button"
          >
            &deg;${units === 'metric' ? 'C' : 'F'}
          </button>
        </div>
      </div>
    </header>
  `;
}

export default header();
