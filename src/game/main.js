function SceneMain (name) {
  this.name = name;

  // Extends this from Game.Scene.
  Game.Scene.call(this, name);

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
  this.populate();
};

/**
* @public populate - Add some childs to the scene, for demo only.
**/
SceneMain.prototype.populate = function () {
  this.block = new Game.Sprite(50, 50, 100, 100, 'player-face', { canGoOffscreen: true });
  this.littleBlock= new Game.Sprite(100, 200, 60, 60, 'player-duck', {
    alpha: .3,
    bgColor: 'red',
    rotation: 25,
    canGoOffscreen: true
  });
  this.diagBlock = new Game.Sprite(200, 200, 30, 30, 'player-lulz', { canGoOffscreen: true });
  
  this.addChild(this.block);
  this.addChild(this.littleBlock);
  this.addChild(this.diagBlock);
};

/**
* @public {void} update - The scene update method.
* @param {double} - The scene delta time.
**/
SceneMain.prototype.update = function (delta) {
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
  this.block.rotation += 45 / delta;
  this.block.position.x += 40 / delta;
  
  this.littleBlock.rotation -= 45 / delta;
  this.littleBlock.position.y += 10 / delta;
  
  this.diagBlock.rotation -= 25 / delta;
  this.diagBlock.position.x += 20 / delta;
  this.diagBlock.position.y += 10 / delta;
}

