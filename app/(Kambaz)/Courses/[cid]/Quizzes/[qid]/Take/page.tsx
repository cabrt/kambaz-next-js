"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizzesClient from "../../client";
import * as questionsClient from "../Editor/Questions/client";
import { Question } from "../Editor/Questions/client";
import * as attemptsClient from "./client";
import { QuizAttempt } from "./client";
import QuizTaking from "./QuizTaking";

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

export default function QuizTake() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quiz, setQuiz] = useState<quizzesClient.Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedQuiz, fetchedQuestions, latestAttempt, userAttempts] = await Promise.all([
          quizzesClient.findQuizById(qid),
          questionsClient.findQuestionsForQuiz(qid),
          attemptsClient.findLatestAttempt(qid).catch(() => null),
          !isFaculty ? attemptsClient.findAttemptsForUser(qid).catch(() => []) : Promise.resolve([]),
        ]);
        setQuiz(fetchedQuiz);
        setQuestions(fetchedQuestions);
        setAttempt(latestAttempt);
        setAllAttempts(userAttempts);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [qid, isFaculty]);

  const handleStartQuiz = async () => {
    // Check if student has reached maximum attempts
    if (!isFaculty && quiz) {
      const submittedAttempts = allAttempts.filter(a => a.submittedAt);
      const maxAttempts = quiz.multipleAttempts ? (quiz.attemptsAllowed || 1) : 1;
      
      if (submittedAttempts.length >= maxAttempts) {
        setError(`Maximum attempts reached. You have already taken this quiz ${submittedAttempts.length} time(s).`);
        return;
      }
    }

    try {
      const newAttempt = await attemptsClient.createAttempt(qid);
      setAttempt(newAttempt);
      // Refresh attempts list
      if (!isFaculty) {
        const userAttempts = await attemptsClient.findAttemptsForUser(qid);
        setAllAttempts(userAttempts);
      }
      setError("");
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 403) {
        setError("Maximum attempts reached. You cannot take this quiz again.");
        } else {
          setError("Failed to start quiz");
        }
      } else {
        setError("Failed to start quiz");
      }
    }
  };

  const handleSubmit = async (answers: Array<{ question: string; answer: string | number | boolean }>) => {
    if (!attempt) return;
    try {
      const submittedAttempt = await attemptsClient.submitAttempt(attempt._id, answers);
      setAttempt(submittedAttempt);
      // Refresh attempts list after submission
      if (!isFaculty) {
        const userAttempts = await attemptsClient.findAttemptsForUser(qid);
        setAllAttempts(userAttempts);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setError("Failed to submit quiz");
    }
  };

  if (loading) {
    return (
      <div className="p-3">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-3">
        <Alert variant="danger">Quiz not found.</Alert>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-3">
        <Alert variant="warning">Please log in to take this quiz.</Alert>
      </div>
    );
  }

  // Check if user can take the quiz
  const canTakeQuiz = !isFaculty && quiz.published;
  const hasAttempt = attempt !== null;
  const isSubmitted = attempt?.submittedAt !== undefined;
  
  // Check if student can retake
  const submittedAttempts = allAttempts.filter(a => a.submittedAt);
  const maxAttempts = quiz?.multipleAttempts ? (quiz.attemptsAllowed || 1) : 1;
  const canRetake = quiz?.multipleAttempts && submittedAttempts.length < maxAttempts;
  const hasReachedMaxAttempts = !isFaculty && quiz && submittedAttempts.length >= maxAttempts;

  if (!canTakeQuiz && !isFaculty) {
    return (
      <div className="p-3">
        <Alert variant="warning">This quiz is not available for taking.</Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz Details
        </Button>
      </div>
    );
  }

  if (!hasAttempt && !isFaculty) {
    return (
      <div className="p-3">
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
        <p><strong>Points:</strong> {quiz.points || 0}</p>
        <p><strong>Time Limit:</strong> {quiz.timeLimit || 20} minutes</p>
        <p><strong>Questions:</strong> {questions.length}</p>
        {hasReachedMaxAttempts ? (
          <Alert variant="warning" className="mt-3">
            You have reached the maximum number of attempts ({maxAttempts}) for this quiz.
          </Alert>
        ) : (
        <Button variant="danger" size="lg" onClick={handleStartQuiz} className="mt-3">
          Start Quiz
        </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz Details
        </Button>
      </div>

      <QuizTaking
        quiz={quiz as quizzesClient.Quiz & { [key: string]: unknown }}
        questions={questions}
        attempt={attempt}
        onSubmit={handleSubmit}
        isPreview={false}
      />

      {isSubmitted && canRetake && (
        <div className="mt-3">
          <Alert variant="info" className="mb-3">
            You have {submittedAttempts.length} of {maxAttempts} attempt(s) completed.
          </Alert>
          <Button variant="primary" onClick={handleStartQuiz}>
            Take Quiz Again
          </Button>
        </div>
      )}
      {isSubmitted && hasReachedMaxAttempts && (
        <Alert variant="warning" className="mt-3">
          You have reached the maximum number of attempts ({maxAttempts}) for this quiz.
        </Alert>
      )}
    </div>
  );
}

