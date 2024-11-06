<<<<<<< Updated upstream
import './style.css'
import Phaser from '/phaser'
import elementIDSListener from './event_listeners.js'
=======
import initializeGame from './modules/phaserGame.js';
import elementIDSListener from './event_listeners.js';
>>>>>>> Stashed changes

const game = initializeGame();
elementIDSListener(game);
