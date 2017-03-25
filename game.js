//function startGame() {//swiched off to test difficulty level
//removeMenu(); //swiched off to test difficulty level

const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer', {
    preload,
    create,
    update,
    render
});

var player,
    playerHead,
    isAlive = true,

    bar,
    barborder,

    cursors,
    scoreText,
    score = 290,
    highscores = [0, 0, 0, 0, 0],


    bullets,
    bulletTimer = 0,

    fireButton,
    whiteExplosions,
    redExplosions,

    whiteMartinis,
    whiteMartiniLaunchTimer,
    whiteMartiniMinimumDelay = 1000,
    whiteMartiniMaximumDelay = 3000,
    whiteMartiniInitialSpeed = 100,

    redMartinis,
    redMartiniLaunchTimer,
    redMartinisAreLaunched = false,
    redMartiniMinimumDelay = 10000,
    redMartiniMaximumDelay = 14000,
    redMartiniInitialSpeed = 50,

    pauseKey,
    pauseImage,

    hearts,
    livesCount = 3,

    gameOverMessage = 'GAME OVER!',
    gameOverText,

    fullScreenButton,
    fullScreenKey,

    weaponLevel = 1,
    factorDifficulty = 1;

function preload() {
    game.load.image('bar', 'assets/images/bar.png');
    game.load.image('player', 'assets/images/Bartender_80_88_invert.png');
    game.load.image('bullet', 'assets/images/green_olive_15_19.png');
    game.load.image('white-martini', 'assets/images/glass_80_115.png');
    game.load.image('red-martini', './assets/images/redmartini.png');
    game.load.spritesheet('white-explosion', 'assets/images/explode.png', 133, 95, 6);
    game.load.spritesheet('red-explosion', 'assets/images/explode1.png', 128, 128, 16);
    game.load.image('barborder', './assets/images/barborder.png');
    game.load.image('playerhead', './assets/images/playerhead.png');
    game.load.image('paused', './assets/images/paused.png');
    game.load.image('heart', './assets/images/heart.png');
    game.load.image('fullscreen', './assets/images/fullscreen.png');
}

