import Phaser from "phaser";

export default class FinalLevelScene extends Phaser.Scene {
  constructor() {
    super("FinalLevelScene");
  }

  create() {

    //  Gotham atmosphere

    this.cameras.main.setBackgroundColor("#04040a");

    this.add.rectangle(640, 180, 1400, 260, 0x0a0a1a);
    this.add.rectangle(640, 500, 1400, 420, 0x050514);

    this.createRain();


    // SOUNDS
    this.hitSfx = this.sound.add("hit", { volume: 0.5 });

    this.music = this.sound.add("gotham", {
      loop: true,
      volume: 0.4,
    });

    this.music.play();

    this.events.on("shutdown", () => { // stop music when scene ends
  if (this.music) this.music.stop();
});


    //  BAT SIGNAL 

    
    // glow behind image
    this.batSignalGlow = this.add.circle(640, 360, 90, 0xffff99, 0.12);

    this.tweens.add({
      targets: this.batSignalGlow,
      scale: 1.3,
      alpha: 0.03,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    // bat signal image
    this.batSignal = this.physics.add.sprite(640, 360, "batSignal");

    this.batSignal.setScale(0.18);
    this.batSignal.body.setAllowGravity(false);
    this.batSignal.body.setImmovable(true);

    //  pulse animation on image
    this.tweens.add({
      targets: this.batSignal,
      scale: { from: 0.18, to: 0.2 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });


    //  PLAYER
    this.player = this.physics.add.sprite(640, 620, "batman");
    this.player.setDisplaySize(50, 70);
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);

    this.cursors = this.input.keyboard.createCursorKeys();

    // ENEMIES
    this.enemies = this.physics.add.group();

    this.signalHealth = 5;

    //  TIMER
    this.timeLeft = 35;

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

    this.enemySpawner = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => {
        this.spawnEnemy();
      },
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      repeat: 34,
      callback: () => {
        this.timeLeft--;
        this.updateUI();

        if (this.timeLeft <= 0) {
          this.winLevel();
        }
      },
    });

    
    //  COLLISIONS
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      enemy.glow?.destroy();
      enemy.destroy();

      this.cameras.main.flash(100, 0, 255, 120);
    });

    this.introText = this.add
      .text(640, 90, "DEFEND THE BAT SIGNAL", {
        fontSize: "28px",
        color: "#00bfff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
  }

  update() {
    const speed = 320;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) vx = -speed;
    if (this.cursors.right.isDown) vx = speed;
    if (this.cursors.up.isDown) vy = -speed;
    if (this.cursors.down.isDown) vy = speed;

    this.player.setVelocity(vx, vy);

    //  ENEMY AI
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.glow) {
        enemy.glow.x = enemy.x;
        enemy.glow.y = enemy.y;
      }

      enemy.setAlpha(Phaser.Math.FloatBetween(0.85, 1));

      this.physics.moveToObject(enemy, this.batSignal, 110);

      const dist = Phaser.Math.Distance.Between(
        enemy.x,
        enemy.y,
        this.batSignal.x,
        this.batSignal.y
      );

      if (dist < 70) {
        enemy.glow?.destroy();
        enemy.destroy();

        this.signalHealth--;
        this.updateUI();

        this.hitSfx.play();

        this.cameras.main.shake(200, 0.01);
        this.cameras.main.flash(150, 255, 0, 0);

        if (this.signalHealth <= 0) {
          this.gameOver();
        }
      }
    });
  }

  //  ENEMY SPAWN
  spawnEnemy() {
    const positions = [
      { x: 0, y: Phaser.Math.Between(0, 720) },
      { x: 1280, y: Phaser.Math.Between(0, 720) },
      { x: Phaser.Math.Between(0, 1280), y: 0 },
      { x: Phaser.Math.Between(0, 1280), y: 720 },
    ];

    const spawn = Phaser.Utils.Array.GetRandom(positions);

    const glow = this.add.circle(spawn.x, spawn.y, 28, 0xff0000, 0.15);
    const enemy = this.add.circle(spawn.x, spawn.y, 16, 0xff0000, 1);

    this.physics.add.existing(enemy);

    enemy.glow = glow;

    this.enemies.add(enemy);

    this.tweens.add({
      targets: glow,
      alpha: 0.05,
      scale: 1.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }

  //  UI
  updateUI() {
    this.healthText.setText(`BAT SIGNAL: ${this.signalHealth}`);
    this.timerText.setText(`SURVIVE: ${this.timeLeft}`);
  }

  //  WIN
  winLevel() {
    this.physics.pause();
    this.enemySpawner.remove();

    this.music.stop();
    this.sound.play("capture");

    this.cameras.main.flash(700, 255, 255, 255);

    this.add
      .text(640, 360, "GOTHAM PROTECTED ✔", {
        fontSize: "40px",
        color: "#00ff99",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      this.scene.start("EndingScene");
    });
  }

  //  GAME OVER
  gameOver() {
    this.physics.pause();
    this.enemySpawner.remove();

    this.cameras.main.shake(500, 0.02);

    this.add
      .text(640, 360, "BAT SIGNAL DESTROYED", {
        fontSize: "40px",
        color: "#ff0033",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.time.delayedCall(2500, () => {
      this.scene.restart();
    });
  }

  //  RAIN
  createRain() {
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(0, 720);

      const drop = this.add.rectangle(x, y, 2, 12, 0x88ccff, 0.25);

      this.tweens.add({
        targets: drop,
        y: 800,
        duration: Phaser.Math.Between(700, 1200),
        repeat: -1,
      });
    }
  }
}