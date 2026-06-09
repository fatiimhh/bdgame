import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
    // Gotham background
    this.cameras.main.setBackgroundColor("#02020a");

    // Skyline layers
    this.cityBack = this.add.rectangle(640, 400, 1400, 300, 0x0a0a1a);
    this.cityMid = this.add.rectangle(640, 500, 1400, 300, 0x050514);
    this.cityFront = this.add.rectangle(640, 650, 1400, 200, 0x03030f);

    // Ground
    this.ground = this.add.rectangle(640, 700, 1400, 120, 0x111111);
    this.physics.add.existing(this.ground, true);

    // Player
    this.player = this.physics.add.sprite(100, 600, "batman");
    this.player.setScale(0.9);
    this.player.setCollideWorldBounds(true);

    // Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.1);
    this.cameras.main.setLerp(0.1, 0.1);

    // INPUT
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // SOUNDS 
    this.sound.pauseOnBlur = false;

    this.sounds = {
      rain: this.sound.add("rain", { loop: true, volume: 0.25 }),
      wind: this.sound.add("wind", { loop: true, volume: 0.15 }),
      dash: this.sound.add("dash", { volume: 0.5 }),
      collect: this.sound.add("collect", { volume: 0.6 }),
      music: this.sound.add("background2", { loop: true, volume: 0.4 }),
    };

    this.sounds.music.play();
    this.sounds.rain.play();
    this.sounds.wind.play();

    // DASH
    this.dashCooldown = 0;

    // SIGNAL SYSTEM 
    this.signals = [];
    this.signalsCollected = 0;
    this.totalSignals = 5;

    for (let i = 0; i < this.totalSignals; i++) {
      const x = Phaser.Math.Between(200, 1100);
      const y = Phaser.Math.Between(150, 600);

      // glow
      const glow = this.add.circle(x, y, 18, 0xffff00, 0.15);

      this.tweens.add({
        targets: glow,
        scale: 1.4,
        alpha: 0.05,
        duration: 900,
        yoyo: true,
        repeat: -1,
      });

      // bat signal sprite
      const signal = this.physics.add.sprite(x, y, "batSignal");
      signal.setScale(0.12);
      signal.body.setAllowGravity(false);
      signal.body.setImmovable(true);

      signal.glow = glow;
      this.signals.push(signal);

      this.physics.add.overlap(this.player, signal, () => {
        if (!signal.active) return;

        signal.destroy();
        glow.destroy();

        this.sounds.collect.play();

        this.signalsCollected++;
        this.updateUI();

        if (this.signalsCollected >= this.totalSignals) {
          this.time.delayedCall(600, () => {
            this.scene.start("DetectiveScene");
          });
        }
      });
    }

    // COLLISION
    this.physics.add.collider(this.player, this.ground);

    // UI
    this.uiText = this.add.text(70, 70, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    });
    this.uiText.setScrollFactor(0);

    this.updateUI();

    // RAIN
    this.createRain();
  }

  update() {
    const acceleration = 18;
    const maxSpeed = this.shiftKey.isDown ? 420 : 260;
    const friction = 0.92;

    let vx = this.player.body.velocity.x;
    let vy = this.player.body.velocity.y;

    const isMoving =
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown;

    if (isMoving) {
      this.player.anims.play("walk", true);
    } else {
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    if (this.cursors.left.isDown) this.player.setFlipX(true);
    else if (this.cursors.right.isDown) this.player.setFlipX(false);

    if (this.cursors.left.isDown) vx -= acceleration;
    if (this.cursors.right.isDown) vx += acceleration;
    if (this.cursors.up.isDown) vy -= acceleration;
    if (this.cursors.down.isDown) vy += acceleration;

    // DASH
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
      this.dashCooldown <= 0
    ) {
      const dashPower = 600;

      if (this.cursors.left.isDown) vx = -dashPower;
      else if (this.cursors.right.isDown) vx = dashPower;
      else if (this.cursors.up.isDown) vy = -dashPower;
      else if (this.cursors.down.isDown) vy = dashPower;
      else vx = dashPower;

      this.dashCooldown = 800;
      this.cameras.main.shake(80, 0.01);

      this.sounds.dash.play(); //  dash sound
    }

    // parallax
    this.cityBack.x = 640 + vx * 0.02;
    this.cityMid.x = 640 + vx * 0.05;
    this.cityFront.x = 640 + vx * 0.08;

    if (this.dashCooldown > 0) this.dashCooldown -= 16;

    vx *= friction;
    vy *= friction;

    vx = Phaser.Math.Clamp(vx, -maxSpeed, maxSpeed);
    vy = Phaser.Math.Clamp(vy, -maxSpeed, maxSpeed);

    this.player.body.setVelocity(vx, vy);

    // sync glow
    this.signals.forEach((signal) => {
      if (signal.glow) {
        signal.glow.x = signal.x;
        signal.glow.y = signal.y;
      }
    });
  }

  updateUI() {
    this.uiText.setText(
      `BAT SIGNALS: ${this.signalsCollected} / ${this.totalSignals}`
    );
  }

  createRain() {
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(0, 720);

      const drop = this.add.rectangle(x, y, 2, 12, 0x88ccff, 0.25);

      this.tweens.add({
        targets: drop,
        y: 800,
        duration: Phaser.Math.Between(600, 1200),
        repeat: -1,
      });
    }
  }
}