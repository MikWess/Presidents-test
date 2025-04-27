'use client';

import React from 'react';
import { presidentsData } from '@/data/presidents';
import { usePresidentsGame, Difficulty } from '@/hooks/usePresidentsGame';
import PresidentRow from '@/components/PresidentRow';

export default function Home() {
  const {
    gameActive,
    difficulty,
    setDifficulty,
    hiddenFields,
    timer,
    formatTime,
    gameComplete,
    startGame,
    resetGame,
    checkAnswer
  } = usePresidentsGame();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Learn the Presidents
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="difficulty" className="font-medium">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="p-2 border rounded"
              disabled={gameActive}
            >
              <option value="easy">Easy (1/3 hidden)</option>
              <option value="medium">Medium (1/2 hidden)</option>
              <option value="hard">Hard (2/3 hidden)</option>
              <option value="expert">Expert (Almost all hidden)</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={startGame}
              disabled={gameActive}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Start Game
            </button>
            <button
              onClick={resetGame}
              disabled={!gameActive && !gameComplete}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Reset
            </button>
          </div>
          
          <div className="font-mono text-xl font-bold text-red-600">
            Time: {formatTime(timer)}
          </div>
        </div>
        
        {gameComplete && (
          <div className="text-center bg-green-100 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Game Complete!</h2>
            <p className="text-lg">Your time: {formatTime(timer)}</p>
            <button
              onClick={resetGame}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2 mb-2 font-bold">
          <div className="p-2 bg-blue-100 rounded text-center">President</div>
          <div className="p-2 bg-blue-100 rounded text-center">Term</div>
          <div className="p-2 bg-blue-100 rounded text-center">Party</div>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto">
          {presidentsData.map((president, index) => (
            <PresidentRow
              key={`${president.name}-${index}`}
              president={president}
              index={index}
              hiddenFields={hiddenFields}
              onAnswerChange={checkAnswer}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
