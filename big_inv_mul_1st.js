var playerlist;
var player;
var aliens;
var aliens2;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var enemyBullet2;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var livingEnemies2 = [];
var gameSpeed = 150;
var life=10;
var life2=10;
var myId=0;
var positionX=400;
var eurecaServer;
var ready=false;
var mul_play;

var eurecaClientSetup = function() {
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function proxy(){
		eurecaServer = proxy;
		create();
		ready = true;
		});
}

Mul_Play = function(index, game, player) {

this.game = game;
this.player = player;

this.mul_play = game.add.sprite(positionX,500, 'ship');
this.mul_play.anchor.set(0.5);

this.mul_play.id = index;
game.physics.enable(this.mul_play,Phaser.Physics.ARCADE);
this.mul_play.body.immovable = false;
};

//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup});

function preload() {

    game.load.image('bullet', 'bullet.png');
    game.load.image('enemyBullet', 'enemy-bullet.png');
	game.load.image('enemyBullet2', 'enemy-bullet.png');
    game.load.image('invader', 'big_enemy.png', 128, 128);
    game.load.image('ship', 'player.png');
    game.load.spritesheet('kaboom', 'explode.png', 128, 128);
    game.load.image('starfield', 'starfield.png');
    game.load.image('background', 'background.png');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(Math.random() * (100 - 25) + 25, 'enemyBullet');
	//enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
	
	enemyBullets2 = game.add.group();
    enemyBullets2.enableBody = true;
    enemyBullets2.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets2.createMultiple(Math.random() * (100 - 25) + 25, 'enemyBullet2');
	//enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets2.setAll('anchor.x', 0.5);
    enemyBullets2.setAll('anchor.y', 1);
    enemyBullets2.setAll('outOfBoundsKill', true);
    enemyBullets2.setAll('checkWorldBounds', true);

    playerlist={};
	player = new Mul_Play(myId,game,ship);
	playerlist[myId] = player;
	mul_play = player.mul_play;
	mul_play.x = 0;
	mul_play.y = 0;
	//  The hero!
    //player = game.add.sprite(400, 500, 'ship');
    //player.anchor.setTo(0.5, 0.5);
    //game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    //createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i <10; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    /*explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);
*/
    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

/*function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;
for(var n in playerlist) {
    //  Reset the player, then check for movement keys
    player[n].body.velocity.setTo(0, 0);
	positionX = positionX+50;
	
	//gameSpeed *= 1.2;
	
    if (cursors.left.isDown)
    {
        player[n].body.velocity.x = -400;
    }
    else if (cursors.right.isDown)
    {
        player[n].body.velocity.x = 400;
    }
    else if (cursors.up.isDown)
    {
        player[n].body.velocity.y = -400;
    }
    else if (cursors.down.isDown)
    {
        player[n].body.velocity.y = 400;
    }
	
	}
    //  Firing?
 /*   if (fireButton.isDown)
    {
        fireBullet();
    }
    if (game.time.now > firingTimer)
    {
        enemyFires();
		//gameSpeed+=100;
    }
*/
    //  Run collision
    /*game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
	game.physics.arcade.overlap(bullets, aliens2, collisionHandler2, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(enemyBullets2, player, enemyHitsPlayer2, null, this);

}*/