function create() {
    //Alligning the game to the center of the window
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.forcePortrait = true;

    //Setting Arcade Physics system for all objects in the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

    bar = game.add.tileSprite(0, 0, 800, 600, 'bar');
    barborder = game.add.sprite(BAR.BORDER_POSITION_X, BAR.BORDER_POSITION_Y, 'barborder');
    game.physics.enable(barborder, Phaser.Physics.ARCADE);
    barborder.body.immovable = true;
    //barborder.alpha = 0; // uncomment if you want the red line to disappear

    gameOverText = game.add.text(game.world.centerX, game.world.centerY, gameOverMessage, { font: '84px Arial', fill: '#fff' });
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.kill();

    scoreText = game.add.text(600, 550, 'score: 0', { fontSize: '32px', fill: '#F00' });

    //Hearts group
    hearts = game.add.group();
    addHearts();

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.events.onKilled.add(endGame);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    player.body.maxVelocity.setTo(PLAYER.MAX_SPEED, PLAYER.MAX_SPEED);

    // Setting the player head. 
    playerHead = game.add.sprite(PLAYER.HEAD.STARTING_POSITION_X, PLAYER.HEAD.STARTING_POSITION_Y, 'playerhead');
    game.physics.enable(playerHead, Phaser.Physics.ARCADE);
    //playerHead.alpha = 0; // uncomment if you want the red line to disappear

    /*//  Add an emitter for the player's trail
     playerTrail = game.add.emitter(player.x, player.y + 10, 400);
     playerTrail.width = 10;
     playerTrail.makeParticles('bullet');
     playerTrail.setXSpeed(30, -30);
     playerTrail.setYSpeed(200, 180);
     playerTrail.setRotation(50, -50);
     playerTrail.setAlpha(1, 0.01, 800);
     playerTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
     playerTrail.start(false, 5000, 10);*/

    //  An explosion pool
    whiteExplosions = game.add.group();
    whiteExplosions.enableBody = true;
    whiteExplosions.physicsBodyType = Phaser.Physics.ARCADE;
    whiteExplosions.createMultiple(30, 'white-explosion');
    whiteExplosions.setAll('anchor.x', 0.5);
    whiteExplosions.setAll('anchor.y', 0.5);
    whiteExplosions.forEach(function(whiteExplosion) {
        whiteExplosion.animations.add('white-explosion');
    });

    redExplosions = game.add.group();
    redExplosions.enableBody = true;
    redExplosions.physicsBodyType = Phaser.Physics.ARCADE;
    redExplosions.createMultiple(30, 'red-explosion');
    redExplosions.setAll('anchor.x', 0.5);
    redExplosions.setAll('anchor.y', 0.5);
    redExplosions.forEach(function(redExplosion) {
        redExplosion.animations.add('red-explosion');
    });

    //  The baddies!
    whiteMartinis = game.add.group();
    whiteMartinis.enableBody = true;
    whiteMartinis.physicsBodyType = Phaser.Physics.ARCADE;
    whiteMartinis.createMultiple(5, 'white-martini'); //TODO: can add factor to number of enemies in dependence to difficutly level
    whiteMartinis.setAll('anchor.x', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
    whiteMartinis.setAll('anchor.y', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
    whiteMartinis.setAll('scale.x', 0.5);
    whiteMartinis.setAll('scale.y', 0.5);
    whiteMartinis.setAll('angle', 0);
    whiteMartinis.forEach(function(enemy) {
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4); //makes the collision more accurate since it can hit lower area
    });

    launchWhiteMartini();

    redMartinis = game.add.group();
    redMartinis.enableBody = true;
    redMartinis.physicsBodyType = Phaser.Physics.ARCADE;
    redMartinis.createMultiple(5, 'red-martini');
    redMartinis.setAll('anchor.x', 0.5);
    redMartinis.setAll('anchor.y', 0.5);
    redMartinis.setAll('scale.x', 0.5);
    redMartinis.setAll('scale.y', 0.5);
    redMartinis.setAll('angle', 0);
    redMartinis.forEach(function(enemy) {
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4); //makes them pretty hard to hit
    });

    pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseKey.onDown.add(togglePause, this);
    pauseImage = game.add.sprite(250, 100, 'paused');
    pauseImage.kill();

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    fullScreenButton = game.add.button(game.width - 32, 0, 'fullscreen', toggleFullScreen, this, null, null, null);
    fullScreenKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
    fullScreenKey.onDown.add(toggleFullScreen, this);
}

function update() {
    //  Single click capture
    player.body.velocity.setTo(0, 0);
    playerHead.body.velocity.setTo(0, 0);

    //player movement
    if (cursors.left.isDown) {
        player.body.velocity.x = -PLAYER.MAX_SPEED;
        playerHead.body.velocity.x = -PLAYER.MAX_SPEED;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = PLAYER.MAX_SPEED;
        playerHead.body.velocity.x = PLAYER.MAX_SPEED;
    }

    if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
        fireBullet();
    }

    //  Stop at screen edges
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        playerHead.x = player.x - 3;
    }
    if (player.x < 50) {
        player.x = 50;
        playerHead.x = player.x - 3;
    }

    //  Check collisions
    game.physics.arcade.overlap(playerHead, whiteMartinis, playerCollide, null, this);
    game.physics.arcade.overlap(whiteMartinis, bullets, hitEnemy, null, this);
    game.physics.arcade.overlap(barborder, whiteMartinis, barCollide, null, this);

    game.physics.arcade.overlap(playerHead, redMartinis, playerCollide, null, this);
    game.physics.arcade.overlap(redMartinis, bullets, hitEnemy, null, this);
    game.physics.arcade.overlap(barborder, redMartinis, barCollide, null, this);

}

function render() {

}

