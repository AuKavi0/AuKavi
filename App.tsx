
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeChartPattern } from './services/geminiService';
import type { Pattern } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Pattern[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeChartPattern(imageFile);
      setAnalysisResult(result.patterns);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                onAnalyze={handleAnalyze} 
                onClear={handleClear}
                imageUrl={imageUrl}
                isLoading={isLoading} 
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <AnalysisResult 
                patterns={analysisResult} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>
        </main>
        <footer className="text-center text-gray-500 mt-12 text-sm">
          <p>AI Chart Pattern Identifier. For educational purposes only. Not financial advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
