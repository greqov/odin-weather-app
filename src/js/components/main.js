function main() {
  return `
  <main class="js-main container mx-auto mb-6 px-4">
    <form class="js-search-form" action="#">
      <label class="block relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search absolute top-0 bottom-0 m-auto left-4 opacity-60"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          class="mt-1 block w-full py-3 pr-3 pl-14 bg-white border border-slate-300 rounded-md shadow-sm text-base placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          type="text"
          name="city"
          placeholder="Enter location"
          autofocus
          autocomplete="off"
        />
      </label>
    </form>
  </main>
  `;
}

export default main();
