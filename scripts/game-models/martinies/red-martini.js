class RedMartini extends Martini {
  constructor(game, image, frequency, spread){
    super(game, image);
    this._frequency = frequency;
    this._spread = spread;
    console.log("red");
    
  }

  reset(startingXPosition, startingYPosition, initialSpeed){
    super.reset(startingXPosition, startingYPosition)
    this.startingX = startingXPosition;
    this.body.velocity.y = initialSpeed;
  }

  update() {
    this.body.x = this.startingX + Math.sin((this.y) / this._frequency) * this._spread;
    let bank = Math.cos((this.y + 60) / this._frequency);
    this.scale.x = 0.5 - Math.abs(bank) / 8;
    this.angle = 0 - bank * 2;
  }
}