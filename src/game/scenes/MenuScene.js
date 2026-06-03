import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
   
    this.cameras.main.setBackgroundColor("#050510");  // background

    // fade effect
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    // rain effect
    this.createRain();

    // main title
    const title = this.add.text(
      640,
      180,
      "GOTHAM: NIGHT PROTOCOL",
      {
        fontSize: "42px",
        color: "#00BFFF",
        fontFamily: "monospace",
        letterSpacing: 4,
      }
    ).setOrigin(0.5);

    // glitch effect
    this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => {
        title.setAlpha(
          Phaser.Math.FloatBetween(0.7, 1)
        );
      },
    });

    // typing text
    this.typingText = this.add.text(
      640,
      320,
      "",
      {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "monospace",
        align: "center",
      }
    ).setOrigin(0.5);

    const message =
      "ACCESSING GOTHAM MAINFRAME...\n\n" +
      "SCANNING SUBJECT PROFILE...\n" +
      "DISCIPLINE DETECTED.\n" +
      "RESILIENCE DETECTED.\n" +
      "WELCOME BACK.";

    this.typeText(message);


    this.startText = this.add.text(
      640,
      580,
      "[ PRESS ENTER ]",
      {
        fontSize: "30px",
        color: "#00BFFF",
        fontFamily: "monospace",
      }
    )
    .setOrigin(0.5)
    .setAlpha(0);

    // blinking animation
    this.tweens.add({
      targets: this.startText,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // delay showing enter bttn
    this.time.delayedCall(5000, () => {
      this.startText.setAlpha(1);
    });

    // ENTER key
    this.input.keyboard.once("keydown-ENTER", () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);

      this.time.delayedCall(1000, () => {
        this.scene.start("RooftopScene");
      });
    });
  }

  // typing animation
  typeText(text) {
    let i = 0;

    this.time.addEvent({
      delay: 45,
      repeat: text.length - 1,
      callback: () => {
        this.typingText.text += text[i];
        i++;
      },
    });
  }

  // rain effect
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
        0.4
      );

      this.tweens.add({
        targets: drop,
        y: 900,
        duration: Phaser.Math.Between(700, 1400),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }
}