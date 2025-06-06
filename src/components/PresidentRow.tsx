"use client";

import React, { useRef, useEffect, useState } from 'react';
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
  const [showAnimation, setShowAnimation] = useState<{ 
    president: boolean; 
    term: boolean; 
    party: boolean; 
  }>({
    president: false,
    term: false,
    party: false,
  });

  // Check if president name is hidden
  const presidentField = hiddenFields.findIndex(
    field => field.index === index && field.type === 'president'
  );
  
  // Check if term is hidden
  const termField = hiddenFields.findIndex(
    field => field.index === index && field.type === 'term'
  );
  
  // Check if party is hidden
  const partyField = hiddenFields.findIndex(
    field => field.index === index && field.type === 'party'
  );
  
  // Refs for input elements
  const presidentInputRef = useRef<HTMLInputElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  const partyInputRef = useRef<HTMLInputElement>(null);

  // Handle animation when answer is correct
  const handleChange = (fieldIndex: number, type: keyof typeof showAnimation, value: string) => {
    if (fieldIndex === -1) return;
    
    const currentValue = fieldIndex !== -1 && fieldIndex < hiddenFields.length ? 
      hiddenFields[fieldIndex].userValue : '';
    
    // Only trigger animation if answer changes from incorrect to correct
    const wasPreviouslyCorrect = fieldIndex !== -1 && 
      fieldIndex < hiddenFields.length && 
      hiddenFields[fieldIndex].isCorrect;
      
    const isNowCorrect = value.toLowerCase().trim() === 
      (fieldIndex !== -1 && fieldIndex < hiddenFields.length ? 
        hiddenFields[fieldIndex].originalValue.toLowerCase().trim() : '');
    
    onAnswerChange(fieldIndex, value);
    
    if (!wasPreviouslyCorrect && isNowCorrect) {
      setShowAnimation(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setShowAnimation(prev => ({ ...prev, [type]: false }));
      }, 500);
    }
  };
  
  // Focus on first input if this is the first hidden field
  useEffect(() => {
    if (hiddenFields.length > 0) {
      if (presidentField === 0 && presidentInputRef.current) {
        presidentInputRef.current.focus();
      } else if (termField === 0 && termInputRef.current) {
        termInputRef.current.focus();
      } else if (partyField === 0 && partyInputRef.current) {
        partyInputRef.current.focus();
      }
    }
  }, [hiddenFields, presidentField, termField, partyField]);

  // Helper to determine row background color
  const getRowBgColor = () => {
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };
  
  // Helper to get the current value of a field
  const getFieldValue = (fieldIndex: number) => {
    if (fieldIndex === -1 || fieldIndex >= hiddenFields.length) return '';
    return hiddenFields[fieldIndex].userValue;
  };
  
  // Helper to check if a field is correct
  const isFieldCorrect = (fieldIndex: number) => {
    if (fieldIndex === -1 || fieldIndex >= hiddenFields.length) return false;
    return hiddenFields[fieldIndex].isCorrect;
  };
  
  return (
    <div className={`grid grid-cols-3 gap-0 border-b border-gray-200 ${getRowBgColor()} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}>
      <div className="p-3 border-r border-gray-200">
        {presidentField === -1 ? (
          <div className="font-medium">{president.name}</div>
        ) : (
          <div className={`${showAnimation.president ? 'correct-animation' : ''}`}>
            <input
              ref={presidentInputRef}
              type="text"
              value={getFieldValue(presidentField)}
              onChange={(e) => handleChange(presidentField, 'president', e.target.value)}
              className={`input ${
                isFieldCorrect(presidentField)
                  ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                  : 'bg-white'
              }`}
              placeholder="Enter president name"
              disabled={isFieldCorrect(presidentField)}
            />
          </div>
        )}
      </div>
      
      <div className="p-3 border-r border-gray-200">
        {termField === -1 ? (
          <div className="font-mono text-sm">{president.term}</div>
        ) : (
          <div className={`${showAnimation.term ? 'correct-animation' : ''}`}>
            <input
              ref={termInputRef}
              type="text"
              value={getFieldValue(termField)}
              onChange={(e) => handleChange(termField, 'term', e.target.value)}
              className={`input ${
                isFieldCorrect(termField)
                  ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                  : 'bg-white'
              }`}
              placeholder="Enter term years"
              disabled={isFieldCorrect(termField)}
            />
          </div>
        )}
      </div>
      
      <div className="p-3">
        {partyField === -1 ? (
          <div className={`text-sm ${getPartyColor(president.party)}`}>{president.party}</div>
        ) : (
          <div className={`${showAnimation.party ? 'correct-animation' : ''}`}>
            <input
              ref={partyInputRef}
              type="text"
              value={getFieldValue(partyField)}
              onChange={(e) => handleChange(partyField, 'party', e.target.value)}
              className={`input ${
                isFieldCorrect(partyField)
                  ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                  : 'bg-white'
              }`}
              placeholder="Enter party name"
              disabled={isFieldCorrect(partyField)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get text color based on party
function getPartyColor(party: string): string {
  if (party.includes('Democratic')) return 'text-blue-700 font-medium';
  if (party.includes('Republican')) return 'text-red-700 font-medium';
  if (party.includes('Whig')) return 'text-purple-700 font-medium';
  if (party.includes('Federalist')) return 'text-green-700 font-medium';
  return 'text-gray-700';
} 