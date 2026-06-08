import Phaser from "phaser";

export default class DetectiveScene extends Phaser.Scene {
  constructor() {
    super("DetectiveScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000");

    // sounds

    this.music = this.sound.add("background2", {
      loop: false,
      volume: 0.4,
    });

    this.music.play();
    this.clickSfx = this.sound.add("click");
    this.correctSfx = this.sound.add("correct");
    this.wrongSfx = this.sound.add("wrong");
    this.glitchSfx = this.sound.add("glitch");

    //  title
    this.title = this.add.text(640, 80, "", {
      fontSize: "26px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    // typing animation
    const titleText = "BATCOMPUTER: INVESTIGATION MODE";
    this.typeText(this.title, titleText, 40);

    // case text
    this.caseText = this.add.text(640, 140, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.typeText(this.caseText, "CASE FILE #447 — ANALYZING CRIME SCENE...", 20);

    // clues
    const clues = [
      { text: "Bloody Knife", correct: true },
      { text: "Protein Shake", correct: false },
      { text: "Joker Card", correct: false },
    ];

    this.resultText = this.add.text(640, 520, "", {
      fontSize: "22px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    // create clue buttons
    clues.forEach((clue, i) => {
      const x = 320 + i * 280;
      const y = 320;

      const btn = this.add.text(x, y, clue.text, {
        fontSize: "18px",
        color: "#fff",
        backgroundColor: "#111",
        padding: { x: 12, y: 8 },
        fontFamily: "monospace",
      })
      .setInteractive()
      .setOrigin(0.5);

      // hover glow
      btn.on("pointerover", () => {
        btn.setStyle({ backgroundColor: "#222" });
      });

      btn.on("pointerout", () => {
        btn.setStyle({ backgroundColor: "#111" });
      });

      btn.on("pointerdown", () => {
        this.clickSfx.play();

        //  zoom effect
        this.tweens.add({
          targets: btn,
          scale: 1.2,
          duration: 100,
          yoyo: true,
        });

        if (clue.correct) {
          this.handleCorrect();
        } else {
          this.handleWrong();
        }
      });
    });
  }

  // typing effect function
  typeText(textObj, fullText, speed) {
    let i = 0;

    this.time.addEvent({
      delay: speed,
      repeat: fullText.length - 1,
      callback: () => {
        textObj.setText(fullText.substring(0, i + 1));
        i++;
      },
    });
  }

  handleCorrect() {
    this.correctSfx.play();

    this.resultText.setText("ACCESS GRANTED ✔");

    // glitch + flash
    this.glitchSfx.play();
    this.cameras.main.flash(300, 0, 255, 120);
    this.cameras.main.shake(200, 0.01);

    this.time.delayedCall(1500, () => {
      this.scene.start("PursuitScene");
    });
  }

  handleWrong() {
    this.wrongSfx.play();

    this.resultText.setText("INCORRECT EVIDENCE");

    this.cameras.main.flash(200, 255, 0, 0);
    this.cameras.main.shake(150, 0.01);
  }
}