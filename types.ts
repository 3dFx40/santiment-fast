
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SentimentDetails {
  positive_percentage: number;
  negative_percentage: number;
  neutral_percentage: number;
}

export interface SentimentAnalysis {
  score: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  details: SentimentDetails;
  example_quotes: string[];
}

export interface AnalysisResult {
  summary: string;
  related_keywords: string[];
  sentiment: SentimentAnalysis;
  sources: GroundingChunk[];
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export interface FavoriteItem {
    id: string;
    query: string;
    result: AnalysisResult;
    timestamp: number;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    isLoading?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type Language = 'he' | 'en' | 'ru';
