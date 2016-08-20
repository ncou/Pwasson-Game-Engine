/**
* @class Engine - Pwasson engine!
*
* @property {HTMLCanvasElement} canvas - The game canvas.
**/
function Engine () {
  this.canvas = null;

  this._rootPath = 'src';
  this._engineScripts = [
    'game/config.js',
    'core/vector.js',
    'core/shape.js',
    'core/sprite.js',
    'core/physics.js',
    'core/physics/world.js',
    'core/physics/collisionsolver.js',
    'core/scene.js',
    'core/ui.js',
    'game/main.js'
  ];
  this._textures = {};

  // Let's load our engine scripts.
  this._loadScripts(this._engineScripts, this._init.bind(this));
}

/**
* @private {void} _init - Init the game engine.
**/
Engine.prototype._init = function () {
  // Now that everything is loaded, we can create our canvas element.
  var gameWrapper = (document.querySelector(Game.Config.canvas.wrapper) || document.querySelector('body'));

  this.canvas = document.createElement('canvas');
  this.canvas.width = Game.Config.canvas.width;
  this.canvas.height = Game.Config.canvas.height;
  this.canvas.id = (Game.Config.canvas.id || 'pwasson-engine-canvas');
  this.canvas.style.background = (Game.Config.canvas.bgColor || 'red');
  Game.context = this.canvas.getContext('2d');
  gameWrapper.appendChild(this.canvas);

  var canvasDescriptor = 
    gameWrapper.localName + ((gameWrapper.id.length > 0) ? '#' + gameWrapper.id : '') + ' ' + 
    this.canvas.localName + '#' + this.canvas.id;

  console.log('~ Pwasson Engine started (' + canvasDescriptor + ') ~');

  this.setScene(new SceneMain('Main'));
};

/**
* @private {void} _loadScripts - Load JS file from an array.
* @param {Array} scripts - The scripts array. rootPath is added automagically.
**/
Engine.prototype._loadScripts = function (scripts, callback) {
  var scriptsCount = scripts.length,
      scriptsLoaded = 0;

  var elements = {};

  for (var i = 0; i < scripts.length; i++) {
    var path = [this._rootPath, scripts[i]].join('/');

    elements[path] = document.createElement('script');
    elements[path].path = path;
    elements[path].onload = function () {
      console.log('Loaded', this.path, '(' + (scriptsLoaded + 1) + '/' + scriptsCount + ')');
      if (scriptsLoaded + 1 == scriptsCount) {
        callback();
        return;
      }
      scriptsLoaded += 1;
    };

    elements[path].async = false;
    elements[path].src = path;
    elements[path].type = 'text/javascript';

    document.body.appendChild(elements[path]);
  }
};

/**
* @public {Texture|bool} getTexture - Returns a texture if it exists, false if not.
* @param {string} textureName
**/
Engine.prototype.getTexture = function (textureName) {
  /*if (this._textures[textureName] !== undefined) {
    return this._textures[textureName];
  }
  return false;*/
  return textureName;
};

/**
* @public {void} setScene - Set scene to a new one.
* @param {Scene} scene - The scene object.
**/
Engine.prototype.setScene = function (scene) {
  if (typeof scene !== 'object') return;
  if (scene._className != 'Scene') return;

  this.scene = scene;
};

// If no config file has been defined.
if (Game === undefined) {
  var Game = {};
  Game.Config = {
    game: {
      name: 'Game powered by Pwasson Engine',
      version: '0.0.0'
    },
    canvas: {
      width: 800,
      height: 400
    }
  };
};


/**
* @public {Object} merge - Merge objects.
* @param {Object} to
* @param {Object} from
**/
Game.merge = function (to, from) {
  for (var key in from) {
    var ext = from[key];
    if (typeof ext !== 'object') {
      to[key] = ext;
    } else {
      if (!to[key] || typeof to[key] !== 'object') {
        to[key] = (ext instanceof Array) ? [] : {};
      }
      this.merge(to[key], ext);
    }
  }
  return to;
};

// Export the current Engine as Game.Engine.
Game.Engine = new Engine();

