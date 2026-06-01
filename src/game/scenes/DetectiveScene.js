import Phaser from "phaser";

export default class DetectiveScene extends Phaser.Scene {
  constructor() {
    super("DetectiveScene");
  }

  create() {
    this.add.text(400, 300, "Detective Scene", {
      color: "#ffffff",
    });
  }
}