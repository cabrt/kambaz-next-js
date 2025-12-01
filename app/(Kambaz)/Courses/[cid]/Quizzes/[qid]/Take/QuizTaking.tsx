"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { Question } from "../Editor/Questions/client";
import { QuizAttempt } from "./client";

interface Quiz {
  _id: string;
  title: string;
  timeLimit?: number;
  [key: string]: unknown;
}

interface QuizTakingProps {
  quiz: Quiz;
  questions: Question[];
  attempt: QuizAttempt | null;
  onSubmit: (answers: Array<{ question: string; answer: string | number | boolean }>) => void;
  isPreview?: boolean;
}

export default function QuizTaking({ quiz, questions, attempt, onSubmit }: QuizTakingProps) {
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (attempt && attempt.answers && attempt.answers.length > 0) {
      const answerMap: Record<string, string | number | boolean> = {};
      attempt.answers.forEach((a) => {
        answerMap[a.question] = a.answer;
      });
      setAnswers(answerMap);
    }
  }, [attempt]);

  useEffect(() => {
    if (quiz.timeLimit && !attempt?.submittedAt) {
      const startTime = attempt?.startedAt ? new Date(attempt.startedAt).getTime() : Date.now();
      const timeLimitMs = quiz.timeLimit * 60 * 1000;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      setTimeRemaining(Math.floor(remaining / 1000));

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz.timeLimit, attempt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | number | boolean) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    const answerArray = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer,
    }));
    onSubmit(answerArray);
  };

  const isSubmitted = attempt?.submittedAt !== undefined;

  return (
    <div className="p-3">
      {timeRemaining !== null && timeRemaining > 0 && !isSubmitted && (
        <Alert variant="info" className="mb-3">
          <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
        </Alert>
      )}

      {questions.map((question, index) => (
        <Card key={question._id} className="mb-3">
          <Card.Header>
            <strong>Question {index + 1}</strong> ({question.points} points)
            {isSubmitted && attempt && (
              <span className={`ms-2 ${attempt.answers.find(a => a.question === question._id)?.isCorrect ? "text-success" : "text-danger"}`}>
                {attempt.answers.find(a => a.question === question._id)?.isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </span>
            )}
          </Card.Header>
          <Card.Body>
            <div
              className="mb-3"
              dangerouslySetInnerHTML={{ __html: question.question || "" }}
            />

            {question.questionType === "Multiple Choice" && (
              <div>
                {question.choices?.map((choice: string, choiceIndex: number) => (
                  <Form.Check
                    key={choiceIndex}
                    type="radio"
                    name={`question-${question._id}`}
                    id={`question-${question._id}-choice-${choiceIndex}`}
                    label={choice}
                    checked={answers[question._id] === choiceIndex}
                    onChange={() => handleAnswerChange(question._id, choiceIndex)}
                    disabled={isSubmitted}
                    className={isSubmitted && attempt?.answers.find(a => a.question === question._id && a.answer === choiceIndex)?.isCorrect ? "text-success" : ""}
                  />
                ))}
                {isSubmitted && attempt && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Correct answer: {question.choices?.[question.correctChoice || 0]}
                    </small>
                  </div>
                )}
              </div>
            )}

            {question.questionType === "True/False" && (
              <div>
                <Form.Check
                  type="radio"
                  name={`question-${question._id}`}
                  id={`question-${question._id}-true`}
                  label="True"
                  checked={answers[question._id] === true}
                  onChange={() => handleAnswerChange(question._id, true)}
                  disabled={isSubmitted}
                  className={isSubmitted && attempt?.answers.find(a => a.question === question._id && a.answer === true)?.isCorrect ? "text-success" : ""}
                />
                <Form.Check
                  type="radio"
                  name={`question-${question._id}`}
                  id={`question-${question._id}-false`}
                  label="False"
                  checked={answers[question._id] === false}
                  onChange={() => handleAnswerChange(question._id, false)}
                  disabled={isSubmitted}
                  className={isSubmitted && attempt?.answers.find(a => a.question === question._id && a.answer === false)?.isCorrect ? "text-success" : ""}
                />
                {isSubmitted && attempt && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Correct answer: {question.correctAnswer ? "True" : "False"}
                    </small>
                  </div>
                )}
              </div>
            )}

            {question.questionType === "Fill in the Blank" && (
              <div>
                <Form.Control
                  type="text"
                  value={answers[question._id] as string || ""}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={isSubmitted}
                  className={isSubmitted && attempt?.answers.find(a => a.question === question._id)?.isCorrect ? "border-success" : isSubmitted ? "border-danger" : ""}
                />
                {isSubmitted && attempt && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Possible correct answers: {question.possibleAnswers?.join(", ")}
                    </small>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}

      {isSubmitted && attempt && (
        <Alert variant={attempt.score === attempt.totalPoints ? "success" : "warning"} className="mb-3">
          <h5>Quiz Results</h5>
          <p>
            <strong>Score:</strong> {attempt.score} / {attempt.totalPoints} points
          </p>
          <p>
            <strong>Percentage:</strong> {attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0}%
          </p>
        </Alert>
      )}

      {!isSubmitted && (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="danger" size="lg" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}

