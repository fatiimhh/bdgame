import Phaser from "phaser";

export default class DetectiveScene extends Phaser.Scene {
  constructor() {
    super("DetectiveScene");
  }

  create() {

    //  background
    this.cameras.main.setBackgroundColor("#000000");

    //  music
    this.music = this.sound.add("background2", {
      loop: true,
      volume: 0.35,
    });

    this.music.play();

    //  sound effects
    this.clickSfx = this.sound.add("click");
    this.correctSfx = this.sound.add("correct");
    this.wrongSfx = this.sound.add("wrong");
    this.glitchSfx = this.sound.add("glitch");

    //correct investigation order
    this.correctSequence = [
      "Footprints",
      "Security Camera",
      "Blood Trail",
    ];

    this.playerSequence = [];

    // title
    this.title = this.add.text(640, 60, "", {
      fontSize: "28px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.typeText(
      this.title,
      "BATCOMPUTER — CRIME SCENE ANALYSIS",
      35
    );

    //  case file text
    this.caseText = this.add.text(640, 110, "", {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.typeText(
      this.caseText,
      "CASE FILE #447 — RECONSTRUCT THE EVENTS",
      18
    );

    // instruction
    this.instructionText = this.add.text(
      640,
      160,
      "SELECT THE CORRECT EVIDENCE IN ORDER",
      {
        fontSize: "18px",
        color: "#00bfff",
        fontFamily: "monospace",
      }
    ).setOrigin(0.5);

    // analysis panel
    this.analysisBox = this.add.rectangle(
      640,
      600,
      1000,
      100,
      0x0a0a0a,
      0.9
    );

    this.analysisText = this.add.text(640, 600, "", {
      fontSize: "18px",
      color: "#00ffcc",
      fontFamily: "monospace",
      align: "center",
      wordWrap: { width: 900 },
    }).setOrigin(0.5);

    //  progress
    this.progressText = this.add.text(640, 220, "", {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.updateProgress();

    //  clues
    const clues = [
      {
        name: "Footprints",
        description:
          "Heavy combat boots. Subject moved quickly through the alley.",
      },

      {
        name: "Gym Bag",
        description:
          "Contains workout gear. Irrelevant to the attack timeline.",
      },

      {
        name: "Security Camera",
        description:
          "Camera manually disabled 3 minutes before incident.",
      },

      {
        name: "Joker Card",
        description:
          "Classic distraction tactic. Doesn't match evidence pattern.",
      },

      {
        name: "Blood Trail",
        description:
          "Fresh blood leading toward rooftop exit.",
      },
    ];

    // clue layout
    clues.forEach((clue, index) => {

      const row = Math.floor(index / 3);
      const col = index % 3;

      const x = 320 + col * 320;
      const y = 320 + row * 120;

      const clueBox = this.add.rectangle(
        x,
        y,
        220,
        70,
        0x111111
      )
      .setStrokeStyle(2, 0x00bfff)
      .setInteractive();

      const clueText = this.add.text(x, y, clue.name, {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "monospace",
      }).setOrigin(0.5);

      // ✨ hover effect
      clueBox.on("pointerover", () => {

        clueBox.setFillStyle(0x1a1a1a);

        this.analysisText.setText(
          `> ${clue.description}`
        );
      });

      clueBox.on("pointerout", () => {

        clueBox.setFillStyle(0x111111);

        this.analysisText.setText("");
      });

      //  clue selected
      clueBox.on("pointerdown", () => {

        this.clickSfx.play();

        // click animation
        this.tweens.add({
          targets: clueBox,
          scaleX: 1.08,
          scaleY: 1.08,
          duration: 80,
          yoyo: true,
        });

        this.checkClue(clue, clueBox, clueText);
      });
    });
  }

  //  CHECK CLUE ORDER
  checkClue(clue, clueBox, clueText) {

    const expected =
      this.correctSequence[this.playerSequence.length];

    //  correct clue
    if (clue.name === expected) {

      this.correctSfx.play();

      this.playerSequence.push(clue.name);

      clueBox.setFillStyle(0x003322);
      clueBox.disableInteractive();

      clueText.setColor("#00ff99");

      this.analysisText.setText(
        `MATCH CONFIRMED: ${clue.description}`
      );

      this.updateProgress();

      this.cameras.main.flash(120, 0, 255, 120);

      //  completed sequence
      if (
        this.playerSequence.length ===
        this.correctSequence.length
      ) {

        this.completeInvestigation();
      }
    }

    // wrong clue
    else {

      this.wrongSfx.play();

      this.playerSequence = [];

      this.updateProgress();

      this.analysisText.setText(
        "ERROR: EVIDENCE SEQUENCE CORRUPTED"
      );

      this.cameras.main.flash(180, 255, 0, 0);

      this.cameras.main.shake(200, 0.01);

      // reset clue visuals
      this.time.delayedCall(400, () => {

        this.children.list.forEach((child) => {

          if (child.type === "Rectangle") {

            child.setFillStyle(0x111111);

            if (child.input) {
              child.setInteractive();
            }
          }
        });

        this.children.list.forEach((child) => {

          if (child.type === "Text") {

            if (
              child.text === "Footprints" ||
              child.text === "Gym Bag" ||
              child.text === "Security Camera" ||
              child.text === "Joker Card" ||
              child.text === "Blood Trail"
            ) {
              child.setColor("#ffffff");
            }
          }
        });
      });
    }
  }

  //  progress UI
  updateProgress() {

    this.progressText.setText(
      `INVESTIGATION PROGRESS: ${this.playerSequence.length} / ${this.correctSequence.length}`
    );
  }

  // SUCCESS
  completeInvestigation() {

    this.glitchSfx.play();

    this.music.stop();

    this.cameras.main.flash(500, 0, 255, 120);

    this.add.text(640, 470, "CASE RECONSTRUCTED ✔", {
      fontSize: "32px",
      color: "#00ff99",
      fontFamily: "monospace",
    }).setOrigin(0.5);

    this.analysisText.setText(
      "SUSPECT LOCATION IDENTIFIED — INITIATING PURSUIT"
    );

    this.time.delayedCall(2500, () => {

      this.scene.start("PursuitScene");

    });
  }

  // typing effect
  typeText(textObj, fullText, speed) {

    let i = 0;

    this.time.addEvent({
      delay: speed,
      repeat: fullText.length - 1,
      callback: () => {

        textObj.setText(
          fullText.substring(0, i + 1)
        );

        i++;
      },
    });
  }
}