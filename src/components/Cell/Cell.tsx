import React from "react";
import { TETROMINOS } from "../../utils/initial";

type Props = {
  type: 0 | keyof typeof TETROMINOS;
};

const Cell: React.FC<Props> = ({ type }) => {
  const color = TETROMINOS[type].color;
  return (
    <div
      className={`w-auto border-4 border-solid `}
      style={{
        background: `rgba(${color}, 0.8)`,
        borderBottomColor: `rgba(${color}, 0.1)`,
        borderRightColor: `rgba(${color}, 1)`,
        borderTopColor: `rgba(${color}, 1)`,
        borderLeftColor: `rgba(${color}, 0.3)`,
        borderRadius: "6px",
      }}
    ></div>
  );
};

export default React.memo(Cell);
