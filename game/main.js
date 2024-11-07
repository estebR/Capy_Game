
import elementIDSListener from './event_listeners.js'


//An object that will hold the width and height of
//the game screen
const sizes={
  width:500,
  height:500
}

const speedDown =300


class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    //This will act as a variable for the Cpaybara image
    this.player
    this.cursor
    this.playerSpeed=175;
    this.jumpVelocity=-400;

  }
  
  //Initizates the image
  preload(){
    this.load.image("background","/BG.png")
    this.load.image("capybird","Capybird.png")
  }
  create(){
    //This will pause the game unitl the player clicks the start button
    this.scene.pause("scene-game")
    //For Canavs
    //This adds the initliazed photo to the background
    const canvas_image=this.add.image(0,0,"background").setOrigin(0,0)
    //This sets the image the same size as the canvas
    canvas_image.setDisplaySize(sizes.width,sizes.height)

    
    //For the caybird image
    const player = this.player=this.physics.add.image(0,388,"capybird").setOrigin(0,0)
    //Change the size of the player
    player.setDisplaySize(40,40)

    //For now so we can see where the image is on the cnavas but change!!!
    this.player.body.allowGravity = true
    
    this.player.setCollideWorldBounds(true) //set bounds

    this.cursor = this.input.keyboard.createCursorKeys()





  }
  update(){
    const { left, right, up} = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
   if (up.isDown) {
    this.player.setVelocityY(-this.playerSpeed)
   }
   
    //THis is the gameover function
    
  }
  gameOver(){
    this.scene.pause("scene-game")
    this.sys.game.destroy(true)

  }
}

const config ={
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,

  // Adding a physics proeprty
  //As an object
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:speedDown},
      debug:true
    }

  },
  scene:[GameScene]
}

const game = new Phaser.Game(config)

elementIDSListener(game)
