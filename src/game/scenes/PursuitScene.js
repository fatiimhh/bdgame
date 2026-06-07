import Phaser from "phaser";

export default class PursuitScene extends Phaser.Scene {
  constructor() {
    super("PursuitScene");
  }

  create() {

    // background
    this.cameras.main.setBackgroundColor("#050510");

    //  skyline
    this.add.rectangle(640, 200, 1400, 300, 0x0a0a1a);
    this.add.rectangle(640, 500, 1400, 400, 0x050514);

    // platforms group
    this.platforms = this.physics.add.staticGroup();

    //MAIN GROUND
    const ground = this.add.rectangle(640, 710, 1400, 40, 0x111111);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // rooftop platform 1
    const platform1 = this.add.rectangle(400, 520, 300, 20, 0x222222);
    this.physics.add.existing(platform1, true);
    this.platforms.add(platform1);

    //  rooftop platform 2
    const platform2 = this.add.rectangle(900, 380, 250, 20, 0x222222);
    this.physics.add.existing(platform2, true);
    this.platforms.add(platform2);

    //  PLAYER
    this.player = this.physics.add.sprite(100, 600, "batman");

    // player size
    this.player.setDisplaySize(60, 80);

    // physics
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);

    // gravity
    this.player.body.setGravityY(750);

    // smoother movement
    this.player.setDragX(800);

    // TARGET
    this.target = this.add.rectangle(1100, 300, 40, 40, 0xff0033);

    this.physics.add.existing(this.target);

    this.target.body.setCollideWorldBounds(true);

    //  controls
    this.cursors = this.input.keyboard.createCursorKeys();

    //  collisions
    this.physics.add.collider(this.player, this.platforms);

    //  target collision
    this.physics.add.overlap(this.player, this.target, () => {
      this.winLevel();
    });

    //  camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.05);

    // smooth camera
    this.cameras.main.setLerp(0.08, 0.08);

    //timer
    this.timeLeft = 30;

    this.timerText = this.add.text(20, 20, "", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    // keep UI fixed on screen
    this.timerText.setScrollFactor(0);

    this.updateTimerUI();

    this.time.addEvent({
      delay: 1000,
      repeat: 29,
      callback: () => {

        this.timeLeft--;

        this.updateTimerUI();

        if (this.timeLeft <= 0) {
          this.gameOver();
        }
      },
    });

    // target AI
    this.targetDirection = -1;

    // intro text
    this.introText = this.add.text(
      640,
      80,
      "TARGET DETECTED — PURSUIT INITIATED",
      {
        fontSize: "24px",
        color: "#00bfff",
        fontFamily: "monospace",
      }
    ).setOrigin(0.5);

    this.introText.setScrollFactor(0);

    // fade intro text
    this.tweens.add({
      targets: this.introText,
      alpha: 0,
      duration: 3000,
      delay: 1500,
    });
  }

  update() {

    const speed = 260;

    // LEFT
    if (this.cursors.left.isDown) {

      this.player.setVelocityX(-speed);

      this.player.setFlipX(true);

      // animation
      if (this.player.anims) {
        this.player.anims.play("walk", true);
      }
    }

    // RIGHT
    else if (this.cursors.right.isDown) {

      this.player.setVelocityX(speed);

      this.player.setFlipX(false);

      // animation
      if (this.player.anims) {
        this.player.anims.play("walk", true);
      }
    }

    // IDLE
    else {

      this.player.setVelocityX(0);

      if (this.player.anims) {
        this.player.anims.stop();
      }

      this.player.setFrame(0);
    }

    // JUMP FIXED
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      this.player.body.blocked.down
    ) {

      this.player.setVelocityY(-700);

      // jump frame
      this.player.setFrame(2);

      // camera impact
      this.cameras.main.shake(120, 0.003);
    }

    //  TARGET MOVEMENT
    this.target.body.setVelocityX(140 * this.targetDirection);

    // reverse direction
    if (this.target.x <= 200) {
      this.targetDirection = 1;
    }

    if (this.target.x >= 1150) {
      this.targetDirection = -1;
    }

    //  parallax skyline
    this.children.list[0].x =
      640 + this.player.body.velocity.x * 0.01;

    this.children.list[1].x =
      640 + this.player.body.velocity.x * 0.03;
  }

  // TIMER UI
  updateTimerUI() {

    this.timerText.setText(
      `TIME LEFT: ${this.timeLeft}`
    );
  }

  // WIN
  winLevel() {

    this.physics.pause();

    this.cameras.main.flash(500, 0, 255, 120);

    this.add.text(640, 360, "TARGET CAPTURED", {
      fontSize: "42px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.time.delayedCall(2500, () => {

      this.scene.start("FinalLevelScene");

    });
  }

  // LOSE
  gameOver() {

    this.physics.pause();

    this.cameras.main.shake(500, 0.02);

    this.add.text(640, 360, "TARGET ESCAPED", {
      fontSize: "42px",
      color: "#ff0033",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.time.delayedCall(2500, () => {

      this.scene.restart();

    });
  }
}