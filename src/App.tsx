import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStage, isColliding } from "./utils/gameHelpers";

// Components
import Stage from "./components/Stage/Stage";
import TetrisDisplay from "./components/Displays/Display";
import CustomButton from "./components/Buttons/CustomButton";
import NextPiecePreview from "./components/Displays/NextPiecePreview";
import ModalPrompt from "./components/Displays/ModalPrompt";
// Hooks
import { useInterval } from "./hooks/useInterval";
import { usePlayer } from "./hooks/usePlayer";
import { useStage } from "./hooks/useStage";
import { useGameStatus } from "./hooks/useGameStatus";
import { useHighScores } from "./hooks/useHighScore";
import { useSwipeable } from "react-swipeable";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "end">(
    "menu"
  );
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameOver, setGameOver] = useState(true);
  const [paused, setPaused] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [newName, setNewName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const touchStartRef = useRef<{ time: number; x: number; y: number } | null>(
    null
  );
  const accelerationTimeoutRef = useRef<number | null>(null);
  const isAcceleratingRef = useRef(false);

  const { scores, loading, updateScores, finalizeScore } = useHighScores();
  const { player, updatePlayerPos, resetPlayer, playerRotate, nextPiece } =
    usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const gameArea = useRef<HTMLDivElement>(null);
  const { rows, setRows, score, setScore, level, setLevel } =
    useGameStatus(rowsCleared);

  // Updates player position(left or right) while checking for colision
  const movePlayer = (dir: number): void => {
    if (!isColliding(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  // Change the drop time speed when user release down arrow
  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    if (!gameOver && !paused && keyCode === 40) {
      setDropTime(1000 / level + 200);
    }
  };

  console.log("Drop Time:", dropTime);

  // Game Start Conditions
  const handleStartGame = (): void => {
    {
      if (gameArea.current) gameArea.current.focus();
      setStage(createStage());
      setDropTime(1200);
      resetPlayer();
      setScore(0);
      setLevel(1);
      setRows(0);
      setGameOver(false);
      setGameState("playing");
    }
  };

  // Pause the game
  const handlePause = (): void => {
    setPaused(!paused);
    if (!paused) {
      setDropTime(null);
    } else {
      setDropTime(1000 / level + 200);
    }
  };

  // Reset the game
  const handleReset = (): void => {
    setStage(createStage());
    resetPlayer();
    setPaused(false);
    setDropTime(1000);
    setPreviousScore(score);
    setScore(0);
    setLevel(1);
    setRows(0);
  };

  // Touch Controls ////////////
  const resetDropTime = useCallback(() => {
    setDropTime(1000 / level + 200);
  }, [level]);

  const accelerateDropTime = useCallback(() => {
    setDropTime(60);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (gameOver || paused) return;

      const touch = e.touches[0];
      touchStartRef.current = {
        time: e.timeStamp,
        x: touch.clientX,
        y: touch.clientY,
      };
      accelerationTimeoutRef.current = setTimeout(() => {
        isAcceleratingRef.current = true;
        accelerateDropTime();
      }, 500); // Reduced to 500ms for faster response
    },
    [gameOver, paused, accelerateDropTime]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (gameOver || paused || !touchStartRef.current) return;

      if (accelerationTimeoutRef.current) {
        clearTimeout(accelerationTimeoutRef.current);
      }

      const touchEnd = e.changedTouches[0];
      const touchDuration = e.timeStamp - touchStartRef.current.time;
      const touchDistance = Math.sqrt(
        Math.pow(touchEnd.clientX - touchStartRef.current.x, 2) +
          Math.pow(touchEnd.clientY - touchStartRef.current.y, 2)
      );

      if (isAcceleratingRef.current) {
        isAcceleratingRef.current = false;
        resetDropTime();
      } else if (touchDuration < 200 && touchDistance < 10) {
        // Short tap with minimal movement, trigger rotation
        playerRotate(stage);
      }

      touchStartRef.current = null;
    },
    [gameOver, paused, resetDropTime, playerRotate, stage]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!gameOver && !paused) movePlayer(-1);
    },
    onSwipedRight: () => {
      if (!gameOver && !paused) movePlayer(1);
    },
    
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
    delta: 60,
  });

  useEffect(() => {
    return () => {
      if (accelerationTimeoutRef.current) {
        clearTimeout(accelerationTimeoutRef.current);
      }
      setDropTime(1000 / level + 200);
    };
  }, [resetDropTime]);
  ///////////////////////////
  // Keyboard Controls
  const actions = ({
    keyCode,
    repeat,
  }: {
    keyCode: number;
    repeat: boolean;
  }): void => {
    if (!gameOver && !paused) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        // Just call once
        if (repeat) return;
        setDropTime(30);
      } else if (keyCode === 38) {
        // Player Rotate
        playerRotate(stage);
      }
    }
  };

  // Piece Movement / Drop Speed / Game Over condition
  const drop = (): void => {
    // Increase level when player has cleared 10 rows
    if (rows > level * 10) {
      setLevel((prev) => prev + 1);
      // Increase speed
      setDropTime(1000 / level + 200);
    }

    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log("Game Over!!!");
        endGame();
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  // End Game conditions
  const endGame = () => {
    setOpenModal(true);
    setGameOver(true);
    setPreviousScore(score);
    setDropTime(null);
    setGameState("end");
  };

  // Submit the score to the local storage and reset the game
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      finalizeScore(newName.slice(0.3).toUpperCase());
      setOpenModal(false);
      setGameState("menu");
    }
    setOpenModal(false);
    setGameState("menu");
  };

  // Updates the highscore while the game is playing
  useEffect(() => {
    if (gameState === "playing") {
      updateScores(score);
    }
  }, [score, gameState, updateScores]);

  //Game Loop
  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div
      className="w-full h-screen overflow-auto outline-none "
      tabIndex={0}
      onKeyDown={actions}
      onKeyUp={keyUp}
      ref={gameArea}
    >
      <div className="flex flex-col sm:flex-row justify-center sm:items-start items-center p-8 sm:p-16">
        <div {...handlers} className="sm:mr-8">
          <div className="flex justify-between items-center">
            {gameOver ? (
              <div className="flex flex-grow items-center justify-center mx-auto pb-3">
                <CustomButton
                  className="grow h-14 text-3xl"
                  onClick={handleStartGame}
                  text="Play"
                  color="#00b894"
                  icontype="play"
                  iconColor="white"
                />
              </div>
            ) : (
              <div className="flex flex-grow gap-8 justify-between items-center mx-2 pb-3">
                <CustomButton
                  className="grow h-14 text-2xl"
                  onClick={handlePause}
                  color={paused ? "#00b894" : "#fdcb6e"}
                  icontype={paused ? "play" : "pause"}
                  text={`${paused ? "Resume" : "Pause"}`}
                  iconColor="white"
                ></CustomButton>
                <CustomButton
                  className="grow h-14 text-2xl"
                  onClick={handleReset}
                  color="#d63031"
                  text="Reset"
                  iconColor="white"
                  type="reset"
                >
                  Reset
                </CustomButton>
              </div>
            )}
          </div>
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex flex-col sm:flex-row justify-center items-center"
            style={{ userSelect: "none", touchAction: "none" }}
          >
            <Stage stage={stage} />
          </div>
        </div>

        <div className="flex sm:flex-col ">
          <div className="">
            <NextPiecePreview
              nextPiece={nextPiece}
              isShowing={gameOver ? false : true}
            />
          </div>
          <div className="sm:flex-col flex-wrap items-center justify-center hidden sm:flex">
            <TetrisDisplay
              currentScore={score}
              previousScore={previousScore}
              currentRows={rows}
              currentLevel={level}
              highScores={scores}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
      {gameState === "end" && score > scores[4].score && (
        <ModalPrompt
          isOpen={openModal}
          currentScore={score}
          newName={newName}
          onNameChange={setNewName}
          onSubmit={handleNameSubmit}
        />
      )}
    </div>
  );
};

export default App;
