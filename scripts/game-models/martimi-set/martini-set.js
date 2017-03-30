class MartiniSet extends Phaser.Group {
  constructor(game, martinis, minimumDelay, maximumDelay) {
    super(game);
    this._isGameAvailable = true;
    this._minimumDelay = minimumDelay;
    this._maximumDelay = maximumDelay;
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.addMultiple(martinis);
    this.setAll('exists', false);
    this.game.add.existing(this);
  }

  stop() {
    this._isGameAvailable = false;
    this.game.time.events.remove(this._launchTimer);
  }

}