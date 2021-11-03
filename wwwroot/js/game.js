"use strict";

//
//SignalR Connection
//

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

//Disable send button until connection is established
document.getElementById("startGame").disabled = true;

connection.start().then(function () {
    document.getElementById("startGame").disabled = false;

    LoadPlayer();

}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("startGame").addEventListener("click", function (event) {

    connection.invoke("LoadPlayerCharacter", "20", "20").catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("ReceiveNewPlayer", function (id, playerNumber) {

    if (myPlayerNumber != undefined)
        return;

    if (playerNumber == 1) {
        console.log(id + "------" + playerNumber);
        myPlayer = player1;
        secondPlayer = player2;
    }
    else if (playerNumber == 2) {
        console.log(id + "------" + playerNumber);
        myPlayer = player2;
        secondPlayer = player1;
    }

    myPlayerId = id;
    myPlayerNumber = playerNumber;

    document.getElementById("startGame").disabled = true;
});

connection.on("UpdatePlayer", function (id, direction) {

    var currPlayer = id == myPlayerId ? myPlayer : secondPlayer;

    console.log(currPlayer);
    console.log("Direction" + direction);

    if (direction == 'MoveLeft') {
        currPlayer.setVelocityX(-160);
        currPlayer.anims.play('left', true);
    }
    else if (direction == 'MoveRight') {
        currPlayer.setVelocityX(160);
        currPlayer.anims.play('right', true);
    }
    else if (direction == 'MoveUp') {
        currPlayer.setVelocityY(-330);
    }
    else if (direction == 'Turn') {
        currPlayer.setVelocityX(0);
        currPlayer.anims.play('turn');
    }
});

function LoadPlayer() {
    connection.invoke("LoadPlayerCharacter", "20", "20").catch(function (err) {
        return console.error(err.toString());
    });
}

//
//GAME LOGIC
//

var myPlayerNumber;
var myPlayerId;

var myPlayer;
var secondPlayer;
var player1;
var player2;

var enemy1;
var enemy2;

var platforms;
var cursors;

var game;

init();



function init() {
    //loadControls();
    loadPhaser();
}

function loadPhaser() {

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);

    function preload() {
        this.load.image('sky', '../../assets/sky.png');
        this.load.image('ground', '../../assets/platform.png');
        this.load.image('star', '../../assets/star.png');
        this.load.image('bomb', '../../assets/bomb.png');
        this.load.spritesheet('dude',
            '../../assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    function create() {
        this.add.image(400, 300, 'sky');

        platforms = this.physics.add.staticGroup();

        //platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //platforms.create(600, 400, 'ground');
        //platforms.create(50, 250, 'ground');
        //platforms.create(750, 220, 'ground');

        //platforms.create(300, 300, 'ground');

        player1 = this.physics.add.sprite(100, 450, 'dude');

        player1.setBounce(0.2);
        player1.setCollideWorldBounds(true);

        player1.body.setGravityY(300);

        player2 = this.physics.add.sprite(150, 450, 'dude');

        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);

        player2.body.setGravityY(300);

        enemy1 = this.physics.add.sprite(100, 450, 'star');
        enemy1.setBounce(1);
        enemy1.setCollideWorldBounds(true);
        enemy1.body.setGravityY(0);

        enemy1.body.allowGravity = false;

        enemy2 = this.physics.add.sprite(100, 450, 'star');
        enemy2.setBounce(1);
        enemy2.setCollideWorldBounds(true);
        enemy2.body.setGravityY(0);

        enemy2.body.allowGravity = false;

        
        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player1, platforms);
        this.physics.add.collider(player2, platforms);
        this.physics.add.collider(enemy1, platforms);

        this.physics.add.collider(player1, enemy1);
        this.physics.add.collider(player2, enemy1);

        this.physics.add.collider(player1, enemy2);
        this.physics.add.collider(player2, enemy2);

        this.physics.add.collider(enemy1, enemy2);

        enemy1.setVelocityX(160);
        enemy1.setVelocityY(600);

        enemy2.setVelocityX(160);
        enemy2.setVelocityY(600);

        cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {

        if (cursors.left.isDown) {
            fireUpdatePlayer('left');
            wasTurningLeft = true;
        }
        else if (cursors.right.isDown) {
            fireUpdatePlayer('right');
            wasTurningRight = true;
        }
        else {
            if (wasTurningLeft) {
                fireUpdatePlayer('turn');
                wasTurningLeft = false;
            }

            if (wasTurningRight) {
                fireUpdatePlayer('turn');
                wasTurningRight = false;
            }

        }

        if (cursors.up.isDown /*&& player1.body.touching.down*/) {
            fireUpdatePlayer('up');
        }

    }
}

var wasTurningLeft, wasTurningRight = false;

function fireUpdatePlayer(direction) {
    connection.invoke("MovePlayer", myPlayerId, direction).catch(function (err) {
        return console.error(err.toString());
    });
}

