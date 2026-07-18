import axios from 'axios';

export interface ResearchResult {
  _id: string;
  topic: string;
  content: string; // JSON string containing structured summary, bullets, and citations
  userId: string;
  deckId?: string;
  createdAt: string;
}

export interface StructuredContent {
  summary: string;
  bullets: string[];
  citations: string[];
}

// In production (Vercel), set VITE_API_URL to your deployed backend, e.g.
// https://your-backend.onrender.com/api
// In local dev, it falls back to localhost:5000/api automatically.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const researchService = {
  getResearchResults: async (userId: string): Promise<ResearchResult[]> => {
    const response = await API.get<ResearchResult[]>('/research-results', {
      params: { userId },
    });
    return response.data;
  },

  getResearchResultById: async (id: string): Promise<ResearchResult> => {
    const response = await API.get<ResearchResult>(`/research-results/${id}`);
    return response.data;
  },

  createResearchResult: async (
    topic: string,
    content: string,
    userId: string,
    deckId?: string
  ): Promise<ResearchResult> => {
    const response = await API.post<ResearchResult>('/research-results', {
      topic,
      content,
      userId,
      deckId,
    });
    return response.data;
  },

  generateResearch: async (
    topic: string,
    userId: string,
    deckId?: string
  ): Promise<ResearchResult> => {
    const response = await API.post<ResearchResult>('/research-results/generate', {
      topic,
      userId,
      deckId,
    });
    return response.data;
  },

  deleteResearch: async (id: string): Promise<void> => {
    await API.delete(`/research-results/${id}`);
  },
};
