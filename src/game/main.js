/**
* @class SceneMain
* @extends Scene
* @param {String} name - The scene name, used for debug.
**/
function SceneMain (name) {
  // Extends this from Game.Scene.
  Game.Scene.call(this, name);

  this.keys = [];

  this.loadAssets();
  this.init();
}

// Javascript shit to extend another "class"...
SceneMain.prototype = Object.create(Game.Scene.prototype);
SceneMain.prototype.constructor = SceneMain;

/**
* @public {void} loadAssets - Load the scene assets.
**/
SceneMain.prototype.loadAssets = function () {
  Game.Engine.loader.addImage('pwasson', 'assets/pwasson.png');
};

/**
* @public {void} init - Initialize the scene.
**/
SceneMain.prototype.init = function () {
  this.jumping = false;
  this.blocks = [];
  this.maxBlocks = 25;

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
  this.ground = new Game.Sprite(100, 500, 600, 30, {
    physics: true,
    static: true,
    borderColor: '#237f52',
    bgColor: '#49a942',
    shape: Game.Shape.RECTANGLE,
    buttonMode: true,
    collisionGroup: 0
  });

  // Now we add a player sprite, that'll be able to move and jump!
  this.player = new Game.Sprite(400, 100, 60, 37, {
    name: 'player', // We define a name, for later in collision.
    physics: true,
    shape: Game.Shape.RECTANGLE,
    bgColor: 'skyblue',
    borderColor: 'blue',
    borderSize: 2,
    buttonMode: true,
    draggable: true,
    selected: false,
    collisionGroup: 1,
    collideAgainst: [ 0, 1, 3 ],
    texture: 'pwasson',
    onMouseHover: function (pos) {
      // WARN: Here, `this` refer to the player instance.
      this.borderSize = 2;
      this.borderColor = 'black';
      this.bgColor = 'yellow';
      this.alpha = .6;
    },
    onMouseOut: function () {
      // WARN: Here, `this` refer to the player instance.
      this.borderSize = 2;
      this.borderColor = 'blue';
      this.bgColor = 'skyblue';
      this.alpha = 1;
    }
  });

  // Finally, add the blocks to both the scene and the physical world.
  this.addChild(this.ground);
  this.addChild(this.player);
  this.world.addChild(this.ground);
  this.world.addChild(this.player);
}

/**
* @public populate - Add some childs to the scene, for demo only.
* @param {int} count - The number of childs to add.
**/
SceneMain.prototype.populate = function (count, even) {
  for (var i = 0; i < count; i++) {
    var x = 150 + Game.random(450);
    var y = 50 + Game.random(400);
    var width = Game.random(100, 25);
    var height = Game.random(100, 25);
    var color = (Math.random() > 0.5) ? '#689550' : '#0066b2';
    var bg = (color == '#689550') ? '#8ba753' : '#00aeef';
    var group = (color == '#689550') ? 2 : 3;
    var against = (color == '#689550') ? [ 0, 2 ] : [ 0, 1, 2, 3 ];

    var shape = Game.Shape.RECTANGLE;
    this.blocks.push(new Game.Sprite(x, y, width, height, {
      type: 'block',
      physics: true,
      shape: shape,
      bg: bg,
      color: color,
      bgColor: bg,
      borderColor: color,
      buttonMode: true,
      draggable: true,
      collisionGroup: group,
      collideAgainst: against,
      onMouseDown: function (button, position) { // Yes, we can use events here :p
        if (button == 4) {
          this.removeFromWorld();
          this.remove();
          return;
        }
        this.borderColor = 'red';
      },
      onMouseRelease: function () {
        this.borderColor = this.color;
      },
      onMouseHover: function () {
        this.alpha = .5;
        this.bgColor = this.color;
      },
      onMouseOut: function () {
        this.alpha = 1;
        this.bgColor = this.bg;
      }
    }));

    this.addChild(this.blocks[i]);
    this.world.addChild(this.blocks[i]);
  }
};

/**
* @public {bool} collide - Collide method, called whenever two shapes collides.
* @param {Physic.CollisionDirection} dir - The collision direction.
* @param {Sprite} shape1 - The shape that triggered the collision.
* @param {Sprite} shape2 - The shape that is collided against.
* @return Return true to make both shape to collide, false to not stop the collision.
**/
SceneMain.prototype.collide = function (dir, shape1, shape2) {
  if (dir == Game.Physics.CollisionDirection.BOTTOM) {
    shape1.velocity.y = 0;
    shape2.velocity.y = 0;

    if (shape1.name == 'player') {
      this.jumping = false;
      shape1.rotation = 0;
    }
  }
  return true;
}

/**
* @public {void} keyboard - Method to handle the keyboard events.
* @param {double} delta - The scene delta time.
**/
SceneMain.prototype.keyboard = function (delta) {
  // Jump: W, Z, UP, SPACE.
  if (this.keys[38] || this.keys[32] || this.keys[87] || this.keys[90]) {
    if (this.jumping == false) {
      this.jumping = true;
      this.player.velocity.y -= 10;
    }
  }

  // Right: D, RIGHT.
  if (this.keys[39] || this.keys[68]) {
    this.player.velocity.x += 10;
    this.player.scale.x = 1;
    this.player.rotation -= 200 / delta;
  }

  // Left: A, Q, LEFT.
  if (this.keys[37] || this.keys[65] || this.keys[81]) {
    this.player.velocity.x -= 10;
    this.player.scale.x = -1;
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
    this.player.reset();
    /*this.player.velocity = new Game.Vector(0, 0);
    this.player.rotation = 0;
    this.player.position.copy(this.player.base.position);*/
  }
  
  /**
  * TODO: Debug the remove() method.
  **/
  /*for (var i = 0; i < this.blocks.length; i++) {
    if (this.blocks[i].isOffscreen()) {
      this.blocks[i].removeFromWorld();
      this.blocks[i].remove();
      this.blocks.splice(i, 1);
    }
  }*/
};

