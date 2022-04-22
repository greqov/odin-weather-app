class Storage {
  save(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

const storage = new Storage();

export default storage;
