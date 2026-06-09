import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //  Sprite

  this.load.spritesheet("batman", `${import.meta.env.BASE_URL}assets/batman_walk.png`, {
  frameWidth: 48,
  frameHeight: 48,
});

// cutscene logo
    this.load.image("batLogo", `${import.meta.env.BASE_URL}assets/batman_logo.png`);

// Rooftop scene assets
   this.load.image(
  "batSignal",
  `${import.meta.env.BASE_URL}assets/batSignal.png`
    );

    // rooftop scene sounds
    this.load.audio("rain", `${import.meta.env.BASE_URL}sounds/rain.mp3`);
    this.load.audio("wind", `${import.meta.env.BASE_URL}sounds/wind.mp3`);
    this.load.audio("dash", `${import.meta.env.BASE_URL}sounds/dash.mp3`);
    this.load.audio("collect", `${import.meta.env.BASE_URL}sounds/collect.mp3`);

    // cutscene narration
    this.load.audio("narration", `${import.meta.env.BASE_URL}sounds/narration.mp3`); 

    // detective scene sounds
    this.load.audio("click", `${import.meta.env.BASE_URL}sounds/click.mp3`);
    this.load.audio("correct", `${import.meta.env.BASE_URL}sounds/correct.mp3`);
    this.load.audio("wrong", `${import.meta.env.BASE_URL}sounds/wrong.mp3`);
    this.load.audio("glitch", `${import.meta.env.BASE_URL}sounds/glitch.mp3`);

// pursuit scene & final level scene sounds
    this.load.audio("jump", `${import.meta.env.BASE_URL}sounds/jump.mp3`);
    this.load.audio("pursuit", `${import.meta.env.BASE_URL}sounds/pursuit.mp3`);
    this.load.audio("capture", `${import.meta.env.BASE_URL}sounds/capture.mp3`);
   // this.load.audio("alert", `${import.meta.env.BASE_URL}sounds/alert.mp3`);

   // ending scene sounds
    this.load.audio("hit", `${import.meta.env.BASE_URL}sounds/hit.mp3`);
    this.load.audio("gotham", `${import.meta.env.BASE_URL}sounds/gotham.mp3`);

    // Menu background music
    this.load.audio("background", `${import.meta.env.BASE_URL}sounds/background.mp3`);

    // roofttop & detective background music
    this.load.audio("background2", `${import.meta.env.BASE_URL}sounds/background2.mp3`);

      // ending scene narration
        this.load.audio("narration2", `${import.meta.env.BASE_URL}sounds/narration2.mp3`); 


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