import Phaser from "phaser";

export default class CutsceneScene extends Phaser.Scene {
  constructor() {
    super("CutsceneScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    const lines = [
      "> ACCESSING BATCOMPUTER...",
      "> SEARCHING GOTHAM DATABASE...",
      "> SUBJECT IDENTIFIED...",
      "> ANALYZING PROFILE...",
      "> STRENGTH: ELITE",
      "> GYM PERFORMANCE: EXCEPTIONAL",
      "> SLEEP SCHEDULE: QUESTIONABLE",
      "> DETECTIVE POTENTIAL: CONFIRMED",
      "> STATUS: READY",
    ];

    let currentLine = 1; 

    this.textObject = this.add.text(80, 120, "", {
      fontSize: "28px",
      color: "#00ff99",
      fontFamily: "monospace",
      lineSpacing: 9,
    });

    this.currentText = "";

    this.time.addEvent({
      delay: 2000,
      repeat: lines.length - 1,
      callback: () => {
        this.currentText += lines[currentLine] + "\n\n";

        this.textObject.setText(this.currentText);

        // glitch flash
        this.cameras.main.flash(100, 0, 255, 120);

        currentLine++;

        // final transition
        if (currentLine === lines.length) {
         this.time.delayedCall(1200, () => {

  // logo appears
  const logo = this.add.image(640, 360, "batLogo");

  logo.setScale(0.05);
  logo.setAlpha(0);

  // cinematic reveal
  this.tweens.add({
    targets: logo,
    scale: 0.5,
    alpha: 1,
    duration: 2000,
    ease: "Power2",
  });

  // dramatic flash
  this.cameras.main.flash(800, 255, 255, 255);

  // move to menu
  this.time.delayedCall(3500, () => {
    this.scene.start("MenuScene");
  });
});
        }
      },
    });

    // narration voiceover
this.voice = this.sound.add("narration", {
  volume: 0.8,
});

this.voice.play();

  }
}