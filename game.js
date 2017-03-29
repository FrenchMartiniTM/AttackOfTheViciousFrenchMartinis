let game;

function startGame() {
    if (!game) {
        document.getElementById("svgCon").style.display = 'none';
        game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer', gameState);
    } else {
        togglePause();
    }
}

const gameState = {
    preload,
    create,
    update,
    render
};

var player,
    playerHead,

    bar,
    barborder,

    cursors,
    scoreText,

    weapon,
    bullets = [],

    fireButton,
    whiteExplosions,
    redExplosions,

    whiteMartinis,
    whiteMartiniLaunchTimer,

    redMartinis,
    redMartiniLaunchTimer,

    hearts,
    pauseKey,
    gameOverText,

    fullScreenButton,
    fullScreenKey;

function preload() {
    game.load.image('bar', 'assets/images/bar.png');
    game.load.image('player', 'assets/images/Bartender_80_88_invert.png');
    game.load.image('bullet', 'assets/images/green_olive_15_19.png');
    game.load.image('white-martini', './assets/images/glass_80_115.png');
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

    gameOverText = game.add.text(
        game.world.centerX,
        game.world.centerY,
        GAME_VARIABLES.gameOverMessage, { font: '84px Arial', fill: '#fff' }
    );
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.kill();

    scoreText = game.add.text(
        600,
        550,
        'score: ' + GAME_VARIABLES.score, { fontSize: '32px', fill: '#F00' }
    );

    for (let i = 0; i < 10; i += 1) {
        bullets.push(new Bullet(game, 'bullet'));
    }

    weapon = new Weapon(game, bullets);
    player = new Bartender(game, 'player');

    hearts = game.add.group();
    addHearts();

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    playerHead = game.add.sprite(PLAYER.HEAD.STARTING_POSITION_X, PLAYER.HEAD.STARTING_POSITION_Y, 'playerhead');
    game.physics.enable(playerHead, Phaser.Physics.ARCADE);
    //playerHead.alpha = 0; // uncomment if you want the red line to disappear

    whiteExplosions = getExplosions('white-explosion');
    redExplosions = getExplosions('red-explosion');

    whiteMartinis = getMartinis(killWhiteMartini, 'white-martini');
    redMartinis = getMartinis(killRedMartini, 'red-martini');

    launchWhiteMartini();

    pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
    pauseKey.onDown.add(togglePause, this);

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    fullScreenButton = game.add.button(game.width - 32, 0, 'fullscreen', toggleFullScreen, this);
    fullScreenKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
    fullScreenKey.onDown.add(toggleFullScreen, this);
}

function update() {
    player.body.velocity.setTo(0, 0);
    playerHead.body.velocity.setTo(0, 0);

    if (cursors.left.isDown) {
        player.moveLeft();
        playerHead.body.velocity.x = -PLAYER.MAX_SPEED;
    } else if (cursors.right.isDown) {
        player.moveRight();
        playerHead.body.velocity.x = PLAYER.MAX_SPEED;
    }

    if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
        weapon.fireBullet(GAME_VARIABLES.weaponLevel, player, GAME_VARIABLES.factorDifficulty);
    }

    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        playerHead.x = player.x - 3;
    }

    if (player.x < 50) {
        player.x = 50;
        playerHead.x = player.x - 3;
    }

    game.physics.arcade.overlap(playerHead, whiteMartinis, playerCollide, null, this);
    game.physics.arcade.overlap(whiteMartinis, weapon, hitEnemy, null, this);
    game.physics.arcade.overlap(barborder, whiteMartinis, barCollide, null, this);

    game.physics.arcade.overlap(playerHead, redMartinis, playerCollide, null, this);
    game.physics.arcade.overlap(redMartinis, weapon, hitEnemy, null, this);
    game.physics.arcade.overlap(barborder, redMartinis, barCollide, null, this);
}

function render() {

}

function getExplosions(explosionAnimation) {
    const explosionType = game.add.group();
    explosionType.enableBody = true;
    explosionType.physicsBodyType = Phaser.Physics.ARCADE;
    explosionType.createMultiple(30, explosionAnimation);
    explosionType.setAll('anchor.x', 0.5);
    explosionType.setAll('anchor.y', 0.5);
    explosionType.forEach(x => x.animations.add(explosionAnimation));

    return explosionType;
}


