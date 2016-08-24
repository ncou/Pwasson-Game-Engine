// Issue a warning if trying to preview an exported project on disk.
(function(){
  // Check for running exported on file protocol
  if (window.location.protocol.substr(0, 4) === "file") {
    alert("Warning: When running on the file:/// protocol, browsers block many features from working for security reasons.\nYou may want to run a local web server or upload your game on an HTTP server to have everything working nice.\n\nIf you don't know what this means, simply google for `python pip http-server` and run `http-server` on this directory.");
  }
})();

/**
* @public {Function} requestAnimateFrame - Shim for having requestAnimationFrame to work on every browser.
* @fallback Fallback to setInterval on browsers that doesn't supports requestAnimationFrame.
**/
window.requestAnimateFrame = (function(callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

/**
* @class Engine - Pwasson engine!
*
* @property {HTMLCanvasElement} canvas - The game canvas.
* @property {Scene} scene - The current game scene.
* @property (readOnly) {Vector} mouse - The actual mouse position. Can be used in loops.
**/
function Engine () {
  this._textures = {};
  this._rootPath = 'src';
  this._engineScripts = [
    'game/config.js',
    'core/vector.js',
    'core/assetsloader.js',
    'core/container.js',
    'core/shape.js',
    'core/sprite.js',
    'core/physics.js',
    'core/physics/world.js',
    'core/physics/collisionsolver.js',
    'core/scene.js',
    'core/ui.js',
    'game/main.js'
  ];

  this.canvas = null;
  this.scene  = null;
  this.mouse = { x: 0, y: 0 };

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
  this.loader = new Game.AssetsLoader();
  
  this.setScene(new SceneMain('Main'));
  this._initEvents();
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
* @public {Vector} getMousePos - Get the mouse position from an event taking in consideration the canvas position.
* @param {Event} event - The click event.
**/
Engine.prototype.getMousePos = function (event) {
  var rect = this.canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

/**
* @private {void} _initEvents - Initialize the canvas events and dispatch them.
**/
Engine.prototype._initEvents = function () {
  if (this.scene === null || this.scene === undefined) throw new Error('Scene is not defined. Set the scene using Game.Engine.setScene()');

  // Mouse click.
  this.canvas.addEventListener('mouseclick', function (e) {
    this.scene.onMouseClick(e.buttons, this.getMousePos(e));
  }.bind(this), false);

  // Touch start.
  this.canvas.addEventListener('touchstart', function (e) {
    this.scene.onMouseDown(e.buttons, this.getMousePos(e));
  }.bind(this), false);
  
  // Mouse down.
  this.canvas.addEventListener('mousedown', function (e) {
    this.scene.onMouseDown(e.buttons, this.getMousePos(e));
  }.bind(this), false);

  // Touch stop.
  this.canvas.addEventListener('touchend', function (e) {
    this.scene.onMouseRelease(e.buttons, this.getMousePos(e));
  }.bind(this), false);
  
  // Mouse up.
  this.canvas.addEventListener('mouseup', function (e) {
    this.scene.onMouseRelease(e.buttons, this.getMousePos(e));
  }.bind(this), false);

  // Touch move.
  this.canvas.addEventListener('touchmove', function (e) {
    this.mouse = this.getMousePos(e);
    this.scene.onMouseHover(this.mouse);
  }.bind(this), false);
  
  // Mouse move.
  this.canvas.addEventListener('mousemove', function (e) {
    this.mouse = this.getMousePos(e);
    this.scene.onMouseHover(this.mouse);
  }.bind(this), false);

  // Mouse out.
  this.canvas.addEventListener('mouseout', function (e) {
    this.mouse = this.getMousePos(e);
    this.scene.onMouseOut(e.buttons, this.mouse);
  }.bind(this), false);
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
  if (typeof scene !== 'object') throw new Error('Scene "' + scene + '" is not an Object.');
  if (scene._className != 'Scene') throw new Error('Scene "' + scene + '" is not a Scene.');

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
* @public {void} setCursor - Set the cursor style.
* @param {String} cursor - The cursor style.
**/
Game.setCursor = function (cursor) {
  if (this.lastCursor == cursor) return; // Avoid updating dom uselessly.
  Game.Engine.canvas.style.cursor = cursor;
  this.lastCursor = cursor;
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

/**
* @public {int} random - Randomize a number.
* @param {int} max - The maximum generated number.
* @param {int} min - The minimum generated number.
**/
Game.random = function (max, min) {
  var vMax = max || 100000,
      vMin = min || 0;

  return Math.floor(Math.random() * (vMax - vMin + 1) + vMin);
};

// Export the current Engine as Game.Engine.
Game.Engine = new Engine();

