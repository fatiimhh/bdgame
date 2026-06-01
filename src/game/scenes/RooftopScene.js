import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#111");

    this.player = this.add.rectangle(100, 360, 40, 40, 0x00bfff);

    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.text(20, 20, "Reach the signal.", {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.goal = this.add.rectangle(1150, 360, 60, 200, 0xffff00);

    this.physics.add.existing(this.goal, true);

    this.physics.add.overlap(
      this.player,
      this.goal,
      () => {
        this.scene.start("DetectiveScene");
      },
      null,
      this
    );
  }

  update() {
    const speed = 250;

    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    }

    if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    }

    if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }
  }
}