function getMartinis(onKill, image) {
    const martinis = game.add.group();
    martinis.enableBody = true;
    martinis.physicsBodyType = Phaser.Physics.ARCADE;
    martinis.createMultiple(5, image); //TODO: can add factor to number of enemies in dependence to difficutly level
    martinis.setAll('anchor.x', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
    martinis.setAll('anchor.y', 0.5); //places the anchor in the exact middle of the sprite, horizontally and vertically.
    martinis.setAll('scale.x', 0.5);
    martinis.setAll('scale.y', 0.5);
    martinis.setAll('angle', 0);
    martinis.forEach(function(enemy) {
        enemy.body.setSize(enemy.width, enemy.height); //makes the collision more accurate since it can hit lower area
        enemy.events.onKilled.add(onKill);
    });

    return martinis;
}

function playerCollide(playerHead, enemy) {
    hearts.callAll('kill');
    player.kill();
    endGame();
}

function barCollide(bar, enemy) {
    enemy.kill();
    hearts.children.pop().kill();

    player.lives -= 1;
    if (player.lives <= 0) {
        player.kill();
        endGame();
    }
}

function hitEnemy(enemy, bullet) {
    enemy.kill();
    bullet.kill();

    GAME_VARIABLES.score += enemy.key === 'white-martini' ? 10 : 20;
    scoreText.text = 'score: ' + GAME_VARIABLES.score;

    setDifficultyLevel();
}

// events - they can accept only one parameter
function killWhiteMartini(martini) {
    killMartini(martini, whiteExplosions, 'white-explosion', MARTINI.whiteMartini.explosionSpeed);
}

function killRedMartini(martini) {
    killMartini(martini, redExplosions, 'red-explosion', MARTINI.redMartini.explosionSpeed);
}

function killMartini(martini, explosions, animation, speed) {
    const explosion = explosions.getFirstExists(false);
    explosion.reset(martini.body.x + martini.body.halfWidth, martini.body.y + martini.body.halfHeight);
    explosion.body.velocity.y = martini.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play(animation, speed, false, true);
}

function launchWhiteMartini() {
    if (!player.alive) {
        return;
    }

    const enemy = whiteMartinis.getFirstExists(false);

    if (enemy) {
        enemy.reset(game.rnd.integerInRange(100, game.width - 100), 0);

        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = MARTINI.whiteMartini.initialSpeed;

        whiteMartiniLaunchTimer = game.time.events.add(
            game.rnd.integerInRange(MARTINI.whiteMartini.minimumDelay, MARTINI.whiteMartini.maximumDelay),
            launchWhiteMartini
        );
    }
}

function launchRedMartini() {
    if (!player.alive) {
        return;
    }

    let startingX = game.rnd.integerInRange(100, game.width - 100),
        spread = 60,
        frequency = 70,
        verticalSpacing = 70,
        numEnemiesInWave = 5,
        bank;

    for (let i = 0; i < numEnemiesInWave; i++) {
        const enemy = redMartinis.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = MARTINI.redMartini.initialSpeed;

            enemy.update = function() {
                this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

                bank = Math.cos((this.y + 60) / frequency)
                this.scale.x = 0.5 - Math.abs(bank) / 8;
                this.angle = 0 - bank * 2;
            };
        }
    }

    //  Send another wave soon
    redMartiniLaunchTimer = game.time.events.add(
        game.rnd.integerInRange(MARTINI.redMartini.minimumDelay, MARTINI.redMartini.maximumDelay),
        launchRedMartini
    );
}

function addHearts() {
    for (var i = 0; i < player.lives; i += 1) {
        hearts.create(5 + i * 33, 560, 'heart');
    }
}

function togglePause() {
    if (!player.alive) {
        return;
    }

    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    if (game.physics.arcade.isPaused) {
        showMenu();
    } else {
        removeMenu();
    }
}

function endGame() {
    playerHead.kill();

    game.time.events.remove(redMartiniLaunchTimer);
    game.time.events.remove(whiteMartiniLaunchTimer);

    whiteMartinis.callAll('kill');
    redMartinis.callAll('kill');

    addHighscore();
    gameOverText.revive();
    hearts.children = [];

    spaceRestart = fireButton.onDown.addOnce(restart, this);
}

function restart() {
    gameOverText.kill();
    player.alive = true;
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
    GAME_VARIABLES.score = 0;
    scoreText.text = 'score: ' + GAME_VARIABLES.score;
}

function resetLives() {
    player.lives = 3;
    addHearts();
}

function resetDifficulty() {
    GAME_VARIABLES.factorDifficulty = 1;
    GAME_VARIABLES.weaponLevel = 1;

    MARTINI.whiteMartini.initialSpeed = 100;
    MARTINI.whiteMartini.minimumDelay = 1000;
    MARTINI.whiteMartini.maximumDelay = 3000;

    MARTINI.redMartini.initialSpeed = 50;
    MARTINI.redMartini.minimumDelay = 10000;
    MARTINI.redMartini.maximumDelay = 14000;
}

function addHighscore() {
    mainMenu.updateHighscores(GAME_VARIABLES.score);
}

function removeMenu() {
    document.getElementById("svgCon").style.display = 'none';
    document.getElementsByTagName("canvas")[0].style.display = 'block';
}

function showMenu() {
    document.getElementsByTagName("canvas")[0].style.display = 'none';
    document.getElementById("svgCon").style.display = 'inline-block';
}

function setDifficultyLevel() {
    switch (GAME_VARIABLES.score) {
        case 50:
            GAME_VARIABLES.factorDifficulty = 1.1;
            break;
        case 100:
            GAME_VARIABLES.factorDifficulty = 1.2;
            break;
        case 200:
            GAME_VARIABLES.factorDifficulty = 1.4;
            break;
        case 300:
            GAME_VARIABLES.factorDifficulty = 1.6;
            GAME_VARIABLES.weaponLevel = 2;
            launchRedMartini();
            break;
        case 400:
            GAME_VARIABLES.factorDifficulty = 1.8;
            break;
        case 500:
            GAME_VARIABLES.factorDifficulty = 2.0;
            GAME_VARIABLES.weaponLevel = 3;
            break;
        default:
            break;
    }

    (function improveDifficulty() {
        MARTINI.whiteMartini.minimumDelay = 1000 / GAME_VARIABLES.factorDifficulty;
        MARTINI.whiteMartini.maximumDelay = 3000 / GAME_VARIABLES.factorDifficulty;
        MARTINI.whiteMartini.initialSpeed = 100 * GAME_VARIABLES.factorDifficulty;

        MARTINI.redMartini.minimumDelay = 6000 / GAME_VARIABLES.factorDifficulty;
        MARTINI.redMartini.maximumDelay = 10000 / GAME_VARIABLES.factorDifficulty;
        MARTINI.redMartini.initialSpeed = 60 * GAME_VARIABLES.factorDifficulty;
    })();
}