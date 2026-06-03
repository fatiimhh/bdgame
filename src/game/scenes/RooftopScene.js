import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
    //  Gotham background
    this.cameras.main.setBackgroundColor("#02020a");

    //  skyline layers 
    this.cityBack = this.add.rectangle(640, 400, 1400, 300, 0x0a0a1a);
    this.cityMid = this.add.rectangle(640, 500, 1400, 300, 0x050514);
    this.cityFront = this.add.rectangle(640, 650, 1400, 200, 0x03030f);

    //  Rooftop ground
    this.ground = this.add.rectangle(640, 700, 1400, 120, 0x111111);
    this.physics.add.existing(this.ground, true);

    //  Player 
    this.player = this.add.rectangle(100, 600, 30, 30, 0x00bfff);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);


this.cameras.main.startFollow(this.player); // camera follow
this.cameras.main.setZoom(1.1);


    //  Input
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //  Dash system
    this.dashCooldown = 0;

    //  Mission system
    this.signalsCollected = 0;
    this.totalSignals = 3;

    this.signals = [];

    //  Create signals (mission objects)
    for (let i = 0; i < this.totalSignals; i++) {
      const signal = this.add.circle(
  Phaser.Math.Between(200, 1100),
  Phaser.Math.Between(150, 600),
  14,
  0xffff00,
  0.6
);

const glow = this.add.circle(signal.x, signal.y, 26, 0xffff00, 0.15); // glow effect

this.tweens.add({
  targets: glow,
  scale: 1.3,
  alpha: 0.05,
  duration: 800,
  yoyo: true,
  repeat: -1,
});

      this.physics.add.existing(signal, true);

      this.signals.push(signal);

      this.physics.add.overlap(this.player, signal, () => {
        if (!signal.active) return;

        signal.destroy();
        this.signalsCollected++;
        this.updateUI();

        //  mission complete → next scene
        if (this.signalsCollected >= this.totalSignals) {
          this.time.delayedCall(500, () => {
            this.scene.start("DetectiveScene");
          });
        }
      });
    }

//  Camera settings
    this.cameras.main.setLerp(0.1, 0.1);



    //  ground collision
    this.physics.add.collider(this.player, this.ground);

    //  UI
    this.uiText = this.add.text(20, 20, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    this.updateUI();

    //  Rain
    this.createRain();
  }

  update(time, delta) {
    //  Movement system (momentum)
    const acceleration = 18;
    const maxSpeed = this.shiftKey.isDown ? 420 : 260;
    const friction = 0.92;

    let vx = this.player.body.velocity.x;
    let vy = this.player.body.velocity.y;

    // movement input
    if (this.cursors.left.isDown) vx -= acceleration;
    if (this.cursors.right.isDown) vx += acceleration;
    if (this.cursors.up.isDown) vy -= acceleration;
    if (this.cursors.down.isDown) vy += acceleration;

    //  DASH (SPACE)
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

  // cinematic impact
  this.cameras.main.shake(80, 0.01);
}

// Parallax effect
this.cityBack.x = 640 + this.player.body.velocity.x * 0.02;
this.cityMid.x = 640 + this.player.body.velocity.x * 0.05;
this.cityFront.x = 640 + this.player.body.velocity.x * 0.08;


    // cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= delta;
    }

    // friction (smooth stop)
    vx *= friction;
    vy *= friction;

    // speed limit
    vx = Phaser.Math.Clamp(vx, -maxSpeed, maxSpeed);
    vy = Phaser.Math.Clamp(vy, -maxSpeed, maxSpeed);

    this.player.body.setVelocity(vx, vy);
  }

  //  UI update
  updateUI() {
    this.uiText.setText(
      `BAT SIGNALS: ${this.signalsCollected} / ${this.totalSignals}`
    );
  }

  //  Rain effect
  createRain() {
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(0, 720);

      const drop = this.add.rectangle(x, y, 2, 12, 0x88ccff, 0.3);

      this.tweens.add({
        targets: drop,
        y: 800,
        duration: Phaser.Math.Between(700, 1200),
        repeat: -1,
      });
    }
  }
}