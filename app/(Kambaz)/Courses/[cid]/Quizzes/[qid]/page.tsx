"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Table, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaPencil } from "react-icons/fa6";
import * as quizzesClient from "../client";
import * as questionsClient from "./Editor/Questions/client";
import * as attemptsClient from "./Take/client";

interface Quiz {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
  published?: boolean;
  questionCount?: number;
  quizType?: string;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  attemptsAllowed?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
}

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

export default function QuizDetails() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<questionsClient.Question[]>([]);
  const [allAttempts, setAllAttempts] = useState<attemptsClient.QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const [fetchedQuiz, fetchedQuestions, userAttempts] = await Promise.all([
          quizzesClient.findQuizById(qid),
          isFaculty ? questionsClient.findQuestionsForQuiz(qid) : Promise.resolve([]),
          !isFaculty ? attemptsClient.findAttemptsForUser(qid).catch(() => []) : Promise.resolve([])
        ]);
        setQuiz(fetchedQuiz);
        setQuestions(fetchedQuestions);
        setAllAttempts(userAttempts);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [qid, isFaculty]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month} ${day} at ${displayHours}:${displayMinutes}${ampm}`;
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
        <p>Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="p-3" style={{ border: "1px dashed #ccc" }}>
      {isFaculty && (
        <div className="d-flex justify-content-center gap-2 mb-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
          >
            Preview
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
          >
            <FaPencil className="me-1" /> Edit
          </Button>
        </div>
      )}

      <h2 className="mb-4">{quiz.title}</h2>

      {isFaculty ? (
        <div>
          <Table borderless className="mb-4">
            <tbody>
              <tr>
                <td className="fw-bold" style={{ width: "250px" }}>Quiz Type</td>
                <td>{quiz.quizType || "Graded Quiz"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Points</td>
                <td>{questions.reduce((sum, q) => sum + (q.points || 0), 0)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Assignment Group</td>
                <td>{quiz.assignmentGroup || "Quizzes"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Shuffle Answers</td>
                <td>{quiz.shuffleAnswers !== false ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Time Limit</td>
                <td>{quiz.timeLimit || 20} Minutes</td>
              </tr>
              <tr>
                <td className="fw-bold">Multiple Attempts</td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              {quiz.multipleAttempts && (
                <tr>
                  <td className="fw-bold">How Many Attempts</td>
                  <td>{quiz.attemptsAllowed || 1}</td>
                </tr>
              )}
              <tr>
                <td className="fw-bold">Show Correct Answers</td>
                <td>{quiz.showCorrectAnswers || "Immediately"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Access Code</td>
                <td>{quiz.accessCode || "(blank)"}</td>
              </tr>
              <tr>
                <td className="fw-bold">One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime !== false ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Lock Questions After Answering</td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Due date</td>
                <td>{formatDate(quiz.dueDate)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Available date</td>
                <td>{formatDate(quiz.availableDate)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Until date</td>
                <td>{formatDate(quiz.availableUntil)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center">
          {(() => {
            const submittedAttempts = allAttempts.filter(a => a.submittedAt);
            const maxAttempts = quiz.multipleAttempts ? (quiz.attemptsAllowed || 1) : 1;
            const hasReachedMax = submittedAttempts.length >= maxAttempts;
            const hasAttempts = submittedAttempts.length > 0;
            
            return (
              <>
                {hasReachedMax ? (
                  <>
                    <p className="mb-4">You have reached the maximum number of attempts ({maxAttempts}) for this quiz.</p>
                    <Alert variant="warning">You cannot take this quiz again.</Alert>
                  </>
                ) : (
                  <>
          <p className="mb-4">Ready to take this quiz?</p>
                    {hasAttempts && (
                      <p className="text-muted mb-3">
                        You have {submittedAttempts.length} of {maxAttempts} attempt(s) completed.
                      </p>
                    )}
          <Button 
            variant="danger" 
            size="lg" 
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
          >
                      {hasAttempts ? "Retake Quiz" : "Start Quiz"}
          </Button>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

