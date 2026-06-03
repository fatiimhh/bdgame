import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.add.text(400, 300, "Booting Gotham...", {
      fontSize: "24px",
      color: "#00bfff",
      
    });

    console.log("BootScene running");

    this.time.delayedCall(1000, () => {
      console.log("Switching to MenuScene");
      this.scene.start("MenuScene");
    });
  }
}