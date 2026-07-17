import axios from 'axios';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
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
      try {
        await axios.get(`http://localhost:${port}/health`, { timeout: 800 });
        activePort = `http://localhost:${port}/api`;
        return activePort;
      } catch (e) {
        // ignore and try next port
      }
    }
    detectingPromise = null;
    return 'http://localhost:5000/api'; // default fallback
  })();

  return detectingPromise;
};

API.interceptors.request.use(async (config) => {
  config.baseURL = await detectActivePort();
  return config;
});

export const quizService = {
  generateQuiz: async (topic: string, difficulty: string): Promise<QuizResponse> => {
    const response = await API.post<QuizResponse>('/quiz/generate', {
      topic,
      difficulty,
    });
    return response.data;
  },
};
export type { QuizQuestion as QuizQuestionType };
