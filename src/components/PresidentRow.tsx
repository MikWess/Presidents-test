"use client";

import React, { useRef, useEffect } from 'react';
import { President } from '@/data/presidents';
import { FieldType, HiddenField } from '@/hooks/usePresidentsGame';

interface PresidentRowProps {
  president: President;
  index: number;
  hiddenFields: HiddenField[];
  onAnswerChange: (fieldIndex: number, value: string) => void;
}

export default function PresidentRow({ 
  president, 
  index, 
  hiddenFields, 
  onAnswerChange 
}: PresidentRowProps) {
  // Check if term is hidden
  const termField = hiddenFields.findIndex(
    field => field.index === index && field.type === 'term'
  );
  
  // Check if party is hidden
  const partyField = hiddenFields.findIndex(
    field => field.index === index && field.type === 'party'
  );
  
  // Refs for input elements
  const termInputRef = useRef<HTMLInputElement>(null);
  const partyInputRef = useRef<HTMLInputElement>(null);
  
  // Focus on first input if this is the first hidden field
  useEffect(() => {
    if (hiddenFields.length > 0) {
      if (termField === 0 && termInputRef.current) {
        termInputRef.current.focus();
      } else if (partyField === 0 && partyInputRef.current) {
        partyInputRef.current.focus();
      }
    }
  }, [hiddenFields, termField, partyField]);
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-2 border-b border-gray-200 pb-2">
      <div className="p-2 bg-gray-50 rounded">
        {president.name}
      </div>
      
      <div className="p-2 bg-gray-50 rounded">
        {termField === -1 ? (
          president.term
        ) : (
          <input
            ref={termInputRef}
            type="text"
            value={hiddenFields[termField].userValue}
            onChange={(e) => onAnswerChange(termField, e.target.value)}
            className={`w-full p-2 rounded border ${
              hiddenFields[termField].isCorrect
                ? 'bg-green-100 border-green-300'
                : 'border-gray-300'
            }`}
            disabled={hiddenFields[termField].isCorrect}
          />
        )}
      </div>
      
      <div className="p-2 bg-gray-50 rounded">
        {partyField === -1 ? (
          president.party
        ) : (
          <input
            ref={partyInputRef}
            type="text"
            value={hiddenFields[partyField].userValue}
            onChange={(e) => onAnswerChange(partyField, e.target.value)}
            className={`w-full p-2 rounded border ${
              hiddenFields[partyField].isCorrect
                ? 'bg-green-100 border-green-300'
                : 'border-gray-300'
            }`}
            disabled={hiddenFields[partyField].isCorrect}
          />
        )}
      </div>
    </div>
  );
} 