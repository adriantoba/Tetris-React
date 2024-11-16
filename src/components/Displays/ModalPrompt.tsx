import React from "react";

interface ModalPromptProps {
  isOpen: boolean;
  currentScore: number;
  newName: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ModalPrompt({
  isOpen,
  currentScore,
  newName,
  onNameChange,
  onSubmit,
}: ModalPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-2xl font-bold mb-4 text-purple-500">
          Congratulations!
        </h2>
        <p className="text-white mb-4">
          You have a new High Score: {currentScore}
        </p>
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          <label htmlFor="playerName" className="sr-only">
            Enter your name (3 letters)
          </label>
          <input
            id="playerName"
            type="text"
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={3}
            className="p-2 mb-4 w-full bg-gray-700 text-white rounded"
            placeholder="Enter name (3 letters)"
            aria-label="Enter your name (3 letters)"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
