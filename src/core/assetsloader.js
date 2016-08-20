/**
* @class AssetsLoader - This class handles resource loading, and ensure that everything is loaded before being drawn.
**/
function AssetsLoader () {
  this.images = {};
  this.sounds = {};
  this.jsonFiles = {};
}

/**
* @public {void} addImage - Add an image to the loader.
* @param {String} key - The resource key, used to access it once loaded.
* @param {String} path - The path to that resource.
**/
AssetsLoader.prototype.addImage (key, path) {
  this.images[key] = new Image();
  this.images[key].path = path;
  this.images[key].loaded = false;
  this.images[key].onload = function () { this.images[key].loaded = true; };
  this.images[key].src = path;
};

/**
* @public {void} addSound - Add a sound file to the loader.
* @param {String} key - The resource key, used to access it once loaded.
* @param {String} path - The path to that resource.
**/
AssetsLoader.prototype.addSound (key, path) {
  this.sounds[key] = new Image();
  this.sounds[key].path = path;
  this.sounds[key].loaded = false;
  this.sounds[key].onload = function () { this.images[key].loaded = true; };
  this.sounds[key].src = path;
};

/**
* @public {void} addJson - Add a JSON file to the loader.
* @param {String} key - The resource key, used to access it once loaded.
* @param {String} path - The path to that resource.
**/
AssetsLoader.prototype.addJson (key, path) {
  this.jsonFiles[key] = {
    path: path,
    loaded: false
  };
};

/**
* @public {Image|bool} getTexture - Get a loaded image.
* @param {String} key - The image key.
* @return Returns the Image if found, false if not.
**/
AssetsLoader.prototype.getTexture = function (key) {
  return (this.images[key] != undefined) ? this.images[key] : false;
};

/**
* @public {Sound|bool} getSound - Get a loaded sound.
* @param {String} key - The sound key.
* @return Returns the Sound if found, false if not.
**/
AssetsLoader.prototype.getSound = function (key) {
  return (this.sounds[key] != undefined) ? this.sounds[key] : false;
};

/**
* @public {Object|bool} getJSON - Get a loaded JSON file.
* @param {String} key - The JSON key.
* @return Returns the JSON Object if found, false if not.
**/
AssetsLoader.prototype.getJSON = function (key) {
  return (this.jsonFiles[key] != undefined) ? this.jsonFiles[key] : false;
};

