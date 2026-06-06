import { useEffect, useRef } from "react";
import Phaser from "phaser";
import config from "./config";

export default function Game() {
  const gameRef = useRef(null);

  useEffect(() => {
    const startGame = () => {
      if (!gameRef.current) {
        gameRef.current = new Phaser.Game({
          ...config,
          parent: "game-container",
        });
      }
    };

    // wait for DOM to exist
    setTimeout(startGame, 0);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      id="game-container"
   //  style={{ width: "100vw", height: "100vh" }}
    />
  );
}