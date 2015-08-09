var playerlist;
var player;
var myId=0;
var positionX=400;
var eurecaServer;
var ready=false;
var mul_play;
var starfield;
var cursors;
var ready=false;
var cursorPush=false;

var eurecaClientSetup = function() {
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function proxy(){
		eurecaServer = proxy;
		});
		
	eurecaClient.exports.setId = function(id) {
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
		}
	eurecaClient.exports.kill = function(id) {
		if(playerlist[id]) {
			playerlist[id].kill();
			console.log('Player  Died',id, playerlist[id]);
			}
	}
	eurecaClient.exports.nextPlayer = function (i,x,y)
	{
		if (i == myId) return;
		console.log('Partner');
		var prt_ship = new Mul_Play(i,game,ship);
		playerlist[i] = prt_ship;
	}
	
	eurecaClient.exports.updateState = function(id,state)
	{
		if(playerlist[id]) {
			playerlist[id].cursor = state;
			playerlist[id].ship.x = state.x;
			playerlist[id].ship.y = state.y;
			playerlist[id].update();
			}
	}
}

Mul_Play = function(index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		down:false		
	}
	
	this.input = {
		left:false,
		right:false,
		up:false,
		down:false
	}
		
	
this.game = game;
this.player = player;
this.alive = true;

this.ship = game.add.sprite(positionX,500, 'ship');
this.ship.anchor.set(0.5);

this.ship.id = index;
game.physics.enable(this.ship,Phaser.Physics.ARCADE);
//this.ship.body.immovable = false;

};


/*Mul_Play.prototype.update = function() {
	
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.down != this.input.down
	);
	
	
	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server		
		if (this.ship.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.ship.x;
			this.input.y = this.ship.y;
			eurecaServer.handleKeys(this.input);
			
		}
	}

	//cursor value is now updated by eurecaClient.exports.updateState method
	
	
    if (this.cursor.left)
    {
        this.ship.body.velocity.x = -400;
		
    }
    else if (this.cursor.right)
    {
        this.ship.body.velocity.x = 400;
		
    }	
    else if (this.cursor.up)
    {
        this.ship.body.velocity.y = -400;
		
    }
    else if (this.cursor.down)
    {	
		this.ship.body.velocity.y = 400;
		
    }
 	
};
*/
/*Mul_Play.prototype.kill = function() {
	this.alive = false;
	this.player.kill();
}*/

//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render});

function preload() {

    game.load.image('bullet', 'bullet.png');
    game.load.image('enemyBullet', 'enemy-bullet.png');
	game.load.image('enemyBullet2', 'enemy-bullet.png');
    game.load.image('invader', 'big_enemy.png', 128, 128);
    game.load.image('ship', 'player.png');
    game.load.spritesheet('kaboom', 'explode.png', 128, 128);
    game.load.image('starfield', 'starfield.png');
 }

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    playerlist={};
	player = new Mul_Play(myId,game,ship);
	playerlist[myId] = player;
	ship = player.ship;
	ship.x = 400;
	ship.y = 500;
	//  The hero!
    //player = game.add.sprite(400, 500, 'ship');
    //player.anchor.setTo(0.5, 0.5);
    //game.physics.enable(player, Phaser.Physics.ARCADE);

    //createAliens();

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    for (var i = 0; i <10; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }
    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    //fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function update () {
	//do not update if client not ready
	
	if (!ready) return;
	
	/*player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.down = cursors.down.isDown;
	*/
	   if (this.cursor.left)
    {
        this.ship.body.velocity.x = -400;
		
    }
    else if (this.cursor.right)
    {
        this.ship.body.velocity.x = 400;
		
    }	
    else if (this.cursor.up)
    {
        this.ship.body.velocity.y = -400;
		
    }
    else if (this.cursor.down)
    {	
		this.ship.body.velocity.y = 400;
		
    }
	
}
function render () {}