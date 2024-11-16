import { TETROMINOS } from "../../utils/initial";
import Cell from "../Cell/Cell";

type Props = {
  nextPiece: {
    type: keyof typeof TETROMINOS;
    shape: (string | number)[][];
  };
  isShowing: boolean;
};

export default function NextPiecePreview({ nextPiece, isShowing }: Props) {
  // Create a 4x4 grid filled with empty cells
  const previewGrid = Array(4).fill(Array(4).fill([0, "clear"]));

  // Calculate offsets to center the piece
  const yOffset = Math.floor((4 - nextPiece.shape.length) / 2);
  const xOffset = Math.floor((4 - nextPiece.shape[0].length) / 2);

  // Place the piece in the center of the grid
  const filledGrid = previewGrid.map((row, y) =>
    row.map((cell: [string, string], x: number) => {
      if (
        y >= yOffset &&
        y < yOffset + nextPiece.shape.length &&
        x >= xOffset &&
        x < xOffset + nextPiece.shape[0].length &&
        nextPiece.shape[y - yOffset][x - xOffset] !== 0
      ) {
        return [nextPiece.type, "clear"];
      }
      return cell;
    })
  );

  return (
    // <div className="">
    //
    <div className="flex flex-col w-48 items-center bg-gray-900 p-2 rounded-lg mb-4 mx-auto ">
      <h3 className="text-center font-mono text-xl text-blue-400 font-bold">
        NEXT
      </h3>
      <div className="bg-gray-800 p-3 rounded-lg mb-2">
        <div
          className="grid gap-[1px] border-2 rounded-md border-blue-400 bg-slate-950 "
          style={{
            gridTemplateColumns: "repeat(4, 20px)",
            gridTemplateRows: "repeat(4, 20px)",
          }}
        >
          {isShowing ? (
            <>
              {filledGrid.map((row, y) =>
                row.map((cell: [string, string], x: number) => (
                  <Cell
                    key={`${y}-${x}`}
                    type={cell[0] as keyof typeof TETROMINOS}
                  />
                ))
              )}
            </>
          ) : (
            <>
              {filledGrid.map((row, _) =>
                row.map((_: any, x: number) => (
                  <Cell key={`${row}-${x}`} type={0} />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
