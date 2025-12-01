import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
if (!HTTP_SERVER) {
  console.error("NEXT_PUBLIC_HTTP_SERVER is not set! API calls will fail.");
}
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUESTIONS_API = `${HTTP_SERVER}/api/questions`;

export interface Question {
  _id: string;
  quiz: string;
  title: string;
  questionType: "Multiple Choice" | "True/False" | "Fill in the Blank";
  points: number;
  question: string; // WYSIWYG HTML content
  // For Multiple Choice
  choices?: string[];
  correctChoice?: number;
  // For True/False
  correctAnswer?: boolean;
  // For Fill in the Blank
  possibleAnswers?: string[];
  caseSensitive?: boolean;
}

export const findQuestionsForQuiz = async (quizId: string): Promise<Question[]> => {
  if (!quizId) {
    throw new Error("Quiz ID is required");
  }
  const url = `${QUIZZES_API}/${quizId}/questions`;
  console.log("Fetching questions for quiz:", url);
  try {
    const response = await axiosWithCredentials.get(url);
  return response.data;
  } catch (error: unknown) {
    console.error("Error fetching questions:", error);
    console.error("Request URL:", url);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
    }
    throw error;
  }
};

export const findQuestionById = async (questionId: string): Promise<Question> => {
  const response = await axiosWithCredentials.get(`${QUESTIONS_API}/${questionId}`);
  return response.data;
};

export const createQuestion = async (quizId: string, question: Partial<Question>): Promise<Question> => {
  if (!quizId) {
    throw new Error("Quiz ID is required");
  }
  const url = `${QUIZZES_API}/${quizId}/questions`;
  console.log("Creating question at:", url);
  console.log("Question data:", question);
  try {
    const response = await axiosWithCredentials.post(url, question);
  return response.data;
  } catch (error: unknown) {
    console.error("Error creating question:", error);
    console.error("Request URL:", url);
    console.error("Request data:", question);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
    }
    throw error;
  }
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  const response = await axiosWithCredentials.put(`${QUESTIONS_API}/${question._id}`, question);
  return response.data;
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
};

