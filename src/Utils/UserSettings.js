import localforage from "localforage";

const types = {
  startScene: { default: 'title' },
  volumeMaster: { default: 1.0 },
  volumeMusic: { default: 1.0 },
  volumeSfx: { default: 1.0 },
  muteMaster: { default: false },
  muteMusic: { default: false },
  muteSfx: { default: false },
};

export default class UserSettings {

  constructor() {
    localforage.config({
      name: 'ktbgame'
    });

    // create getters/setters for all known properties (for debugging)
    for (const type in types) {
      Object.defineProperty(this, type, {
        get: function() {
          return this.get(type).then(console.log);
        },
        set: function(value) {
          if (value == null) { return this.remove(type); }
          else { return this.set(type, value); }
        }
      });
    }
  }

  get(key, callback = null) {
    // intermediate function to parse the DB response before returning it
    const parseValue = function(value) {
      if (value == null && types[key] != null) {
        return types[key].default;
      } else {
        return value;
      }
    };

    // maintain support for both promises and callbacks
    if (callback == null) {
      return localforage.getItem(key).then(parseValue);
    } else {
      return localforage.getItem(key, value => callback(parseValue(value)));
    }
  }

  set(key, value, callback) {
    return localforage.setItem(key, value, callback);
  }

  remove(key, callback) {
    return localforage.removeItem(key, callback);
  }

  get types() {
    return types;
  }
}
