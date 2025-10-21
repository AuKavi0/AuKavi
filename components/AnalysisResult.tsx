
import React from 'react';
import type { Pattern } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { PatternCard } from './PatternCard';
import { InfoIcon } from './icons/InfoIcon';
import { ErrorIcon } from './icons/ErrorIcon';

interface AnalysisResultProps {
  patterns: Pattern[] | null;
  isLoading: boolean;
  error: string | null;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ patterns, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
          <LoadingSpinner />
          <p className="text-lg font-medium">Analyzing chart...</p>
          <p className="text-sm text-center">Our AI is looking for patterns. This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-red-400">
          <ErrorIcon className="h-12 w-12" />
          <p className="text-lg font-semibold">Analysis Failed</p>
          <p className="text-center bg-red-900/50 p-3 rounded-md border border-red-500/50">{error}</p>
        </div>
      );
    }
    
    if (patterns && patterns.length > 0) {
      return (
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <PatternCard key={index} pattern={pattern} />
          ))}
        </div>
      );
    }
    
    if (patterns && patterns.length === 0) {
       return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
          <InfoIcon className="h-12 w-12" />
          <p className="text-lg font-medium">No Patterns Detected</p>
          <p className="text-sm text-center">The AI could not identify any standard chart patterns in this image. Try another one!</p>
        </div>
      );
    }
    

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <InfoIcon className="h-12 w-12" />
        <p className="text-lg font-medium">Awaiting Analysis</p>
        <p className="text-sm text-center">Upload a chart image and click "Analyze" to see the results here.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Analysis Results</h2>
      <div className="flex-grow bg-gray-800/50 rounded-lg p-4 h-96 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
