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

// cutscene logo
    this.load.image("batLogo", "/assets/batman_logo.png");

// Rooftop scene assets
   this.load.image(
  "batSignal",
  "/assets/batSignal.png"
    );

    // rooftop scene sounds
    this.load.audio("rain", "/sounds/rain.mp3");
    this.load.audio("wind", "/sounds/wind.mp3");
    this.load.audio("dash", "/sounds/dash.mp3");
    this.load.audio("collect", "/sounds/collect.mp3");

    // cutscene narration
    this.load.audio("narration", "/sounds/narration.mp3"); 

    // detective scene sounds
    this.load.audio("click", "/sounds/click.mp3");
    this.load.audio("correct", "/sounds/correct.mp3");
    this.load.audio("wrong", "/sounds/wrong.mp3");
    this.load.audio("glitch", "/sounds/glitch.mp3");

// pursuit scene & final level scene sounds
    this.load.audio("jump", "/sounds/jump.mp3");
    this.load.audio("pursuit", "/sounds/pursuit.mp3");
    this.load.audio("capture", "/sounds/capture.mp3");
   // this.load.audio("alert", "/sounds/alert.mp3");

   // ending scene sounds
    this.load.audio("hit", "/sounds/hit.mp3");
    this.load.audio("gotham", "/sounds/gotham.mp3");

    // Menu background music
    this.load.audio("background", "/sounds/background.mp3");

    // roofttop & detective background music
    this.load.audio("background2", "/sounds/background2.mp3");


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