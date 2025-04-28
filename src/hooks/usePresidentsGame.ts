"use client";

import { useState, useEffect, useRef } from 'react';
import { presidentsData, President } from '@/data/presidents';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type FieldType = 'term' | 'party' | 'president';

export interface CategorySelection {
  president: boolean;
  term: boolean;
  party: boolean;
}

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
  const [categorySelection, setCategorySelection] = useState<CategorySelection>({
    president: false,
    term: true,
    party: true,
  });
  const [hiddenFields, setHiddenFields] = useState<HiddenField[]>([]);
  const [remainingFields, setRemainingFields] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Start the game
  const startGame = () => {
    // Make sure at least one category is selected
    if (!categorySelection.president && !categorySelection.term && !categorySelection.party) {
      alert("Please select at least one category to hide");
      return;
    }
    
    setGameActive(true);
    setGameComplete(false);
    setTimer(0);
    
    // Hide fields based on selections and difficulty
    hideSelectedFields();
    
    // Start timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
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
  
  // Toggle category selection
  const toggleCategory = (category: keyof CategorySelection) => {
    setCategorySelection(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Hide fields based on user selections and difficulty
  const hideSelectedFields = () => {
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
    
    // Create array of all possible fields based on selected categories
    const allFields: { index: number; type: FieldType }[] = [];
    
    presidentsData.forEach((_, index) => {
      if (categorySelection.president) {
        allFields.push({ index, type: 'president' });
      }
      if (categorySelection.term) {
        allFields.push({ index, type: 'term' });
      }
      if (categorySelection.party) {
        allFields.push({ index, type: 'party' });
      }
    });
    
    // If no fields were added, return early
    if (allFields.length === 0) {
      return;
    }
    
    // Shuffle the array
    const shuffledFields = [...allFields].sort(() => Math.random() - 0.5);
    
    // Calculate how many fields to hide
    const fieldsToHideCount = Math.max(1, Math.floor(shuffledFields.length * hidePercentage));
    const fieldsToHide = shuffledFields.slice(0, fieldsToHideCount);
    
    // Create hidden fields with original values
    const newHiddenFields = fieldsToHide.map(field => {
      let originalValue = '';
      
      switch (field.type) {
        case 'president':
          originalValue = presidentsData[field.index].name;
          break;
        case 'term':
          originalValue = presidentsData[field.index].term;
          break;
        case 'party':
          originalValue = presidentsData[field.index].party;
          break;
        default:
          originalValue = '';
      }
      
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
    if (fieldIndex < 0 || fieldIndex >= hiddenFields.length) {
      console.error("Invalid field index:", fieldIndex);
      return;
    }
    
    const updatedFields = hiddenFields.map((field, index) => {
      if (index === fieldIndex) {
        // Check if answer is correct - compare ignoring case and trimming whitespace
        const isCorrect = value.toLowerCase().trim() === field.originalValue.toLowerCase().trim();
        
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
    categorySelection,
    toggleCategory,
    hiddenFields,
    timer,
    formatTime,
    gameComplete,
    startGame,
    resetGame,
    checkAnswer
  };
} 