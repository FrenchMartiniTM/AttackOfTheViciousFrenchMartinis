class RedMartiniSet extends MartiniSet {
  constructor(game, martinis, minimumDelay, maximumDelay, numberMartiniInWave, verticalSpacing) {
    super(game, martinis, minimumDelay, maximumDelay);
    this._numberMartiniInWave = numberMartiniInWave;
    this._verticalSpacing = verticalSpacing;
  }
  launch() {
    let martiniCount = 0,
      currentMartini = this.getFirstExists(false),
      startingPositionX = this.game.rnd.integerInRange(+100, this.game.width - 100);

    while (this._isGameAvailable && currentMartini && martiniCount < this._numberMartiniInWave) {
      currentMartini.reset(startingPositionX, -this._verticalSpacing * martiniCount);

      currentMartini = this.getFirstExists(false);
      martiniCount += 1;
    }
    this._launchTimer = this.game.time.events.add(this.game.rnd.integerInRange(this._minimumDelay, this._maximumDelay), this.launch);
  }
}