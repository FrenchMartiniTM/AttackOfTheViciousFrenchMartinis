class WhiteMartini extends Martini {
  reset(startingXPosition, startingYPosition, initialSpeed) {
    super.reset(startingXPosition, startingYPosition);
    this.body.velocity.x = 0;
    this.body.velocity.y = initialSpeed;
    console.log("test");
    
  }
}