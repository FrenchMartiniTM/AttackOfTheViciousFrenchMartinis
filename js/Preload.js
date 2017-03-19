var AttackOfTheViciousFrenchMartinis = AttackOfTheViciousFrenchMartinis || {};

//loading the game assets
AttackOfTheViciousFrenchMartinis.Preload = function(){};

AttackOfTheViciousFrenchMartinis.Preload.prototype = {
  preload: preload,
  create: create,
};

function preload() {
  //show loading screen
  this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  this.splash.anchor.setTo(0.5);
  this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
  this.preloadBar.anchor.setTo(0.5);
  this.load.setPreloadSprite(this.preloadBar);

  //load game assets
  this.load.image('menu-background', 'assets/images/menu-background.png');
  this.load.image('bar-background', 'assets/images/bar.png');
  this.load.image('bartender', 'assets/images/Bartender_80_88_invert.png');
  this.load.image('bullet', 'assets/images/green_olive_15_19.png');
  this.load.image('enemy-green', 'assets/images/glass_80_115_rotated.png');
  this.load.spritesheet('explosion', 'assets/images/explode.png', 128, 128);
}

function create() {
  this.game.time.events.add(Phaser.Timer.SECOND * 4, create, this);
  this.state.start('MainMenu');
}

function render() {
    this.game.debug.text("Loading: " + this.game.time.events.duration / (Phaser.Timer.SECOND * 4) + "%", 32, 32);
}