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

var eurecaClientSetup = function() {
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function proxy(){
		eurecaServer = proxy;
		});

	eurecaClient.exports.setId = function(id)
	{
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
	}
	eurecaClient.exports.nextPlayer = function( i, x, y) {
		if (i == myId) return;
		console.log("Join another PLAYER");
		var nply = new big_invader(i, game, player);
		playerlist[i] = nply;
	}
	
}

mul_play = function(index, game, player) {

this.game = game;
this.player = player;

this.mul_play = game.add.sprite(400,500, 'ship');
this.mul_play.anchor.set(0.5);

this.mul_play.id = index;
game.physics.enable(this.mul_play,Phaser.Physics.ARCADE);

}	
	
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

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
	player = new mul_play(myId,game,mul_play);
	
	//  The hero!
    //player = game.add.sprite(400, 500, 'ship');
    //player.anchor.setTo(0.5, 0.5);
    //game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

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
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function createAliens () {
            var alien = aliens.create(48, 50, 'invader');
			alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;

    aliens.x = 500;
    aliens.y = 150;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    
	  var treen = game.add.tween(aliens).to( { x: 20, y:20}, 2000, Phaser.Easing.Linear.None)
										.to( { y: 300, x:300}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 155, x: 75}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 20, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 500, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 450, x: 20}, 2000, Phaser.Easing.Linear.None)
										.loop()
										.start();
	
    //  When the tween loops it calls descend
    //tween.onLoop.add(descend, this);  -- dorkar ki ?? 
}
function createAliens2 () {
            var alien2 = aliens2.create(48, 50, 'invader');
			alien2.anchor.setTo(0.5, 0.5);
            alien2.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien2.play('fly');
            alien2.body.moves = false;

    aliens2.x = 500;
    aliens2.y = 150;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    
	  var treen = game.add.tween(aliens2).to( { x: 20, y:20}, 2000, Phaser.Easing.Linear.None)
										.to( { y: 300, x:300}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 155, x: 75}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 20, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 500, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 450, x: 20}, 2000, Phaser.Easing.Linear.None)
										.loop()
										.start();
	
    //  When the tween loops it calls descend
    //tween.onLoop.add(descend, this);  -- dorkar ki ?? 
}
function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 1;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);
	//gameSpeed *= 1.2;
	
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -400;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 400;
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -400;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 400;
    }
    //  Firing?
    if (fireButton.isDown)
    {
        fireBullet();
    }
    if (game.time.now > firingTimer)
    {
        enemyFires();
		//gameSpeed+=100;
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
	game.physics.arcade.overlap(bullets, aliens2, collisionHandler2, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(enemyBullets2, player, enemyHitsPlayer2, null, this);

}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    life = life-1;
	
    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
	explosion.play('kaboom', 30, false, true);
	
	if(life == 5 ) {
	aliens2 = game.add.group();
    aliens2.enableBody = true;
    aliens2.physicsBodyType = Phaser.Physics.ARCADE;
	createAliens2();
	}
    if(life < 1)
    {	
		alien.kill();
		score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function collisionHandler2 (bullet, alien2) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    life2 = life2-1;
	
    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien2.body.x, alien2.body.y);
	explosion.play('kaboom', 30, false, true);
	
	if(life2 < 1)
    {	
		alien2.kill();
		score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer2 (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets2.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

    // put every living enemy in an array
    livingEnemies.push(alien);
	});

	if (enemyBullet && livingEnemies.length > 0)
    {
        
        // randomly select one of them
        var shooter=livingEnemies[0];
		// And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);
		game.physics.arcade.moveToObject(enemyBullet,player,gameSpeed);
		//gameSpeed = gameSpeed+100;
		//game.physics.arcade.accelerateToObject(enemyBullet,player,gameSpeed,1500,1500);
		firingTimer = game.time.now + (Math.random() * (10 - 5) + 5);
		
    }
	
	if(life <= 5){
	// ei khane abar sala oi array full koira ditase new enemy diya, mane alien2 diya. vejal da ei jaygay e lagse
	
	// hoise lastly. magar ekhon vejal lagse, new enemy re guli kora ar new enemy theika player re guli kora
	// jotodur bujtasi, double double declare kora lagbo ar ki. 30% number er laiga ei kaam mela boro, ekta foul asole Manzke.
		enemyBullet2 = enemyBullets2.getFirstExists(false);
		livingEnemies2.length = 0;
		aliens2.forEachAlive(function(alien2){
			livingEnemies2.push(alien2);	
		});
		if(enemyBullet2 && livingEnemies2.length > 0)
		{
		var shooter2=livingEnemies2[0];
		enemyBullet2.reset(shooter2.body.x, shooter2.body.y);
		game.physics.arcade.moveToObject(enemyBullet2,player,gameSpeed);
		firingTimer = game.time.now + (Math.random() * (10 - 5) + 5);
		}
	}
	
	
}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}