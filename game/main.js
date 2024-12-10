import elementIDSListener from './event_listeners.js';
 
const gameStart = document.querySelector("#gameStart");
const gameEnd = document.querySelector("#gameEnd");
const scoreSpan = document.querySelector("#gameEndScoreSpan");
const winLoseSpan = document.querySelector("#gameWinLoseSpan");
 
// Object that holds the width and height of the game screen
const sizes = {
  width: 500,
  height: 500
};
 
const speedDown = 300;
 
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player = null;
    this.cursor = null;
    this.playerSpeed = 175;
    this.jumpVelocity = -200;
    this.target = null;
    this.bgMusic = null;
    this.textScore = null;
    this.score = 0;
  }
 
  preload() {
    this.load.image("background", "./images/BG.png");
    this.load.image("capybird", "./images/Capybird.png");
    this.load.image("Obstacle", "./images/Obstacle.png");
    this.load.image("floor", "./images/floor.png");
    this.load.audio("bgMusic", "./Audio/bgmusic.mp3");
  }
 
  create() {
    // Pause the game until the player clicks the start button
    this.scene.pause();
 
    // Set up the background image
    const canvasImage = this.add.image(0, 0, "background").setOrigin(0, 0);
    canvasImage.setDisplaySize(sizes.width, sizes.height);
 
    // Set up the player (Capybird)
    this.player = this.physics.add.image(0, 200, "capybird").setOrigin(0, 0);
    this.player.setDisplaySize(40, 40);
    this.player.body.allowGravity = true;
    this.player.setCollideWorldBounds(true); // Keep the player within bounds
 
    this.floor = this.physics.add.staticImage(0, sizes.height  -10, "floor").setOrigin(0, 0);
    this.floor.setDisplaySize(sizes.width, 100);
 
    //adds collison with floor
    this.physics.add.collider(this.player, this.floor, this.onPlayerTouchFloor, null, this);
 
    // Set up keyboard input
    this.cursor = this.input.keyboard.createCursorKeys();
 
    // Set up background music
    this.bgMusic = this.sound.add("bgMusic", { loop: true} );
 
    // Set up the target (obstacle)
    this.target = this.physics.add
      .image(0, 0, "Obstacle")
      .setOrigin(0, 0)
      .setDisplaySize(30, 30);
    this.target.setVelocityY(speedDown);
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);
 
    // Set up the score display
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "20px Arial",
      fill: "#000000",
    });
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.score += 100;
        this.textScore.setText(`Score: ${this.score}`);
      },
      loop: true,
    });
  }
 
  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
      this.target.setVelocityY(speedDown);
    }
 
    // Handle player movement
    const { left, right, up } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (up.isDown) {
      this.player.setVelocityY(this.jumpVelocity);
    }
  }
 
  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 30));
  }
 
  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.gameOver();
  }
  onPlayerTouchFloor() {
    this.gameOver(); // End the game when the player hits the floor
  }
 
  gameOver() {
    console.log("Game Over");
    this.scene.pause();
    this.bgMusic.stop(); // Stop the background music
 
    // Update the Game Over screen
    const playerName = localStorage.getItem("player_name") || "Anonymous";
    const finalScore = this.score;
    scoreSpan.textContent = finalScore;
    winLoseSpan.textContent = "Lose!!!";
 
    gameEnd.style.display = "flex";
    gameStart.style.display = "none";
 
    // Submit score to the server
    fetch('submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName, score: finalScore }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Score submitted successfully!");
    fetchLeaderboard();
        }
      })
      .catch(err => console.error("Error submitting score:", err));
 
    this.score = 0; // Reset the score
  }
}
 
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.querySelector("#gameCanvas"),
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    },
  },
  scene: [GameScene],
};
 
const game = new Phaser.Game(config);
 
elementIDSListener(game);