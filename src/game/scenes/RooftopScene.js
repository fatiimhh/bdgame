import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
    //  Gotham background
    this.cameras.main.setBackgroundColor("#02020a");

    //  Skyline layers
    this.cityBack = this.add.rectangle(640, 400, 1400, 300, 0x0a0a1a);
    this.cityMid = this.add.rectangle(640, 500, 1400, 300, 0x050514);
    this.cityFront = this.add.rectangle(640, 650, 1400, 200, 0x03030f);

    //  Rooftop ground
    this.ground = this.add.rectangle(640, 700, 1400, 120, 0x111111);
    this.physics.add.existing(this.ground, true);

    //  BATMAN SPRITE
    this.player = this.physics.add.sprite(100, 600, "batman");

    this.player.setScale(0.9); 
    this.player.setCollideWorldBounds(true);


// walk animation
    this.anims.create({   
  key: "walk",
  frames: this.anims.generateFrameNumbers("batman", {
    start: 0,
    end: 3,
  }),
  frameRate: 10,
  repeat: -1,
});

    //  Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.1);
    this.cameras.main.setLerp(0.1, 0.1);


    ///////////////////////////////////
    //  SOUNDS

    this.music = this.sound.add("background2", {
      loop: false,
      volume: 0.4,
    });

    this.music.play();

     this.sound.pauseOnBlur = false;

    this.sounds = {
      rain: this.sound.add("rain", {
        loop: true,
        volume: 0.25,
      }),

      wind: this.sound.add("wind", {
        loop: true,
        volume: 0.15,
      }),

      dash: this.sound.add("dash", {
        volume: 0.5,
      }),

      collect: this.sound.add("collect", {
        volume: 0.5,
      }),
    };

    // Start ambience
    this.sounds.rain.play();
    this.sounds.wind.play(); 
///////////////////////////////////


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
    this.totalSignals = 5;

    this.signals = [];

    //  Create glowing signals
    for (let i = 0; i < this.totalSignals; i++) {
      const x = Phaser.Math.Between(200, 1100);
      const y = Phaser.Math.Between(150, 600);

      //  glow layer
      const glow = this.add.circle(x, y, 26, 0xffff00, 0.15);

      this.tweens.add({
        targets: glow,
        scale: 1.3,
        alpha: 0.05,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      //  signal core
      const signal = this.add.circle(x, y, 14, 0xffff00, 0.7);

      this.physics.add.existing(signal, true);

      this.signals.push(signal);

      //  collection overlap
      this.physics.add.overlap(this.player, signal, () => {
        if (!signal.active) return;

        signal.destroy();
        glow.destroy();

        /////////////////
        //  collect sound
        this.sounds.collect.play();
        /////////////////

        this.signalsCollected++;
        this.updateUI();

        //  Mission complete
        if (this.signalsCollected >= this.totalSignals) {
          this.time.delayedCall(600, () => {
            this.scene.start("DetectiveScene");
          });
        }
      });
    }

    //  collision with ground
    this.physics.add.collider(this.player, this.ground);

    //  UI
    this.uiText = this.add.text(70, 70, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    // UI stays fixed on screen
    this.uiText.setScrollFactor(0);

    this.updateUI();

    // Rain
    this.createRain();
  }

  update(time, delta) {
    
    //  Movement physics
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

if (isMoving) {             // play walk animation
  this.player.anims.play("walk", true);
} else {
  this.player.anims.stop();
  this.player.setFrame(0); // idle frame
}

if (this.cursors.left.isDown) { // flip sprite based on direction
  this.player.setFlipX(true);
} else if (this.cursors.right.isDown) {
  this.player.setFlipX(false);
}

    //  movement input
    if (this.cursors.left.isDown) vx -= acceleration;
  if (this.cursors.right.isDown) vx += acceleration;
    if (this.cursors.up.isDown) vy -= acceleration;
   if (this.cursors.down.isDown) vy += acceleration;

    //  DASH
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

            //////
      //  dash sound
       this.sounds.dash.play();
            //////

      //  cinematic shake
      this.cameras.main.shake(80, 0.01);
    }

    //  Parallax skyline movement
    this.cityBack.x = 640 + vx * 0.02;
    this.cityMid.x = 640 + vx * 0.05;
    this.cityFront.x = 640 + vx * 0.08;

    //  cooldown timer 
    if (this.dashCooldown > 0) {
      this.dashCooldown -= delta;
    }

    //  friction 
    vx *= friction;
    vy *= friction;

    //  speed limits
    vx = Phaser.Math.Clamp(vx, -maxSpeed, maxSpeed);
    vy = Phaser.Math.Clamp(vy, -maxSpeed, maxSpeed);

    // movement apply
    this.player.body.setVelocity(vx, vy);

    //  tilt effect 
   // this.player.rotation = vx * 0.001;
  }

  //  UI
  updateUI() {
    this.uiText.setText(
      `BAT SIGNALS: ${this.signalsCollected} / ${this.totalSignals}`
    );
  }

  //  Rain effect
  createRain() {
    for (let i = 0; i < 120; i++) {
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
        duration: Phaser.Math.Between(600, 1200),
        repeat: -1,
      });
    }
  }
}