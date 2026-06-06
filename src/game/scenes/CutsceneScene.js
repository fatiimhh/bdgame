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

    let currentLine = 0;

    this.textObject = this.add.text(80, 120, "", {
      fontSize: "28px",
      color: "#00ff99",
      fontFamily: "monospace",
      lineSpacing: 12,
    });

    this.currentText = "";

    this.time.addEvent({
      delay: 1200,
      repeat: lines.length - 1,
      callback: () => {
        this.currentText += lines[currentLine] + "\n\n";

        this.textObject.setText(this.currentText);

        // glitch flash
        this.cameras.main.flash(100, 0, 255, 120);

        currentLine++;

        // final transition
        if (currentLine === lines.length) {
          this.time.delayedCall(1800, () => {
            this.scene.start("MenuScene");
          });
        }
      },
    });
  }
}