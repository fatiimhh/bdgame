import Phaser from "phaser";

export default class RooftopScene extends Phaser.Scene {
  constructor() {
    super("RooftopScene");
  }

  create() {
   
    //  GOTHAM SKYLINE
  
    this.cameras.main.setBackgroundColor("#05060c");

    //  WORLD SIZE
    this.worldWidth = 2000;
    this.worldHeight = 900;

    
    //  WORLD + CAMERA BOUNDS
  
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.skyBack = this.add.rectangle(800, 300, 2000, 500, 0x0a0a1a);
    this.skyMid = this.add.rectangle(800, 450, 2000, 600, 0x050514);
    this.skyFront = this.add.rectangle(800, 650, 2000, 700, 0x03030f);

   
    //  ROOFTOPS
   
    this.ground = this.physics.add.staticGroup();

    this.ground.create(800, 860).setDisplaySize(2000, 80).refreshBody();
    this.ground.create(350, 650).setDisplaySize(500, 30).refreshBody();
    this.ground.create(900, 520).setDisplaySize(600, 30).refreshBody();
    this.ground.create(1400, 380).setDisplaySize(450, 30).refreshBody();

    // =
    // PLAYER
    //
    this.player = this.physics.add.sprite(150, 750, "batman");

    this.player.setScale(0.9);
    this.player.setCollideWorldBounds(true);

    this.player.setGravityY(900);
    this.player.setDragX(500);
    this.player.setMaxVelocity(600, 900);

    this.physics.add.collider(this.player, this.ground);

    // camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

 
    //  INPUT
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );


    //  DASH
    
    this.dashCooldown = 0;


    //  SOUNDS
    
    this.music = this.sound.add("background2", {
      loop: true,
      volume: 0.4,
    });

    this.music.play();

    this.sounds = {
      rain: this.sound.add("rain", { loop: true, volume: 0.2 }),
      wind: this.sound.add("wind", { loop: true, volume: 0.15 }),
      dash: this.sound.add("dash", { volume: 0.6 }),
      collect: this.sound.add("collect", { volume: 0.6 }),
    };

    this.sounds.rain.play();
    this.sounds.wind.play();


    //  SIGNALS
   
    this.signals = [];
    this.signalsCollected = 0;
    this.totalSignals = 5;

    for (let i = 0; i < this.totalSignals; i++) {
      const x = Phaser.Math.Between(200, 1800);
      const y = Phaser.Math.Between(250, 700);

      const glow = this.add.circle(x, y, 26, 0xffff00, 0.12);

      this.tweens.add({
        targets: glow,
        scale: 1.3,
        alpha: 0.05,
        duration: 900,
        yoyo: true,
        repeat: -1,
      });

      const signal = this.physics.add.sprite(x, y, "batSignal");

      signal.setScale(0.1);
      signal.body.setAllowGravity(false);
      signal.setImmovable(true);

      signal.glow = glow;
      this.signals.push(signal);

      this.physics.add.overlap(this.player, signal, () => {
        if (!signal.active) return;

        signal.destroy();
        if (signal.glow) signal.glow.destroy();

        this.sounds.collect.play();

        this.signalsCollected++;
        this.updateUI();

        if (this.signalsCollected >= this.totalSignals) {
          this.time.delayedCall(800, () => {
            this.scene.start("DetectiveScene");
          });
        }
      });
    }

   
    //UI
   
    this.uiText = this.add.text(20, 20, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    });

    this.uiText.setScrollFactor(0);
    this.updateUI();

 
    //  RAIN
   
    this.createRain();

   
    // ANIMATION
    
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("batman", {
        start: 0,
        end: 3,
      }),
      frameRate: 14,
      repeat: -1,
    });
  }

  update(time, delta) {
    const accel = 35;
    const maxSpeed = this.shiftKey.isDown ? 650 : 420;

    let vx = this.player.body.velocity.x;

    if (this.cursors.left.isDown) vx -= accel;
    if (this.cursors.right.isDown) vx += accel;

    //  GROUND CHECK
    const isGrounded = this.player.body.blocked.down;

    // FIXED JUMP 
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && isGrounded) {
      this.player.setVelocityY(-650);
    }

    // DASH
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
      this.dashCooldown <= 0
    ) {
      const dash = 800;

      if (this.cursors.left.isDown) vx = -dash;
      else if (this.cursors.right.isDown) vx = dash;
      else vx = dash;

      this.dashCooldown = 700;

      this.sounds.dash.play();
      this.cameras.main.shake(80, 0.01);
    }

    if (this.dashCooldown > 0) this.dashCooldown -= delta;

    vx *= 0.92;
    vx = Phaser.Math.Clamp(vx, -maxSpeed, maxSpeed);

    this.player.setVelocityX(vx);

    const moving = this.cursors.left.isDown || this.cursors.right.isDown;

    if (moving && isGrounded) {
      this.player.anims.play("walk", true);
    } else {
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    if (this.cursors.left.isDown) this.player.setFlipX(true);
    else if (this.cursors.right.isDown) this.player.setFlipX(false);

    this.signals.forEach((s) => {
      if (s.glow) {
        s.glow.x = s.x;
        s.glow.y = s.y;
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
      const x = Phaser.Math.Between(0, this.worldWidth);
      const y = Phaser.Math.Between(0, 720);

      const drop = this.add.rectangle(x, y, 2, 12, 0x88ccff, 0.25);

      this.tweens.add({
        targets: drop,
        y: 900,
        duration: Phaser.Math.Between(600, 1200),
        repeat: -1,
      });
    }
  }
}