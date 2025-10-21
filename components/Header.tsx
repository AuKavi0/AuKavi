
import React from 'react';
import { ChartIcon } from './icons/ChartIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
        <ChartIcon className="h-10 w-10 text-green-400"/>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
          AI Chart Pattern Identifier
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400">
        Upload a chart image to instantly identify technical patterns.
      </p>
    </header>
  );
};
