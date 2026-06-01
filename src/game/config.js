import Phaser from "phaser";

import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import RooftopScene from "./scenes/RooftopScene";
import DetectiveScene from "./scenes/DetectiveScene";
import FinalScene from "./scenes/FinalScene";

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
  },
  scene: [
BootScene,
  MenuScene,
  RooftopScene,
  DetectiveScene,
  FinalScene  ],
  backgroundColor: "#000000",
};

export default config;