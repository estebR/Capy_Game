import Phaser from 'phaser'
class Player {
    constructor(){

        //Player speed
        this.velocity= {
            x:0,
            y:0
        }
    }
}

export default function addPlayerMovement(player, cursors) {
    // Example movement logic using arrow keys
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }
  
    // Jumping
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
  