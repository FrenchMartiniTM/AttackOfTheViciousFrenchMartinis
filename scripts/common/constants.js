const PLAYER = {
    STARTING_POSITION_X: 400,
    STARTING_POSITION_Y: 404,
    MAX_SPEED: 400,

    HEAD: {
        STARTING_POSITION_X: 396,
        STARTING_POSITION_Y: 360
    }
};

const BAR = {
    BORDER_POSITION_X: 0,
    BORDER_POSITION_Y: 448,
};

const BULLET = {
    SPEED: 400,
    SPACING: 450
};

const MARTINI = {
    whiteMartini: {
        minimumDelay: 1000,
        maximumDelay: 3000,
        initialSpeed: 100,
        explosionSpeed: 12
    },
    redMartini: {
        minimumDelay: 10000,
        maximumDelay: 14000,
        initialSpeed: 100,
        explosionSpeed: 30
    }
};

const GAME_VARIABLES = {
    weaponLevel: 1,
    factorDifficulty: 1,
    score: 250,
    gameOverMessage: 'GAME OVER!',
    repositoryHref: 'https://github.com/FrenchMartiniTM/AttackOfTheViciousFrenchMartinis',
}