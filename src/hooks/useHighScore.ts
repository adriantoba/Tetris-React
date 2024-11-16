import { useState, useEffect, useCallback } from "react";

export interface Score {
  name: string;
  score: number;
}

const STORAGE_KEY = "tetrisHighScores";

export function useHighScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedScores = localStorage.getItem(STORAGE_KEY);
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    } else {
      const sampleScores: Score[] = [
        { name: "AI", score: 10000 },
        { name: "AI", score: 9000 },
        { name: "AI", score: 8000 },
        { name: "AI", score: 7000 },
        { name: "AI", score: 6000 },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleScores));
    }
    setLoading(false);
  }, []);

  const updateScores = useCallback((newScore: number) => {
    setScores((prevScores) => {
      const updatedScores = [...prevScores];
      const playerIndex = updatedScores.findIndex(
        (score) => score.name === "YOU"
      );

      if (playerIndex !== -1) {
        if (updatedScores[playerIndex].score !== newScore) {
          updatedScores[playerIndex].score = newScore;
        } else {
          return prevScores; // No change, return previous state
        }
      } else {
        updatedScores.push({ name: "YOU", score: newScore });
      }

      updatedScores.sort((a, b) => b.score - a.score);
      return updatedScores.slice(0, 6); // Keep top 5 plus potentially 'YOU'
    });
  }, []);

  const finalizeScore = (playerName: string) => {
    const finalScores = scores
      .map((score) =>
        score.name === "YOU" ? { name: playerName, score: score.score } : score
      )
      .slice(0, 5); // Keep only top 5 after finalizing
    setScores(finalScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalScores));
  };

  return { scores, loading, updateScores, finalizeScore };
}
