import { useEffect, useState } from "react";
import { ROWPOINTS } from "../utils/initial";

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (rowsCleared > 0) {
      //Original tetris score system
      setScore((prev) => prev + ROWPOINTS[rowsCleared - 1] * level);
      setRows((prev) => prev + rowsCleared);
    }
  }, [rowsCleared]);
  return { score, setScore, rows, setRows, level, setLevel };
};
