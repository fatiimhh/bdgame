import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000");

    this.add.text(640, 200, "GOTHAM: NIGHT PROTOCOL", {
      fontSize: "42px",
      color: "#00BFFF",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.add.text(640, 300, "ACCESSING SYSTEM...", {
      fontSize: "24px",
      color: "#ffffff",
    }).setOrigin(0.5);

    const startText = this.add.text(640, 500, "[ PRESS ENTER ]", {
      fontSize: "32px",
      color: "#00BFFF",
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("RooftopScene");
    });

      console.log("MenuScene is running");

  }
}