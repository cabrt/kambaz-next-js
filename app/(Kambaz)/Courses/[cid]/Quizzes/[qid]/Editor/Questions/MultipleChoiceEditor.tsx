"use client";

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaTrash, FaCheck } from "react-icons/fa";
import { Question } from "./client";
import RichTextEditor from "../../../../../../components/RichTextEditor";

interface MultipleChoiceEditorProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export default function MultipleChoiceEditor({ question, onSave, onCancel }: MultipleChoiceEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [points, setPoints] = useState(question.points || 0);
  const [questionText, setQuestionText] = useState(question.question || "");
  const [choices, setChoices] = useState<string[]>(question.choices || [""]);
  const [correctChoice, setCorrectChoice] = useState(question.correctChoice ?? 0);

  useEffect(() => {
    if (question.choices && question.choices.length > 0) {
      setChoices(question.choices);
    } else {
      setChoices(["", ""]);
    }
  }, [question]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 1) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      if (correctChoice >= newChoices.length) {
        setCorrectChoice(Math.max(0, newChoices.length - 1));
      }
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSave = () => {
    const updatedQuestion: Question = {
      ...question,
      title,
      points,
      question: questionText,
      questionType: "Multiple Choice",
      choices: choices.filter(c => c.trim() !== ""),
      correctChoice,
    };
    onSave(updatedQuestion);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "200px" }}
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0">pts:</Form.Label>
          <Form.Control
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      <p className="text-muted mb-3">
        Enter your question and multiple answers, then select the one correct answer.
      </p>

      <Form.Group className="mb-5">
        <Form.Label><strong>Question:</strong></Form.Label>
        <RichTextEditor
          value={questionText}
          onChange={setQuestionText}
          placeholder="Enter your question text here..."
          height="150px"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Answers:</strong></Form.Label>
        {choices.map((choice, index) => (
          <div key={index} className="d-flex align-items-center gap-2 mb-2">
            <Form.Check
              type="radio"
              name="correctChoice"
              checked={correctChoice === index}
              onChange={() => setCorrectChoice(index)}
              className="me-2"
            />
            {correctChoice === index && (
              <FaCheck className="text-success me-2" />
            )}
            <Form.Control
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder="Possible Answer"
              className={correctChoice === index ? "border-success" : ""}
            />
            {choices.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveChoice(index)}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="link"
          className="text-danger p-0 mt-2"
          onClick={handleAddChoice}
        >
          <FaCheck className="me-1" /> + Add Another Answer
        </Button>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          {question._id === "new" ? "Save Question" : "Update Question"}
        </Button>
      </div>
    </div>
  );
}

