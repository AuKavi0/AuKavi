
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { ClearIcon } from './icons/ClearIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onAnalyze: () => void;
  onClear: () => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onAnalyze, onClear, imageUrl, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Upload Chart Image</h2>
      <div 
        className={`flex-grow border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col justify-center items-center p-4 text-center relative ${
          isDragging ? 'border-green-400 bg-gray-700' : 'border-gray-600'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {imageUrl ? (
          <div className="w-full h-full flex items-center justify-center">
             <img src={imageUrl} alt="Chart preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={handleUploadClick}>
            <UploadIcon className="h-12 w-12 text-gray-500" />
            <p className="text-gray-400">
              <span className="font-semibold text-green-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onAnalyze}
          disabled={!imageUrl || isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <AnalyzeIcon className="h-5 w-5" />
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={onClear}
          disabled={!imageUrl && !isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ClearIcon className="h-5 w-5" />
          Clear
        </button>
      </div>
    </div>
  );
};
