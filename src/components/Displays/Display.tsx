import { motion } from "framer-motion";
import { Score } from "../../hooks/useHighScore";

interface TetrisDisplayProps {
  currentScore: number;
  currentRows: number;
  currentLevel: number;
  previousScore: number;
  highScores: Score[];
  isLoading: boolean;
}

export default function TetrisDisplay({
  currentScore = 0,
  currentRows = 0,
  currentLevel = 1,
  previousScore = 0,
  highScores = [],
  isLoading = false,
}: TetrisDisplayProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto font-mono text-center">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-sm text-blue-400 mb-2">SCORE</h3>
          <motion.p
            className="text-2xl text-yellow-400"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {currentScore.toString().padStart(6, "0")}
          </motion.p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-sm text-blue-400 mb-2">PREVIOUS</h3>
          <p className="text-2xl text-orange-400">
            {previousScore.toString().padStart(6, "0")}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-sm text-blue-400 mb-2">LEVEL</h3>
          <p className="text-2xl text-red-400">
            {currentLevel.toString().padStart(2, "0")}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-sm text-blue-400 mb-2">ROWS</h3>
          <p className="text-2xl text-green-400">
            {currentRows.toString().padStart(3, "0")}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-xl text-blue-400 mb-4">HIGH SCORES</h3>
        {isLoading ? (
          <p className="text-white">Loading high scores...</p>
        ) : (
          <ul>
            {highScores.map((score, index) => (
              <motion.li
                key={index}
                className={`flex justify-between mb-2 ${
                  score.name === "YOU" ? "text-green-400" : "text-pink-400"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span>{score.name}</span>
                <span>{score.score.toString().padStart(6, "0")}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
