var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bullet', 'bullet.png');
    game.load.image('enemyBullet', 'enemy-bullet.png');
    game.load.image('invader', 'big_enemy.png', 128, 128);
    game.load.image('ship', 'player.png');
    game.load.spritesheet('kaboom', 'explode.png', 128, 128);
    game.load.image('starfield', 'starfield.png');
    game.load.image('background', 'background.png');

}

var player;
var aliens;
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
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var gameSpeed = 150;
var life=10;

function create()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	starfield = game.add.tileSprite(0,0,800,600,'starfield');

    bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType=Phaser.Physics.ARCADE;
	bullets.createMultiple(30,'bullet');
	bullets.setAll('anchor.x',0.5);
	bullets.setAll('anchor.y',1);
	bullets.setAll('outOfBoundsKill',true);
	bullets.setAll('checkWorldBounds',true);
	
	enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(Math.random() * (100 - 25) + 25, 'enemyBullet');
	//enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
	
	player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
		
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
	
	lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
	
	aliens = game.add.group();
    aliens.enableBody = true;
	
	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
	
	for (var i = 0; i <100; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }
	//for (var x = 0; x <5; x++)
	//{
	    var alien = aliens.create(400, 200, 'invader');
		alien.anchor.setTo(0.5, 0.5);
        alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
        alien.play('fly');
        alien.body.moves = true;
    //}

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	//aliens.x = 500;
    //aliens.y = 150;
	var treen = game.add.tween(aliens).to( { x: 20, y:20}, 2000, Phaser.Easing.Linear.None)
										.to( { y: 300, x:300}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 155, x: 75}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 20, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {x: 500, y: 20}, 2000, Phaser.Easing.Linear.None)
										.to( {y: 450, x: 20}, 2000, Phaser.Easing.Linear.None)
										.loop()
										.start();
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
	game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
}

function collisionHandler(bullet,alien)
{
	bullet.kill();
	life = life-1;
	/*var life = aliens.getFirstAlive();
	if(life !== null)
	{
		stateText.text = " This if condition is working";
		stateText.visible = true;
		//life.kill();
		life.reset(400,200);
	}*/
	//if (aliens.countLiving() < 1)
	//else
	if (life < 1)
	{
		alien.kill();
		enemyBullets.callAll('kill');
        stateText.text=" ALL ENEMY LIFE FINISHED ";
        stateText.visible = true;
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
        //game.input.onTap.addOnce(restart,this);
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
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);
		game.physics.arcade.moveToObject(enemyBullet,player,gameSpeed);
		//gameSpeed = gameSpeed+100;
		//game.physics.arcade.accelerateToObject(enemyBullet,player,gameSpeed,1500,1500);
		firingTimer = game.time.now + (Math.random() * (10 - 5) + 5);
		
        
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