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
  Game.Engine.loader.addImage('player', 'assets/sprites/player.png');
  Game.Engine.loader.addImage('pwasson', 'assets/sprites/pwasson.png');
  Game.Engine.loader.addImage('mice', 'assets/sprites/mice.png');
  Game.Engine.loader.addImage('box', 'assets/sprites/box.png');
  Game.Engine.loader.addImage('tiger', 'assets/scalables/tiger.svg');
};

/**
* @public {void} init - Initialize the scene.
**/
SceneMain.prototype.init = function () {
  this.jumping = false;
  this.blocks = [];
  this.defaultCount = 10;
  this.setAllStatic = false;

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
  
  // FPS indicator.
  var textProps = {
    fontColor: 'black',
    fontSize: 8,
    fontFamily: 'monospace',
    borderSize: 0
  };
  
  this.textFPS = new Game.Text('FPS: 0', 10, 10, null, textProps);
  this.textChilds = new Game.Text('Sprites: 0', 10, 25, null, textProps);
  this.textWorldChilds = new Game.Text('Bodies: 0', 10, 40, null, textProps);
  
  var textHardProps = {
    buttonMode: true,
    fontColor: 'blue',
    onMouseHover: function () { this.fontColor = 'green'; },
    onMouseOut: function () { this.fontColor = 'blue'; },
    onMouseRelease: function () {
      //this.defaultCount = this.defaultCount + 20;
      this.populate(20);
      this._childCountChanged = true;
      this.world._childCountChanged = true;
    }.bind(this)
  };
  Game.merge(textHardProps, textProps);
  this.textHardTest = new Game.Text('+20 objects', 10, 55, null, textHardProps);
  this.textHardTest.position.x = (Game.Config.canvas.width - this.textHardTest.size.x) - 10;
  this.textHardTest.position.y = 10;

  // Let's add some more physic blocks.
  this.populate(this.defaultCount);

  // Let's draw a ground, we don't want blocks to fall forever.
  this.ground = new Game.Sprite(100, 520, 600, 40, {
    physics: true,
    static: true,
    borderColor: '#237f52',
    bgColor: 'rgba(73, 169, 66, 0.5)',
    shape: Game.Shape.RECTANGLE,
    buttonMode: false,
    collisionGroup: 0,
    shadowColor: 'rgba(73, 169, 66, 1)',
  });
  
  // Let's add a physical text, :)
  this.text = new Game.Text('PwassonEngine', 250, 250, null, {
    physics: true,
    draggable: true,
    buttonMode: true,
    fontColor: 'rgba(255, 205, 0, 0.5)',
    fontStyle: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 40,
    borderColor: '#febd17',
    borderSize: 3,
    collisionGroup: 4,
    collideAgainst: [0, 1, 2, 3, 4 ]
  });

  // Now we add a player sprite, that'll be able to move and jump!
  this.player = new Game.Sprite(400, 100, 40, 40, {
    name: 'player', // We define a name, for later in collision.
    bg: 'rgba(255, 205, 0, 0.5)',
    border: '#febd17',
    
    physics: true,
    shape: Game.Shape.RECTANGLE,
    bgColor: this.bg,
    borderColor: this.border,
    borderSize: 2,
    buttonMode: true,
    draggable: true,
    selected: false,
    collisionGroup: 1,
    collideAgainst: [ 0, 1, 3, 4 ],
    texture: 'player',
    onMouseHover: function (pos) {
      // WARN: Here, `this` refer to the player instance.
      this.bgColor = 'rgba(255, 219, 0, 0.8)';
      if (this.texture !== null) {
        this.alpha = .6;
      }
    },
    onMouseOut: function () {
      // WARN: Here, `this` refer to the player instance.
      this.borderColor = this.border;
      this.bgColor = this.bg;
      if (this.texture !== null) {
        this.alpha = 1;
      }
    }
  });
  //this.player.setHitboxSize(2, 10);

  // Finally, add the blocks to both the scene and the physical world.
  this.addChild(this.ground);
  //this.addChild(this.text);
  this.addChild(this.player);
  
  this.addChild(this.textFPS, true);
  this.addChild(this.textChilds, true);
  this.addChild(this.textWorldChilds, true);
  this.addChild(this.textHardTest, true);
  
  this.world.addChild(this.ground);
  //this.world.addChild(this.text);
  this.world.addChild(this.player);
}

/**
* @public populate - Add some childs to the scene, for demo only.
* @param {int} count - The number of childs to add.
**/
SceneMain.prototype.populate = function (count) {
  for (var i = 0; i < count; i++) { 
    var x = 100 + Game.random(500);
    var y = 20 + Game.random(500);
    var width = Game.random(60, 20);
    var height = Game.random(60, 20);
    
    var color = (Math.random() < 0.4) ? '#33cc99' : '#0066b2';
    var bg = (color == '#33cc99') ? 'rgba(45, 190, 96, 0.6)' : 'rgba(0, 174, 239, 0.5)';
    var group = (color == '#33cc99') ? 2 : 3;
    var against = (color == '#33cc99') ? [ 0, 2, 3, 4 ] : [ 0, 1, 2, 3, 4 ];

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
      },
      onMouseRelease: function () {
        this.borderColor = this.color;
      },
      onMouseHover: function () {
        //this.alpha = .5;
        this.bgColor = 'rgba(13, 105, 175, 0.5)';
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
      this.player.velocity.y -= 8;
    }
  }

  // Right: D, RIGHT.
  if (this.keys[39] || this.keys[68]) {
    this.player.velocity.x += 8;
    this.player.scale.x = 1;
    if (this.jumping) {
      this.player.rotation -= 200 / delta;
    }
  }

  // Left: A, Q, LEFT.
  if (this.keys[37] || this.keys[65] || this.keys[81]) {
    this.player.velocity.x -= 8;
    this.player.scale.x = -1;
    
    if (this.jumping) {
      this.player.rotation -= 200 / delta;
    }
  }
};

/**
* @public {void} update - The scene update method.
* @param {double} - The scene delta time.
**/
SceneMain.prototype.update = function (delta) {
  this.keyboard(delta);

  // FPS counter related:
  this.textFPS.setText('FPS: ' + this.fps);
  if (this.fps < (this.maxFPS / 2)) {
    this.textFPS.fontColor = 'red';
  } else {
    this.textFPS.fontColor = 'green';
  }

  if (this.player.isOffscreen()) {
    this.player.reset();
  }

  for(var i = 0; i < this.childrens.length; i++) {
    if (this.childrens[i] === undefined) continue;
    if (this.childrens[i].isOffscreen() === false) {
      continue;
    } else {
      this.childrens[i].removeFromWorld();
      this.childrens[i].remove();
    }
  }
  
  // Childs counter related:
  this.textChilds.setText('Sprites: ' + this.getChildCount());
  this.textWorldChilds.setText('Bodies: ' + this.world.getChildCount());
};

