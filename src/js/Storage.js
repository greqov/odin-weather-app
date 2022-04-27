class Storage {
  save(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.warn(`ERROR: Cannot restore "${key}" data from localStorage\n`, error);
      return null;
    }
  }
}

const storage = new Storage();

export default storage;
