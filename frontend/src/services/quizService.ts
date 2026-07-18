import axios from 'axios';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
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
