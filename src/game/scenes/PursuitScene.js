import Phaser from "phaser";

export default class PursuitScene extends Phaser.Scene {
  constructor() {
    super("PursuitScene");
  }

  create() {
    //  WORLD

    this.cameras.main.setBackgroundColor("#050510");

    this.worldW = 1400;
    this.worldH = 800;

    this.physics.world.setBounds(0, 0, this.worldW, this.worldH);
    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);

    // skyline
    this.add.rectangle(640, 200, 1400, 300, 0x0a0a1a);
    this.add.rectangle(640, 500, 1400, 400, 0x050514);

    //  SOUND
    this.jumpSfx = this.sound.add("jump", { volume: 0.5 });
    this.captureSfx = this.sound.add("capture", { volume: 0.7 });

    this.music = this.sound.add("gotham", {
      loop: true,
      volume: 0.7,
    });

    this.music.play();

    // stop music when scene ends
    this.events.on("shutdown", () => {
  if (this.music) this.music.stop();
});

    // MOVING PLATFORMS
    this.platforms = this.physics.add.staticGroup();

    const platformData = [
      { x: 700, y: 710, w: 1400 },
      { x: 400, y: 520, w: 300 },
      { x: 900, y: 380, w: 250 },
      { x: 250, y: 350, w: 220 },
      { x: 1100, y: 520, w: 260 },
    ];

    this.movingPlatforms = [];

    platformData.forEach((p, i) => {
      const platform = this.add.rectangle(p.x, p.y, p.w, 20, 0x222222);
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);

      // only some platforms move
      if (i % 2 === 1) {
        platform.startX = p.x;
        platform.speed = 0.5 + Math.random() * 0.8;
        platform.range = 80 + Math.random() * 60;
        this.movingPlatforms.push(platform);
      }
    });

    //  PLAYER
    this.player = this.physics.add.sprite(100, 600, "batman");

    this.player.setDisplaySize(50, 70);
    this.player.setCollideWorldBounds(true);

    this.player.body.setGravityY(750);
    this.player.setDragX(900);
    this.player.setBounce(0.12);

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    //  TARGETS (RANDOM SPEED PATROL)
    this.targets = [];

    const targetData = [
      { x: 1100, y: 300 },
      { x: 600, y: 250 },
      { x: 950, y: 450 },
    ];

    targetData.forEach((pos) => {
      const target = this.physics.add.sprite(pos.x, pos.y, null);

      target.setCircle(20);
      target.body.setAllowGravity(false);
      target.setImmovable(true);

      // base patrol setup
      target.direction = Math.random() > 0.5 ? 1 : -1;
      target.baseSpeed = 120 + Math.random() * 80;
      target.speed = target.baseSpeed;

      target.minX = pos.x - 160;
      target.maxX = pos.x + 160;

      // randomness timer
      target.changeTimer = Phaser.Math.Between(60, 140);

      const glow = this.add.circle(pos.x, pos.y, 40, 0xff0033, 0.15);

      this.tweens.add({
        targets: glow,
        scale: 1.3,
        alpha: 0.05,
        duration: 600,
        yoyo: true,
        repeat: -1,
      });

      target.glow = glow;

      this.targets.push(target);

      this.physics.add.overlap(this.player, target, () => {
        if (!target.active) return;

        target.destroy();
        glow.destroy();

        this.captureSfx.play();

        this.targets = this.targets.filter((t) => t.active);

        if (this.targets.length === 0) {
          this.winLevel();
        }
      });
    });

    //  CAMERA
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.05);
    this.cameras.main.setLerp(0.08, 0.08);
  }

  update() {
    const speed = 260;

    //  PLAYER
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(-720);
      this.jumpSfx.play();
      this.cameras.main.shake(100, 0.003);
    }

    
    // MOVING PLATFORMS UPDATE
    this.movingPlatforms.forEach((p) => {
      p.x += Math.sin(this.time.now * 0.001 * p.speed) * 1.2;
      p.body.updateFromGameObject();
    });

    // TARGET MOVEMENT (RANDOM SPEED)
  
    this.targets.forEach((t) => {
      if (!t.active) return;

      // patrol movement
      t.setVelocityX(t.speed * t.direction);

      if (t.x <= t.minX) t.direction = 1;
      if (t.x >= t.maxX) t.direction = -1;

      //  RANDOM SPEED CHANGE (key feature)
      t.changeTimer--;

      if (t.changeTimer <= 0) {
        t.speed = t.baseSpeed * (0.5 + Math.random() * 1.8);
        t.changeTimer = Phaser.Math.Between(80, 160);

        // sometimes reverse suddenly (adds unpredictability)
        if (Math.random() < 0.3) {
          t.direction *= -1;
        }
      }

      // sync glow
      if (t.glow) {
        t.glow.x = t.x;
        t.glow.y = t.y;
      }
    });
  }


  //WIN
  
  winLevel() {
    this.physics.pause();

    this.cameras.main.flash(500, 0, 255, 120);

    this.add
      .text(640, 360, "ALL TARGETS CAPTURED", {
        fontSize: "42px",
        color: "#00ff99",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.captureSfx.play();
    this.music.stop();

    this.time.delayedCall(2500, () => {
      this.scene.start("FinalLevelScene");
    });
  }
}