import elementIDSListener from './event_listeners.js';

const gameStart = document.querySelector("#gameStart");
const gameEnd = document.querySelector("#gameEnd");
const scoreSpan = document.querySelector("#gameEndScoreSpan");
const winLoseSpan = document.querySelector("#gameWinLoseSpan");

// Object that holds the width and height of the game screen
const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player = null;
    this.cursor = null;
    this.playerSpeed = 175;
    this.jumpVelocity = -250; // Reduced jump velocity
    this.target = null;
    this.target2 = null;
    this.bgMusic = null;
    this.textScore = null;
    this.score = 0;
    this.targetSpeed = speedDown; // Speed of the first obstacle
    this.target2Speed = speedDown; // Speed of the second obstacle
    this.currentSkin = "capybird"; // Default skin
    this.currentBackground = "background"; // Default background

  }

  preload() {
    // Load all skins
    this.load.image("capybird", "./images/Capybird.png");
    this.load.image("capybird2", "./images/Capybird2.png");
    this.load.image("Obstacle", "./images/Obstacle.png");
    this.load.image("floor", "./images/floor.png");
    this.load.image("background", "./images/BG.png");
    this.load.image("background2", "./images/BG2.png");
    this.load.audio("bgMusic", "./Audio/bgmusic.mp3");
  }

  create() {
    // Pause the game until the player clicks the start button
    this.scene.pause();

    // Set up the background image
    this.backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
    this.backgroundImage.setDisplaySize(sizes.width, sizes.height);

    // Set up the player (Capybird)
    this.player = this.physics.add.image(225, 100, this.currentSkin).setOrigin(0, 0);
    this.player.setDisplaySize(40, 40);
    this.player.body.allowGravity = true;
    this.player.setCollideWorldBounds(true);

    this.floor = this.physics.add.staticImage(0, sizes.height - 10, "floor").setOrigin(0, 0);
    this.floor.setDisplaySize(sizes.width, 100);

    // Adds collision with floor
    this.physics.add.collider(this.player, this.floor, this.onPlayerTouchFloor, null, this);

    // Set up keyboard input
    this.cursor = this.input.keyboard.createCursorKeys();

    // Set up background music
    this.bgMusic = this.sound.add("bgMusic", { loop: true });

    // Set up the first target (obstacle)
    this.target = this.physics.add.image(0, 0, "Obstacle").setOrigin(0, 0).setDisplaySize(30, 30);
    this.target.setVelocityY(this.targetSpeed);
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    // Set up the second target (obstacle)
    this.target2 = this.physics.add.image(0, 0, "Obstacle").setOrigin(0, 0).setDisplaySize(30, 30);
    this.target2.setX(this.getRandomX());
    this.target2.setVelocityY(this.target2Speed);
    this.physics.add.overlap(this.target2, this.player, this.targetHit2, null, this);

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

    // Add event listener for skin change
    document.querySelector("#customize_capybird").addEventListener("click", (event) => {
      if (event.target.id === "btn") {
        const skinIndex = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
        this.currentSkin = skinIndex === 0 ? "capybird" : `capybird${skinIndex + 1}`;
        this.player.setTexture(this.currentSkin); // Change the player's texture instantly
        this.player.setDisplaySize(50, 50);
      }
    });

    document.querySelector("#customize_background").addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") { // Check if the clicked element is a button
        const bgIndex = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
        this.currentBackground = bgIndex === 0 ? "background" : `background${bgIndex + 1}`;
        this.backgroundImage.setTexture(this.currentBackground); // Change the background instantly
        this.backgroundImage.setDisplaySize(sizes.width, sizes.height); // Ensure correct display size
      }
    });
    
    
  }

  update() {
    // Handle the first target (obstacle)
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
      this.target.setVelocityY(this.targetSpeed);
    }

    // Handle the second target (obstacle)
    if (this.target2.y >= sizes.height) {
      this.target2.setY(0);
      this.target2.setX(this.getRandomX());
      this.target2.setVelocityY(this.target2Speed);
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

  targetHit2() {
    this.target2.setY(0);
    this.target2.setX(this.getRandomX());
    this.gameOver();
  }

  onPlayerTouchFloor() {
    this.gameOver();
  }

  gameOver() {
    console.log("Game Over");
    this.scene.pause();
    this.bgMusic.stop();

    // Update the Game Over screen
    const playerName = localStorage.getItem("player_name") || "Anonymous";
    const finalScore = this.score;
    scoreSpan.textContent = finalScore;
    winLoseSpan.textContent = "Game Over";

    gameEnd.style.display = "flex";
    gameStart.style.display = "none";

    // Submit score to the server
    fetch("submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_name: playerName, score: finalScore }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Score submitted successfully!");
        }
      })
      .catch((err) => console.error("Error submitting score:", err));

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
