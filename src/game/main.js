function SceneMain (name) {
  // Extends this from Game.Scene.
  Game.Scene.call(this, name);

  this.keys = [];

  this.init();
}

// Javascript shit to extend another "class"...
SceneMain.prototype = Object.create(Game.Scene.prototype);
SceneMain.prototype.constructor = SceneMain;

/**
* @public {void} init - Initialize the scene.
**/
SceneMain.prototype.init = function () {
  console.log('SceneMain extends Scene');
  this.jumping = false;
  this.blocks = [];
  this.maxBlocks = 50;

  // On keydown, set the key to true (pressed).
  document.addEventListener('keydown', function (e) {
    if (this.keys[e.keyCode]) return;
    this.keys[e.keyCode] = true;
  }.bind(this));

  // On keyup, set the key to false (not pressed).
  document.addEventListener('keyup', function (e) {
    if (!this.keys[e.keyCode]) return;
    this.keys[e.keyCode] = false;
  }.bind(this));

  // Let's init our world.
  this.addWorld();

  // Let's add some more physic blocks.
  this.populate(this.maxBlocks);

  // Let's draw a ground, we don't want blocks to fall forever.
  this.ground = new Game.Sprite(100, 500, 600, 30, null, {
    physics: true,
    static: true,
    borderColor: 'red',
    shape: Game.Shape.RECTANGLE
  });

  // Now we add a player sprite, that'll be able to move and jump!
  this.player = new Game.Sprite(400, 100, 30, 30, 'physic', {
    name: 'player', // We define a name, for later in collision.
    physics: true,
    shape: Game.Shape.RECTANGLE,
    bgColor: 'lime',
  });

  // Finally, add the blocks to both the scene and the physical world.
  this.addChild(this.ground);
  this.addChild(this.player);
  this.world.addChild(this.ground);
  this.world.addChild(this.player);
};

/**
* @public populate - Add some childs to the scene, for demo only.
**/
SceneMain.prototype.populate = function (count) {
  for (var i = 0; i < count; i++) {
    var x = 100 + Math.floor(Math.random() * 600);
    var y = 50  + Math.floor(Math.random() * 400);
    var width = Math.floor(Math.random() * 100);
    var height = Math.floor(Math.random() * 100);

    var shape = Game.Shape.RECTANGLE;
    this.blocks.push(new Game.Sprite(x, y, width, height, null, {
      type: 'block',
      physics: true,
      shape: shape,
      borderColor: 'lime'
    }));

    this.addChild(this.blocks[i]);
    this.world.addChild(this.blocks[i]);
  }
};

SceneMain.prototype.collide = function (dir, shape1, shape2) {
  if (dir == Game.Physics.CollisionDirection.BOTTOM) {
    shape1.velocity.y = 0;
    shape2.velocity.y = 0;

    if (shape1.name == 'player') {
      this.jumping = false;
    }
  }
  return true;
}

SceneMain.prototype.keyboard = function (delta) {
  if (this.keys[38] || this.keys[32] || this.keys[87] || this.keys[90]) {
    if (this.jumping == false) {
      this.jumping = true;
      this.player.velocity.y -= 10;
    }
  }
  if (this.keys[39] || this.keys[68]) {
    this.player.velocity.x += 10;
    this.player.rotation += 200 / delta;
  }
  if (this.keys[37] || this.keys[65] || this.keys[81]) {
    this.player.velocity.x -= 10;
    this.player.rotation -= 200 / delta;
  }
};

/**
* @public {void} update - The scene update method.
* @param {double} - The scene delta time.
**/
SceneMain.prototype.update = function (delta) {
  this.keyboard(delta);
  
  if (this.player.isOffscreen()) {
    this.player.velocity = new Game.Vector(0, 0);
    this.player.rotation = 0;
    this.player.position.copy(this.player.base.position);
    console.log('Base', this.player.base.position, 'Current', this.player.position);
  }
  
  for (var i = 0; i < this.blocks.length; i++) {
    if (this.blocks[i].isOffscreen()) {
      this.blocks[i].removeFromWorld();
      this.blocks[i].remove();
      this.blocks.splice(i, 1);
    }
  }
};

