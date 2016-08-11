function SceneMain (name) {
  // Extends this from Game.Scene.
  Game.Scene.call(this, name);
  
  this.keys = [];
  
  this.init();
}

// Javascript shit to extend...
SceneMain.prototype = Object.create(Game.Scene.prototype);
SceneMain.prototype.constructor = SceneMain;

/**
* @public {void} init - Initialize the scene.
**/
SceneMain.prototype.init = function () {
  console.log('SceneMain extends Scene');
  
  // Ugly, just for the demo.
  document.addEventListener('keydown', function (e) { this.keys[e.keyCode] = true; }.bind(this));
  document.addEventListener('keyup', function (e) { this.keys[e.keyCode] = false; }.bind(this));
  
  // Let's init our world.
  this.addWorld();
  
  this.populate();
};

/**
* @public populate - Add some childs to the scene, for demo only.
**/
SceneMain.prototype.populate = function () {
  this.block = new Game.Sprite(50, 50, 100, 100, 'player-face', {
    canGoOffscreen: true,
    physics: true,
    gravityAffected: false
  });
  this.littleBlock = new Game.Sprite(100, 200, 50, 50, 'player-duck', {
    alpha: .3,
    bgColor: 'red',
    rotation: 25,
    canGoOffscreen: true,
    shape: Game.Shape.CIRCLE
  });
  this.diagBlock = new Game.Sprite(200, 200, 30, 30, 'player-lulz', { canGoOffscreen: true });
  
  this.physicBlock = new Game.Sprite(400, 100, 30, 30, null, {
    physics: true,
    shape: Game.Shape.RECTANGLE,
    bgColor: 'lime'
  });
  this.physicBlock2 = new Game.Sprite(250, 475, 30, 30, null, {
    physics: true,
    shape: Game.Shape.RECTANGLE,
    borderColor: 'blue'
  });
  this.staticBlock = new Game.Sprite(200, 500, 400, 30, null, {
    physics: true,
    static: true,
    borderColor: 'red',
  });
  
  this.addChild(this.block);
  this.addChild(this.littleBlock);
  this.addChild(this.diagBlock);
  this.addChild(this.staticBlock);
  this.addChild(this.physicBlock);
  this.addChild(this.physicBlock2);
  
  this.world.addChild(this.physicBlock);
  this.world.addChild(this.physicBlock2);
  this.world.addChild(this.staticBlock);
  this.world.addChild(this.block);
};

SceneMain.prototype.collide = function (dir, shape1, shape2) {
  //shape1.velocity.y = 0;
  return true;
}

/**
* @public {void} update - The scene update method.
* @param {double} - The scene delta time.
**/
SceneMain.prototype.update = function (delta) {
  if (this.keys[38] || this.keys[32] || this.keys[87] || this.keys[90]) {
    this.physicBlock.velocity.y -= 1;
    this.physicBlock.rotation = 0;
  }
  if (this.keys[39] || this.keys[68]) {
    this.physicBlock.velocity.x += 10;
    this.physicBlock.rotation += 200 / delta;
  }
  if (this.keys[37] || this.keys[65] || this.keys[81]) {
    this.physicBlock.velocity.x -= 10;
    this.physicBlock.rotation -= 200 / delta;
  }

  if (this.physicBlock.isOffscreen()) {
    this.physicBlock.velocity = new Game.Vector(0, 0);
    this.physicBlock.rotation = 0;
    this.physicBlock.position.x = 400;
    this.physicBlock.position.y = 100;
  }

  // If our first block goes offscreen, reset it's position.
  if (this.block.isOffscreen()) {
    this.block.position.x = 50;
    this.block.position.y = 50;
  }
  
  // If our second block goes offscreen, reset it's position.
  if (this.littleBlock.isOffscreen()) {
    this.littleBlock.position.x = 100;
    this.littleBlock.position.y = 200;
  }
  
  // Again for the third one.
  if (this.diagBlock.isOffscreen()) {
    this.diagBlock.position.x = 200;
    this.diagBlock.position.y = 200;
  }
  
  // Let's do some blocks movements/rotations.
  this.block.rotation += 90 / delta;
  this.block.position.x += 100 / delta;
  
  this.littleBlock.rotation -= 45 / delta;
  this.littleBlock.position.y += 10 / delta;
  
  this.diagBlock.rotation -= 25 / delta;
  this.diagBlock.position.x += 20 / delta;
  this.diagBlock.position.y += 10 / delta;
}

