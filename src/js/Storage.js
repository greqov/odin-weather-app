class Storage {
  save(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  get(key) {
    return localStorage.getItem(key);
  }
}

const storage = new Storage();

export default storage;
