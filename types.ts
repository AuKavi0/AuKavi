
export interface Pattern {
  name: string;
  type: 'Reversal' | 'Continuation' | 'Bilateral' | 'Candlestick' | string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral' | string;
  description: string;
}

export interface AnalysisResponse {
  patterns: Pattern[];
}
