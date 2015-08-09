var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('picture7', 'assets/pics/slayer-sorry_im_the_beast.png');

}

var timer;
var total = 0;

function create() {

    game.stage.backgroundColor = '#000';
    game.time.events.add(Phaser.Timer.SECOND * 10, doingsomething, this);
}

function doingsomething()
{
	game.debug.text('Counted: ', 32, 64);
}
function render() {

    game.debug.text('Time until event: ' + game.time.events.duration, 32, 32);
}