import Phaser from "phaser";

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super("EndingScene");
  }

  create() {

    // background screen
    this.cameras.main.setBackgroundColor("#0a86ac");

    //  sound effect (music)
    this.music = this.sound.add("background", {
      loop: false,
      volume: 0.4,
    });

    this.music.play();

    // narration
    this.narration2= this.sound.add("narration2", {
      volume: 0.9,
    });

    this.narration2.play();

    // Batcomputer text
    this.fullText = [
      "ANALYZING FINAL PROFILE...",
      "",
      `SUBJECT: ${this.registry.get("playerName") || "RUNNING ON PURE MAIN CHARACTER ENERGY"}`,
      "",
      "STATUS: ACTIVE IN GOTHAM SYSTEM",
      "MISSION: DEFEND THE BAT SIGNAL",
      "RESULT: COMPLETED",
      "",
      "DETERMINATION: ABSOLUTE",
      "FOCUS: LASER-SHARP",
      "HEART: TOO GOOD FOR THIS CITY",
      "",
      "NOTES:",
      "YOU SHOWED UP WHEN IT MATTERED.",
      "YOU DID WHAT WAS REQUIRED.",
      "",
      "GOTHAM WILL REMEMBER THAT IN ITS OWN WAY.",
      "",
      "ENDING SIMULATION...",
      "",
      "HAPPY BIRTHDAY! 🖤🦇"
    ];

    this.currentLine = 0;
    this.displayedText = "";

    this.textObject = this.add.text(80, 80, "", {
      fontSize: "20px",
      color: "#abcebf",
      fontFamily: "monospace",
      lineSpacing: 8,
    });

    // typewriter effect
    this.time.addEvent({
      delay: 1200,
      repeat: this.fullText.length - 1,
      callback: () => {

        this.displayedText += this.fullText[this.currentLine] + "\n";
        this.textObject.setText(this.displayedText);

        this.cameras.main.flash(80, 0, 255, 150);

        this.currentLine++;

        // final reveal
        if (this.currentLine === this.fullText.length) {

          this.time.delayedCall(1500, () => {
            this.showLogo();
          });
        }
      }
    });
  }

  showLogo() {

    // Batman logo 
    const logo = this.add.image(640, 360, "batLogo");

    logo.setScale(0.05);
    logo.setAlpha(0);

    // cinematic reveal
    this.tweens.add({
      targets: logo,
      scale: 0.6,
      alpha: 1,
      duration: 2500,
      ease: "Power2",
    });

    // final flash
    this.cameras.main.flash(800, 255, 255, 255);

    // fade music
    this.tweens.add({
      targets: this.music,
      volume: 0,
      duration: 2000,
    });

    // fade narration
    this.tweens.add({
      targets: this.narration,
      volume: 0,
      duration: 2000,
    });

    // restart or end screen
    this.time.delayedCall(5000, () => {

      this.add.text(640, 650, "PRESS REFRESH TO PLAY AGAIN", {
        fontSize: "18px",
        color: "#313030",
        fontFamily: "monospace",
      }).setOrigin(0.5);

    });
  }
}