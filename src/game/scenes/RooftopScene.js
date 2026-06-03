import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor("#050510");

    // Title hint
    this.add.text(20, 20, "ROOFTOP TRAINING: REACH THE BAT SIGNAL", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    // Player (him)
    this.player = this.add.rectangle(100, 600, 30, 30, 0x00bfff);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);

    // Goal (Bat Signal)
    this.goal = this.add.circle(1180, 100, 30, 0xffff00);
    this.physics.add.existing(this.goal, true);

    // Movement input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Collision with goal
    this.physics.add.overlap(
      this.player,
      this.goal,
      () => {
        this.scene.start("DetectiveScene");
      }
    );

    // Simple rooftop platform line
    this.platform = this.add.rectangle(640, 650, 1280, 40, 0x111111);
    this.physics.add.existing(this.platform, true);

    this.physics.add.collider(this.player, this.platform);
  }

  update() {
    const speed = 220;

    this.player.body.setVelocity(0);

    // Movement
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