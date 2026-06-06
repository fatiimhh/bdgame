import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //  Sprite
    //this.load.image("batman", "/assets/batman.png");

    this.load.spritesheet("batman", "/assets/batman_walk.png", {
  frameWidth: 48,
  frameHeight: 48,
});

    //  Sounds
    this.load.audio("rain", "/sounds/rain.mp3");
    this.load.audio("wind", "/sounds/wind.mp3");
    this.load.audio("dash", "/sounds/dash.mp3");
    this.load.audio("collect", "/sounds/collect.mp3");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add.text(400, 300, "Booting Gotham...", {
      fontSize: "24px",
      color: "#00bfff",
      fontFamily: "monospace",
    });

    console.log("BootScene running");

    this.time.delayedCall(1000, () => {
      console.log("Switching to CutsceneScene");
      this.scene.start("CutsceneScene");
    });
  }
}