import React from "react";
import Cell from "../Cell/Cell";
import { TETROMINOS } from "../../utils/initial";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../utils/initial";

export type STAGECELL = [keyof typeof TETROMINOS, string];
export type STAGE = STAGECELL[][];

type Props = {
  stage: STAGE;
};

const Stage: React.FC<Props> = ({ stage }) => (
  <div
    className="grid gap-[1px] border-[8px] border-[#00cec9] border-opacity-90 bg-gray-950 rounded-2xl"
    style={{
      gridTemplateColumns: `repeat(${STAGE_WIDTH}, minmax(30px, 1fr))`,
      gridTemplateRows: `repeat(${STAGE_HEIGHT}, minmax(30px, 1fr))`,
    }}
  >
    {stage.map((row, y) =>
      row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
    )}
  </div>
);

export default Stage;
