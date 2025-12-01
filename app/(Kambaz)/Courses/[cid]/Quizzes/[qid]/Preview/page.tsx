"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizzesClient from "../../client";
import * as questionsClient from "../Editor/Questions/client";
import { Question } from "../Editor/Questions/client";
import { QuizAttempt } from "../Take/client";
import QuizTaking from "../Take/QuizTaking";

type Quiz = quizzesClient.Quiz & {
  [key: string]: unknown;
};

type PreviewAttempt = Partial<QuizAttempt> & {
  _id: string;
  startedAt: string;
  answers: Array<{
    question: string;
    answer: string | number | boolean;
    isCorrect: boolean;
  }>;
  score?: number;
  totalPoints?: number;
  submittedAt?: string;
};

interface RootState {
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    } | null;
  };
}

export default function QuizPreview() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<PreviewAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedQuiz, fetchedQuestions] = await Promise.all([
          quizzesClient.findQuizById(qid),
          questionsClient.findQuestionsForQuiz(qid),
        ]);
        setQuiz(fetchedQuiz as Quiz);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [qid]);

  const handleStartPreview = () => {
    // For preview, we don't create an actual attempt, just start taking
    setAttempt({
      _id: "preview",
      startedAt: new Date().toISOString(),
      answers: [],
    } as PreviewAttempt);
    setIsTakingQuiz(true);
  };

  const handleSubmit = async (answers: Array<{ question: string; answer: string | number | boolean }>) => {
    // For preview, calculate score locally without saving
    const gradedAnswers = questions.map((q) => {
      const answer = answers.find((a) => a.question === q._id);
      let isCorrect = false;

      if (q.questionType === "Multiple Choice") {
        isCorrect = q.correctChoice === answer?.answer;
      } else if (q.questionType === "True/False") {
        isCorrect = q.correctAnswer === answer?.answer;
      } else if (q.questionType === "Fill in the Blank") {
        const studentAnswer = String(answer?.answer || "").trim();
        isCorrect = q.possibleAnswers?.some((correctAnswer: string) => {
          const normalizedStudent = q.caseSensitive
            ? studentAnswer
            : studentAnswer.toLowerCase();
          const normalizedCorrect = q.caseSensitive
            ? correctAnswer.trim()
            : correctAnswer.trim().toLowerCase();
          return normalizedStudent === normalizedCorrect;
        }) || false;
      }

      return {
        question: q._id,
        answer: answer?.answer || "",
        isCorrect,
      };
    });

    const score = gradedAnswers.reduce((sum, a) => sum + (a.isCorrect ? (questions.find(q => q._id === a.question)?.points || 0) : 0), 0);
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

    setAttempt({
      _id: "preview",
      startedAt: attempt?.startedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      answers: gradedAnswers,
      score,
      totalPoints,
    } as PreviewAttempt);
  };

  if (loading) {
    return (
      <div className="p-3">
        <p>Loading quiz preview...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-3">
        <p>Quiz not found.</p>
      </div>
    );
  }

  if (!isFaculty) {
    return (
      <div className="p-3">
        <Alert variant="warning">You do not have permission to preview quizzes.</Alert>
      </div>
    );
  }

  if (isTakingQuiz || attempt) {
    return (
      <div className="p-3" style={{ border: "1px dashed #ccc" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Quiz Preview: {quiz.title}</h2>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor/Questions`)}>
              Edit Quiz
            </Button>
            <Button variant="secondary" onClick={() => {
              setAttempt(null);
              setIsTakingQuiz(false);
            }}>
              Back to Preview
            </Button>
          </div>
        </div>

        <Alert variant="info" className="mb-3">
          <strong>Preview Mode:</strong> This is how students will see the quiz. Your answers will not be saved.
        </Alert>

        <QuizTaking
          quiz={quiz as Quiz & { [key: string]: unknown }}
          questions={questions}
          attempt={attempt as QuizAttempt | null}
          onSubmit={handleSubmit}
          isPreview={true}
        />
      </div>
    );
  }

  return (
    <div className="p-3" style={{ border: "1px dashed #ccc" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quiz Preview: {quiz.title}</h2>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor/Questions`)}>
            Edit Quiz
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
            Back to Details
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-light rounded">
        <p className="mb-4">This is a preview of how students will see the quiz.</p>
        <p><strong>Points:</strong> {quiz.points || 0}</p>
        <p><strong>Questions:</strong> {questions.length}</p>
        <p><strong>Time Limit:</strong> {quiz.timeLimit || 20} minutes</p>
        {quiz.description && (
          <div className="mt-3">
            <strong>Description:</strong>
            <div className="mt-2">{quiz.description}</div>
          </div>
        )}
        <div className="mt-4">
          <Button variant="primary" size="lg" onClick={handleStartPreview}>
            Start Quiz (Preview Mode)
          </Button>
        </div>
      </div>
    </div>
  );
}

