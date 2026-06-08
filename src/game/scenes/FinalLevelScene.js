import Phaser from "phaser";

export default class FinalLevelScene extends Phaser.Scene {
  constructor() {
    super("FinalLevelScene");
  }

  create() {

    //  Gotham atmosphere
    this.cameras.main.setBackgroundColor("#04040a");

    // skyline
    this.add.rectangle(640, 180, 1400, 260, 0x0a0a1a);
    this.add.rectangle(640, 500, 1400, 420, 0x050514);

    // rain
    this.createRain();

    //  Bat Signal
    this.batSignalGlow = this.add.circle(
      640,
      360,
      90,
      0xffff99,
      0.12
    );

    this.batSignal = this.add.circle(
      640,
      360,
      45,
      0xffff00
    );

    // glow pulse
    this.tweens.add({
      targets: this.batSignalGlow,
      scale: 1.3,
      alpha: 0.03,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    //  player
    this.player = this.physics.add.sprite(640, 620, "batman");

    this.player.setDisplaySize(60, 80);

    this.player.setCollideWorldBounds(true);

    // top-down movement
    this.player.body.setAllowGravity(false);

    //  controls
    this.cursors = this.input.keyboard.createCursorKeys();

    //  enemies
    this.enemies = this.physics.add.group();

    //  Bat Signal health
    this.signalHealth = 5;

    //  survival timer
    this.timeLeft = 35;

    // UI
    this.healthText = this.add.text(20, 20, "", {
      fontSize: "22px",
      color: "#ff5555",
      fontFamily: "monospace",
    });

    this.timerText = this.add.text(20, 60, "", {
      fontSize: "22px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    this.updateUI();

    // spawn enemies repeatedly
    this.enemySpawner = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => {
        this.spawnEnemy();
      },
    });

    //  countdown
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      repeat: 44,
      callback: () => {

        this.timeLeft--;

        this.updateUI();

        // win
        if (this.timeLeft <= 0) {
          this.winLevel();
        }
      },
    });

    //  player intercept enemies
    this.physics.add.overlap(
      this.player,
      this.enemies,
      (player, enemy) => {

        enemy.destroy();

        this.cameras.main.flash(100, 0, 255, 120);
      }
    );

    //  intro text
    this.introText = this.add.text(
      640,
      90,
      "DEFEND THE BAT SIGNAL",
      {
        fontSize: "28px",
        color: "#00bfff",
        fontFamily: "monospace",
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: this.introText,
      alpha: 0,
      duration: 2500,
      delay: 1200,
    });
  }

  update() {

    //  movement
    const speed = 320;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) {
      vx = -speed;
      this.player.setFlipX(true);
    }

    if (this.cursors.right.isDown) {
      vx = speed;
      this.player.setFlipX(false);
    }

    if (this.cursors.up.isDown) {
      vy = -speed;
    }

    if (this.cursors.down.isDown) {
      vy = speed;
    }

    this.player.setVelocity(vx, vy);

    //  enemy AI
    this.enemies.getChildren().forEach((enemy) => {

      this.physics.moveToObject(
        enemy,
        this.batSignal,
        110
      );

      //  enemy reached Bat Signal
      const distance = Phaser.Math.Distance.Between(
        enemy.x,
        enemy.y,
        this.batSignal.x,
        this.batSignal.y
      );

      if (distance < 55) {

        enemy.destroy();

        this.signalHealth--;

        this.updateUI();

        // damage effect
        this.cameras.main.shake(200, 0.01);

        this.cameras.main.flash(150, 255, 0, 0);

        // lose
        if (this.signalHealth <= 0) {
          this.gameOver();
        }
      }
    });
  }

  //  enemy spawn
  spawnEnemy() {

    const positions = [
      { x: 0, y: Phaser.Math.Between(0, 720) },
      { x: 1280, y: Phaser.Math.Between(0, 720) },
      { x: Phaser.Math.Between(0, 1280), y: 0 },
      { x: Phaser.Math.Between(0, 1280), y: 720 },
    ];

    const spawn =
      Phaser.Utils.Array.GetRandom(positions);

    const enemy = this.add.circle(
      spawn.x,
      spawn.y,
      18,
      0xff0033
    );

    this.physics.add.existing(enemy);

    this.enemies.add(enemy);
  }

  //  UI
  updateUI() {

    this.healthText.setText(
      `BAT SIGNAL: ${this.signalHealth}`
    );

    this.timerText.setText(
      `SURVIVE: ${this.timeLeft}`
    );
  }

  //  WIN
  winLevel() {

    this.physics.pause();

    this.enemySpawner.remove();

    this.cameras.main.flash(700, 255, 255, 255);

    this.add.text(640, 360, "GOTHAM PROTECTED ✔", {
      fontSize: "40px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {

      this.scene.start("EndingScene");

    });
  }

  // LOSE
  gameOver() {

    this.physics.pause();

    this.enemySpawner.remove();

    this.cameras.main.shake(500, 0.02);

    this.add.text(640, 360, "BAT SIGNAL DESTROYED", {
      fontSize: "40px",
      color: "#ff0033",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.time.delayedCall(2500, () => {

      this.scene.restart();

    });
  }

  //  rain effect
  createRain() {

    for (let i = 0; i < 100; i++) {

      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(0, 720);

      const drop = this.add.rectangle(
        x,
        y,
        2,
        12,
        0x88ccff,
        0.25
      );

      this.tweens.add({
        targets: drop,
        y: 800,
        duration: Phaser.Math.Between(700, 1200),
        repeat: -1,
      });
    }
  }
}