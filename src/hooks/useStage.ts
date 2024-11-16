import { useEffect, useState } from "react";
import { createStage } from "../utils/gameHelpers";
import type { PLAYER } from "./usePlayer";
import type { STAGE, STAGECELL } from "../components/Stage/Stage";

export const useStage = (player: PLAYER, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    if (!player.pos) return;

    setRowsCleared(0);

    const sweepRows = (newStage: STAGE): STAGE => {
      return newStage.reduce((acc, row) => {
        //If there is no 0 in the row, it means that it's full
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          //Add a new row at the top of the stage to push down the tetrominos
          //instead of returning the cleared row
          acc.unshift(
            new Array(newStage[0].length).fill([0, "clear"]) as STAGECELL[]
          );
          return acc;
        }
        acc.push(row);
        return acc;
      }, [] as STAGE);
    };

    const updateStage = (prevStage: STAGE): STAGE => {
      // First flush the stage
      //If it say "clean" but don't have 0 it means that the players move and it should be celared
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === "clear" ? [0, "clear"] : cell
          ) as STAGECELL[]
      );

      // Then draw the tetromino

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value as any,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });

      // Then check if we collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [
    player.collided,
    player.pos?.x,
    player.pos?.y,
    player.tetromino,
    resetPlayer,
  ]);

  return { stage, setStage, rowsCleared };
};
