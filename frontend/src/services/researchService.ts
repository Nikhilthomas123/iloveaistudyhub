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

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let activePort: string | null = null;
let detectingPromise: Promise<string> | null = null;

// Auto-detect active backend port (3000 or 5000)
const detectActivePort = async (): Promise<string> => {
  if (activePort) return activePort;
  if (detectingPromise) return detectingPromise;

  detectingPromise = (async () => {
    for (const port of [3000, 5000]) {
      for (const host of ['127.0.0.1', 'localhost']) {
        try {
          await axios.get(`http://${host}:${port}/health`, { timeout: 2000 });
          activePort = `http://${host}:${port}/api`;
          return activePort;
        } catch (e) {
          // ignore and try next
        }
      }
    }
    detectingPromise = null;
    return 'http://localhost:3000/api'; // default fallback
  })();

  return detectingPromise;
};

API.interceptors.request.use(async (config) => {
  config.baseURL = await detectActivePort();
  return config;
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
