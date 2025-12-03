import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;

export interface QuizAttempt {
  _id: string;
  quiz: string;
  user: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt?: string;
  answers: Array<{
    question: string;
    answer: string | number | boolean;
    isCorrect: boolean;
  }>;
  score: number;
  totalPoints: number;
}

export const createAttempt = async (quizId: string): Promise<QuizAttempt> => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};

export const submitAttempt = async (attemptId: string, answers: Array<{ question: string; answer: string | number | boolean }>): Promise<QuizAttempt> => {
  const response = await axiosWithCredentials.post(`${ATTEMPTS_API}/${attemptId}/submit`, { answers });
  return response.data;
};

export const findLatestAttempt = async (quizId: string): Promise<QuizAttempt | null> => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
      return null;
      }
    }
    throw error;
  }
};

export const findAttemptById = async (attemptId: string): Promise<QuizAttempt> => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/${attemptId}`);
  return response.data;
};

export const findAttemptsForUser = async (quizId: string): Promise<QuizAttempt[]> => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};

