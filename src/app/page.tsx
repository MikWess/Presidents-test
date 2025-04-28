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
    categorySelection,
    toggleCategory,
    hiddenFields,
    timer,
    formatTime,
    gameComplete,
    startGame,
    resetGame,
    checkAnswer
  } = usePresidentsGame();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-10 py-12">
      <div className="w-full max-w-5xl mx-auto card p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-8">
          Learn the Presidents
        </h1>
        
        {/* Game controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Game Settings</h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="difficulty" className="font-medium text-sm text-gray-600">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="input bg-white"
                  disabled={gameActive}
                >
                  <option value="easy">Easy (1/3 hidden)</option>
                  <option value="medium">Medium (1/2 hidden)</option>
                  <option value="hard">Hard (2/3 hidden)</option>
                  <option value="expert">Expert (Almost all hidden)</option>
                </select>
              </div>
              
              <div>
                <p className="font-medium text-sm text-gray-600 mb-3">Categories to Hide</p>
                <div className="flex flex-col gap-3">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="president-checkbox"
                      checked={categorySelection.president}
                      onChange={() => toggleCategory('president')}
                      disabled={gameActive}
                    />
                    <label htmlFor="president-checkbox">Presidents</label>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="term-checkbox"
                      checked={categorySelection.term}
                      onChange={() => toggleCategory('term')}
                      disabled={gameActive}
                    />
                    <label htmlFor="term-checkbox">Terms</label>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="party-checkbox"
                      checked={categorySelection.party}
                      onChange={() => toggleCategory('party')}
                      disabled={gameActive}
                    />
                    <label htmlFor="party-checkbox">Parties</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-800">Game Status</h2>
              <div className="text-center py-4">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Current Time</div>
                <div className="font-mono text-3xl font-bold text-blue-600 tabular-nums">
                  {formatTime(timer)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={startGame}
                disabled={gameActive}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {gameActive ? 'Game in Progress' : 'Start Game'}
              </button>
              <button
                onClick={resetGame}
                disabled={!gameActive && !gameComplete}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
        
        {/* Game complete message */}
        {gameComplete && (
          <div className="my-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Game Complete!</h2>
            <p className="text-lg mb-4">You finished in: <span className="font-mono font-bold">{formatTime(timer)}</span></p>
            <button
              onClick={resetGame}
              className="btn btn-success"
            >
              Play Again
            </button>
          </div>
        )}
        
        {/* Game board */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-0 font-bold text-sm bg-blue-600 text-white">
            <div className="p-3 text-center">President</div>
            <div className="p-3 text-center border-l border-r border-blue-500">Term</div>
            <div className="p-3 text-center">Party</div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
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
      </div>
    </main>
  );
}
