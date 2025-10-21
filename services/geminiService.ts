
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResponse } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we throw an error if the key isn't set.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    patterns: {
      type: Type.ARRAY,
      description: "A list of all identified chart patterns.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the chart pattern (e.g., 'Double Top', 'Hammer').",
          },
          type: {
            type: Type.STRING,
            description: "Category of the pattern (e.g., 'Reversal', 'Continuation', 'Bilateral', 'Candlestick').",
          },
          sentiment: {
            type: Type.STRING,
            description: "Market sentiment indicated by the pattern (Bullish, Bearish, or Neutral).",
          },
          description: {
            type: Type.STRING,
            description: "A brief, one or two sentence explanation of the pattern and its trading implications.",
          },
        },
        required: ['name', 'type', 'sentiment', 'description'],
      },
    },
  },
  required: ['patterns'],
};

export const analyzeChartPattern = async (file: File): Promise<AnalysisResponse> => {
  try {
    const base64Image = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Image,
      },
    };

    const textPart = {
      text: `You are an expert financial technical analyst. Analyze the provided chart image and identify all known chart patterns and Japanese candlestick patterns.
      For each pattern found, provide its name, type (Reversal, Continuation, Bilateral, or Candlestick), sentiment (Bullish, Bearish, or Neutral), and a brief description of what it indicates.
      If no patterns are clearly identifiable, return an empty array for the patterns.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }
    
    // Sometimes the API might wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');

    const parsedResponse = JSON.parse(cleanedJsonText);

    if (!parsedResponse || !('patterns' in parsedResponse)) {
        console.warn("API response is missing 'patterns' key, returning default empty structure.", parsedResponse);
        return { patterns: [] };
    }
    
    return parsedResponse as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing chart:", error);
    let errorMessage = "Failed to analyze the chart image. The API may be unavailable or the image format could be unsupported.";
    if (error instanceof Error) {
        if (error.message.includes('json')) {
            errorMessage = "The AI returned an invalid format. Please try again.";
        } else if (error.message.includes('API key')) {
            errorMessage = "Invalid API key. Please check your configuration.";
        }
    }
    throw new Error(errorMessage);
  }
};
