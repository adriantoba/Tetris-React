export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;
export const ROWPOINTS = [40, 100, 300, 1200];

export const TETROMINOS = {
  0: { shape: [[0]], color: "24,24,27" },
  I: {
    shape: [
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
    ],
    color: "70, 211, 211",
  },
  J: {
    shape: [
      [0, 0, "J", 0],
      [0, 0, "J", 0],
      [0, "J", "J", 0],
    ],
    color: "72, 93, 197",
  },
  L: {
    shape: [
      [0, "L", 0, 0],
      [0, "L", 0, 0],
      [0, "L", "L", 0],
    ],
    color: "234, 72, 25",
  },
  O: {
    shape: [
      ["O", "O"],
      ["O", "O"],
    ],
    color: "255, 200, 46",
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, "S", "S", 0],
      ["S", "S", 0, 0],
      [0, 0, 0, 0],
    ],
    color: "73, 181, 60",
  },
  T: {
    shape: [
      [0, 0, 0],
      ["T", "T", "T"],
      [0, "T", 0],
    ],
    color: "158, 47, 146",
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      ["Z", "Z", 0, 0],
      [0, "Z", "Z", 0],
      [0, 0, 0, 0],
    ],
    color: "253, 63, 89",
  },
};
