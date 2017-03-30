class WhiteMartiniSet extends MartiniSet {
  launch() {
    let currentMartini = this.getFirstExists(false);
    if (this._isGameAvailable && currentMartini) {
      currentMartini.reset(this.game.rnd.integerInRange(+100, this.game.width - 100), 0, 30);
    }

    this._launchTimer = this.game.time.events.add(this.game.rnd.integerInRange(this._minimumDelay, this._maximumDelay), this.launch());
  }
}