function fireBullet() {
    //Variant I
    //  Grab the first bullet we can from the pool
    /*var bullet = bullets.getFirstExists(false);
 
     if (bullet) {
     bullet.reset(player.x, player.y); //The Reset component allows a Game Object to be reset and repositioned to a new location.
     bullet.body.velocity.y = -500;
     
     //  Make bullet come out of tip of player with right angle
     var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
     bullet.reset(player.x + bulletOffset, player.y);
     bullet.angle = player.angle;
     game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET.SPEED, bullet.body.velocity);
     bullet.body.velocity.x += player.body.velocity.x;*/

    //Variant II
    //  To avoid them being allowed to fire too fast we set a time limit
    switch (weaponLevel) {
        case 1:
            {
                if (game.time.now > bulletTimer) {
                    var bullet = bullets.getFirstExists(false);

                    if (bullet) {
                        bullet.reset(player.x, player.y); //The Reset component allows a Game Object to be reset and repositioned to a new location.
                        bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;

                        bulletTimer = game.time.now + (BULLET.SPACING / factorDifficulty);
                    }
                }
            }
            break;

        case 2:
            {
                if (game.time.now > bulletTimer) {


                    for (var i = 0; i < 3; i++) {
                        var bullet = bullets.getFirstExists(false);
                        if (bullet) {
                            //  Make bullet come out of tip of ship with right angle
                            var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                            bullet.reset(player.x + bulletOffset, player.y);
                            //  "Spread" angle of 1st and 3rd bullets
                            var spreadAngle;
                            if (i === 0) spreadAngle = -20;
                            if (i === 1) spreadAngle = 0;
                            if (i === 2) spreadAngle = 20;
                            bullet.angle = player.angle + spreadAngle;
                            game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET.SPEED, bullet.body.velocity);
                            bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;
                        }
                        bulletTimer = game.time.now + ((BULLET.SPACING + 300) / factorDifficulty);
                    }
                }
            }
            break;

        case 3:
            {
                if (game.time.now > bulletTimer) {

                    for (var i = 0; i < 5; i++) {
                        var bullet = bullets.getFirstExists(false);
                        if (bullet) {
                            //  Make bullet come out of tip of ship with right angle
                            var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                            bullet.reset(player.x + bulletOffset, player.y);
                            //  "Spread" angle of 1st and 3rd bullets
                            var spreadAngle;
                            if (i === 0) spreadAngle = -20;
                            if (i === 1) spreadAngle = 0;
                            if (i === 2) spreadAngle = 20;
                            if (i === 3) spreadAngle = 40;
                            if (i === 4) spreadAngle = -40;
                            bullet.angle = player.angle + spreadAngle;
                            game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET.SPEED, bullet.body.velocity);
                            bullet.body.velocity.y = -BULLET.SPEED * factorDifficulty;
                        }
                        bulletTimer = game.time.now + ((BULLET.SPACING + 300) / factorDifficulty);
                    }
                }
            }
            break;

        default:
            throw new Error("Weapon level not defined.");
    }

}

function playerCollide(playerHead, enemy) {
    hearts.callAll('kill');
    player.kill();
}

function barCollide(bar, enemy) {
    enemy.kill();
    hearts.children.pop().kill();

    livesCount -= 1;
    if (livesCount <= 0) {
        player.kill();
    }
}

function hitEnemy(enemy, bullet) {
    if (enemy.key === 'white-martini') {
        killMartini(enemy, bullet, whiteExplosions, 'white-explosion', EXPLOSION.WHITE_SPEED);
    } else if (enemy.key === 'red-martini') {
        killMartini(enemy, bullet, redExplosions, 'red-explosion', EXPLOSION.RED_SPEED);
    }

    enemy.kill();
    bullet.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;

    setDifficultyLevel();
}

function killMartini(enemy, bullet, explosions, animation, speed) {
    var whiteExplosion = explosions.getFirstExists(false);
    whiteExplosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    whiteExplosion.body.velocity.y = enemy.body.velocity.y;
    whiteExplosion.alpha = 0.7;
    whiteExplosion.play(animation, speed, false, true);
}

function launchWhiteMartini() {
    if (!isAlive) {
        return;
    }

    let enemy = whiteMartinis.getFirstExists(false);

    if (enemy) {
        enemy.reset(game.rnd.integerInRange(+100, game.width - 100), 0); //The Reset component allows a Game Object to be reset 
        //and repositioned to a new location.
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = whiteMartiniInitialSpeed;

        //  Send another enemy soon
        whiteMartiniLaunchTimer = game.time.events.add(game.rnd.integerInRange(whiteMartiniMinimumDelay, whiteMartiniMaximumDelay), launchWhiteMartini);
    }
}

