"use client";

import { useState, useEffect, useRef } from 'react';
import { presidentsData, President } from '@/data/presidents';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type FieldType = 'term' | 'party';

export interface HiddenField {
  index: number;
  type: FieldType;
  originalValue: string;
  userValue: string;
  isCorrect: boolean;
}

export function usePresidentsGame() {
  const [gameActive, setGameActive] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [hiddenFields, setHiddenFields] = useState<HiddenField[]>([]);
  const [remainingFields, setRemainingFields] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Start the game
  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setTimer(0);
    
    // Hide random fields based on difficulty
    hideRandomFields();
    
    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameActive(false);
    setGameComplete(false);
    setHiddenFields([]);
    setRemainingFields(0);
    setTimer(0);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
  
  // Hide random fields based on difficulty
  const hideRandomFields = () => {
    let hidePercentage: number;
    
    switch(difficulty) {
      case 'easy':
        hidePercentage = 0.33;  // 1/3 of fields
        break;
      case 'medium':
        hidePercentage = 0.5;   // 1/2 of fields
        break;
      case 'hard':
        hidePercentage = 0.67;  // 2/3 of fields
        break;
      case 'expert':
        hidePercentage = 0.8;   // 80% of fields
        break;
      default:
        hidePercentage = 0.5;
    }
    
    // Create array of all possible fields
    const allFields: { index: number; type: FieldType }[] = [];
    
    presidentsData.forEach((_, index) => {
      allFields.push({ index, type: 'term' });
      allFields.push({ index, type: 'party' });
    });
    
    // Shuffle the array
    const shuffledFields = [...allFields].sort(() => Math.random() - 0.5);
    
    // Calculate how many fields to hide
    const fieldsToHideCount = Math.floor(shuffledFields.length * hidePercentage);
    const fieldsToHide = shuffledFields.slice(0, fieldsToHideCount);
    
    // Create hidden fields with original values
    const newHiddenFields = fieldsToHide.map(field => {
      const originalValue = field.type === 'term' 
        ? presidentsData[field.index].term 
        : presidentsData[field.index].party;
        
      return {
        index: field.index,
        type: field.type,
        originalValue,
        userValue: '',
        isCorrect: false
      };
    });
    
    setHiddenFields(newHiddenFields);
    setRemainingFields(newHiddenFields.length);
  };
  
  // Check the answer
  const checkAnswer = (fieldIndex: number, value: string) => {
    const updatedFields = hiddenFields.map((field, index) => {
      if (index === fieldIndex) {
        // Check if answer is correct
        const isCorrect = value.toLowerCase() === field.originalValue.toLowerCase();
        
        return {
          ...field,
          userValue: value,
          isCorrect
        };
      }
      return field;
    });
    
    setHiddenFields(updatedFields);
    
    // Count remaining fields
    const stillRemaining = updatedFields.filter(field => !field.isCorrect).length;
    setRemainingFields(stillRemaining);
    
    // Check if game is complete
    if (stillRemaining === 0) {
      endGame();
    }
  };
  
  // End the game
  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
  
  // Format timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  
  return {
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
  };
} 