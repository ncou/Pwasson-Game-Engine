/**
* @class Text - Defines a basic text object.
* @param {String} text - Do i need to explain that?
* @param {Number} x - The text position in X.
* @param {Number} y - The text position in Y.
* @param {Number} maxWidth - The text max width, used to wrap.
* @param {Object} properties - The text properties.
**/
function Text (text, x, y, maxWidth, properties) {
  this.anchor = new Game.Vector(.5, .5);
  this.text = text;
  this.position = new Game.Vector(x, y);
  this.maxWidth = maxWidth;
  this.borderSize = 0;
  this.fontSize = 14;
  this.fontColor = 'black';
  this.fontStyle = '';
  this.fontFamily = 'sans-serif';
  Game.merge(this, properties);
  
  Game.Sprite.call(this, this.position.x, this.position.y, this.maxWidth, this.fontSize, properties);
  
  this._init();
}

// Javascript shit to extend another "class"...
Text.prototype = Object.create(Game.Sprite.prototype);
Text.prototype.constructor = Text;

/**
* @private {void} _init - Initialize the Text.
**/
Text.prototype._init = function () {
  this.draw(0);
};

/**
* @public {void} draw - Draw the text using options in `this`.
* @param {double} delta - The scene delta time. Can be 0.
**/
Text.prototype.draw = function (delta) {
  Game.context.save();
    Game.context.globalAlpha = this.alpha;

    Game.context.beginPath();
      Game.context.translate(
        (this.position.x + (this.size.x * this.anchor.x)),
        (this.position.y + (this.size.y * this.anchor.y))
      );
      
      Game.context.scale(this.scale.x, this.scale.y);
      Game.context.rotate(((this.rotation) % 360) * Math.PI / 180);

      // Let's reset the transformations. Uglyness but...
      Game.context.translate(
        -(this.position.x + (this.size.x * this.anchor.x)),
        -(this.position.y + (this.size.y * this.anchor.y))
      );
      
      if (this.shadowColor !== null) {
        Game.context.shadowBlur = this.shadowBlur;
        Game.context.shadowColor = this.shadowColor;
        Game.context.shadowOffsetX = this.shadowOffset.x;
        Game.context.shadowOffsetY = this.shadowOffset.y;
      }
      
      Game.context.font = [ this.fontStyle, this.fontSize + 'pt', this.fontFamily ].join(' ');
      
      var txtMeasure = Game.context.measureText(this.text);
      this.size = new Game.Vector(txtMeasure.width, this.fontSize);
      
      if (this.fontColor !== null) {
        Game.context.fillStyle = this.fontColor;
        Game.context.fillText(this.text, this.position.x, this.position.y + this.fontSize, this.maxWidth);
      }
      if (this.borderSize > 0 && this.borderColor !== null) {
        Game.context.strokeStyle = this.borderColor;
        Game.context.lineWidth = this.borderSize;
        Game.context.lineJoin = this.lineJoin;
        Game.context.strokeText(this.text, this.position.x, this.position.y + this.fontSize, this.maxWidth);
      }
    Game.context.closePath();
  Game.context.restore();
};

/**
* @public {void} setText - Set the text.
* @param {String} newText - The new text to set.
**/
Text.prototype.setText = function (newText) {
  this.text = newText;
};

// Export Text as Game.Text.
Game.Text = Text;
