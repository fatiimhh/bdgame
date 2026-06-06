import Phaser from "phaser";

import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import RooftopScene from "./scenes/RooftopScene";
import DetectiveScene from "./scenes/DetectiveScene";
import FinalScene from "./scenes/FinalScene";
import CutsceneScene from "./scenes/CutsceneScene";


const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
 // parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },

    arcade: {
  gravity: { y: 0 },
  debug: false,
  damping: true,
}


  },
  scene: [
  BootScene,
  CutsceneScene,
  MenuScene,
  RooftopScene,
  DetectiveScene,
  FinalScene  ],
  backgroundColor: "#000000",
};

export default config;