import Phaser from "phaser";

export default class FinalScene extends Phaser.Scene {
  constructor() {
    super("FinalScene");
  }

  create() {
    this.add.text(400, 300, "Final Scene", {
      color: "#ffffff",
      fontSize: "32px",
    });
  }
}