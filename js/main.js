var AttackOfTheViciousFrenchMartinis = AttackOfTheViciousFrenchMartinis || {};

AttackOfTheViciousFrenchMartinis.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-demo');

AttackOfTheViciousFrenchMartinis.game.state.add('Boot', AttackOfTheViciousFrenchMartinis.Boot);
AttackOfTheViciousFrenchMartinis.game.state.add('Preload', AttackOfTheViciousFrenchMartinis.Preload);
AttackOfTheViciousFrenchMartinis.game.state.add('MainMenu', AttackOfTheViciousFrenchMartinis.MainMenu);
AttackOfTheViciousFrenchMartinis.game.state.add('Game', AttackOfTheViciousFrenchMartinis.Game);

AttackOfTheViciousFrenchMartinis.game.state.start('Boot');