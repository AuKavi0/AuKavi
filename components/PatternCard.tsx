
import React from 'react';
import type { Pattern } from '../types';
import { BullishIcon } from './icons/BullishIcon';
import { BearishIcon } from './icons/BearishIcon';
import { NeutralIcon } from './icons/NeutralIcon';

interface PatternCardProps {
  pattern: Pattern;
}

const sentimentStyles = {
  Bullish: 'bg-green-900/50 text-green-300 border-green-500/30',
  Bearish: 'bg-red-900/50 text-red-300 border-red-500/30',
  Neutral: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
};

const sentimentIcons = {
  Bullish: <BullishIcon className="h-5 w-5 text-green-400" />,
  Bearish: <BearishIcon className="h-5 w-5 text-red-400" />,
  Neutral: <NeutralIcon className="h-5 w-5 text-yellow-400" />,
};

export const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const sentiment = pattern.sentiment || 'Neutral';
  const cardClass = sentimentStyles[sentiment as keyof typeof sentimentStyles] || sentimentStyles.Neutral;
  const icon = sentimentIcons[sentiment as keyof typeof sentimentIcons] || sentimentIcons.Neutral;

  return (
    <div className={`border rounded-lg p-4 ${cardClass} transition-all hover:border-gray-500/50`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-100">{pattern.name}</h3>
          <p className="text-sm text-gray-400">{pattern.type}</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full text-sm font-medium">
          {icon}
          <span>{sentiment}</span>
        </div>
      </div>
      <p className="mt-3 text-gray-300 text-sm">
        {pattern.description}
      </p>
    </div>
  );
};
