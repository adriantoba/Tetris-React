import { STAGE_WIDTH } from "../utils/initial";
import { isColliding, randomTetromino } from "../utils/gameHelpers";
import { useCallback, useState } from "react";
import { STAGE } from "../components/Stage/Stage";

export type PLAYER = {
  pos: { x: number; y: number };
  tetromino: (string | number)[][];
  collided: boolean;
};

export const usePlayer = () => {
  const [player, setPlayer] = useState({} as PLAYER);
  const [nextPiece, setNextPiece] = useState(randomTetromino());

  const rotate = (matrix: PLAYER["tetromino"]) => {
    //Make the rows become cols (transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    //Reverse each row to get a rotated matrix
    return rotatedTetro.map((row) => row.reverse());
  };

  const playerRotate = (stage: STAGE): void => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);
    //Check collision so that the player can't roate intot he wall or other tetrominos
    const posX = clonedPlayer.pos.x;
    let offset = 1;
    while (isColliding(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        clonedPlayer.pos.x = posX;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }): void => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };
  const resetPlayer = useCallback((): void => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: nextPiece.shape,
      collided: false,
    });
    setNextPiece(randomTetromino());
  }, [nextPiece]);

  return { player, updatePlayerPos, resetPlayer, playerRotate, nextPiece };
};
