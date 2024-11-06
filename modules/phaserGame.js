// modules/phaserGame.js
import Phaser from 'phaser';

const sizes = { width: 500, height: 500 };
const speedDown = 300;

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.player = null;
        this.cursor = null;
    }

    preload() {
        this.load.image("background", "/BG.png");
        this.load.image("capybird", "Capybird.png");
    }

    create() {
        this.scene.pause("scene-game");
        const canvas_image = this.add.image(0, 0, "background").setOrigin(0, 0);
        canvas_image.setDisplaySize(sizes.width, sizes.height);

        this.player = this.physics.add.image(0, 388, "capybird").setOrigin(0, 0);
        this.player.setDisplaySize(40, 40);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update() {
        const { left, right } = this.cursor;
        if (left.isDown) {
            this.player.setVelocityX(-300);
        } else if (right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }
    }

    gameOver() {
        this.sys.game.destroy(true);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: speedDown },
            debug: true,
        },
    },
    scene: [GameScene],
};

export default function initializeGame() {
    return new Phaser.Game(config);
}
