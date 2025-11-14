"use client";

import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
}

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };

  const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false, });
    setTodos([...todos, newTodo]);
  };

  const removeTodo = async (todo: Todo) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };

  const deleteTodo = async (todo: Todo) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: unknown) {
      console.log(error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setErrorMessage(axiosError.response?.data?.message || "Failed to delete todo");
      } else {
        setErrorMessage("Failed to delete todo");
      }
    }
  };

  const editTodo = (todo: Todo) => {
    const updatedTodos = todos.map(
      (t) => t.id === todo.id ? { ...todo, editing: true } : t
    );
    setTodos(updatedTodos);
  };

  const updateTodo = async (todo: Todo) => {
    try {
      await client.updateTodo(todo);
      setTodos((currentTodos) => currentTodos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setErrorMessage(axiosError.response?.data?.message || "Failed to update todo");
      } else {
        setErrorMessage("Failed to update todo");
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle onClick={createNewTodo} className="text-success float-end fs-3" id="wd-create-todo" />
        <FaPlusCircle onClick={postNewTodo} className="text-primary float-end fs-3 me-3" id="wd-post-todo" />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <FaTrash onClick={() => removeTodo(todo)} className="text-danger float-end mt-1" id="wd-remove-todo" />
            <TiDelete onClick={() => deleteTodo(todo)} className="text-danger float-end me-2 fs-3" id="wd-delete-todo" />
            <FaPencil onClick={() => editTodo(todo)} className="text-primary float-end me-2 mt-1" />
            <input type="checkbox" defaultChecked={todo.completed} className="form-check-input me-2 float-start"
              onChange={(e) => updateTodo({ ...todo, completed: e.target.checked }) } />
            {!todo.editing ? (
              <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                {todo.title}
              </span>
            ) : (
              <FormControl className="w-50 float-start" defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) =>
                  updateTodo({ ...todo, title: e.target.value })
                }
              />
            )}
          </ListGroupItem>
        ))}
      </ListGroup><hr />
    </div>
  );
}