function launchRedMartini() {
    if (!isAlive) {
        return;
    }

    redMartinisAreLaunched = true;

    let startingX = game.rnd.integerInRange(100, game.width - 100),
        spread = 60,
        frequency = 70,
        verticalSpacing = 70,
        numEnemiesInWave = 5,
        bank;

    //  Launch wave
    for (var i = 0; i < numEnemiesInWave; i++) {
        var enemy = redMartinis.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = redMartiniInitialSpeed;

            //  Update function for each enemy
            enemy.update = function() {
                //  Wave movement
                this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

                //  Squish and rotate glass for illusion of "banking"
                bank = Math.cos((this.y + 60) / frequency)
                this.scale.x = 0.5 - Math.abs(bank) / 8;
                this.angle = 0 - bank * 2;

            };
        }
    }

    //  Send another wave soon
    redMartiniLaunchTimer = game.time.events.add(game.rnd.integerInRange(redMartiniMinimumDelay, redMartiniMaximumDelay), launchRedMartini);
}

function addHearts() {
    for (var i = 0; i < livesCount; i += 1) {
        hearts.create(5 + i * 33, 560, 'heart');
    }
}

function togglePause() {
    if (!isAlive) {
        return;
    }

    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    if (game.physics.arcade.isPaused) {
        pauseImage.revive();
    } else {
        pauseImage.kill();
    }
}

function endGame() {
    isAlive = false;
    game.time.events.remove(redMartiniLaunchTimer);
    game.time.events.remove(whiteMartiniLaunchTimer);
    whiteMartinis.callAll('kill');
    redMartinis.callAll('kill');
    addHighscore();
    hearts.children = [];
    gameOverText.revive();
    playerHead.kill();


    spaceRestart = fireButton.onDown.addOnce(restart, this);
}

function restart() {
    isAlive = true;
    gameOverText.kill();
    player.reset(PLAYER.STARTING_POSITION_X, PLAYER.STARTING_POSITION_Y);
    playerHead.reset(PLAYER.HEAD.STARTING_POSITION_X, PLAYER.HEAD.STARTING_POSITION_Y);

    resetStartingGameStats();
    launchWhiteMartini();
}

function toggleFullScreen() {
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    } else {
        game.scale.startFullScreen(true);
    }
}

function resetStartingGameStats() {
    resetScore();
    resetLives();
    resetDifficulty();
}

function resetScore() {
    score = 0;
    scoreText.text = 'Score: 0';
}

function resetLives() {
    livesCount = 3;
    addHearts();
}

function resetDifficulty() {
    factorDifficulty = 1;
    weaponLevel = 1;

    whiteMartiniInitialSpeed = 100;
    whiteMartiniMinimumDelay = 1000;
    whiteMartiniMaximumDelay = 3000;

    redMartiniInitialSpeed = 50;
    redMartinisAreLaunched = false;
    redMartiniMinimumDelay = 10000;
    redMartiniMaximumDelay = 14000;
}

function addHighscore() {
    if (highscores.some(highscore => highscore < score)) {
        highscores[highscores.length - 1] = score;
        highscores.sort((a, b) => b - a);
    }
}
// function removeMenu(){//swiched off to test difficulty level
//    document.getElementById("svgCon").style.display = 'none';
// }
function setDifficultyLevel() {
    if (score === 50) {
        factorDifficulty = 1.1;
        improveDifficulty(factorDifficulty);
    } else if (score === 100) {
        factorDifficulty = 1.2;
        improveDifficulty(factorDifficulty);
    } else if (score === 200) {
        factorDifficulty = 1.4;
        improveDifficulty(factorDifficulty);
    } else if (score === 300) {
        factorDifficulty = 1.6;
        weaponLevel = 2;
        if (!redMartinisAreLaunched) {
            launchRedMartini();
        }
        improveDifficulty(factorDifficulty);
    } else if (score === 400) {
        factorDifficulty = 1.8;
        improveDifficulty(factorDifficulty);
    } else if (score === 500) {
        factorDifficulty = 2.0;
        weaponLevel = 3;
        improveDifficulty(factorDifficulty);
    }

    function improveDifficulty(factorDifficulty) {
        whiteMartiniMinimumDelay = 1000 / factorDifficulty;
        whiteMartiniMaximumDelay = 3000 / factorDifficulty;
        whiteMartiniInitialSpeed = 100 * factorDifficulty;

        redMartiniMinimumDelay = 6000 / factorDifficulty;
        redMartiniMaximumDelay = 10000 / factorDifficulty;
        redMartiniInitialSpeed = 60 * factorDifficulty;
    }
}