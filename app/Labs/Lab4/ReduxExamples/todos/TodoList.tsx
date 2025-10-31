"use client";

import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

interface Todo {
  id: string;
  title: string;
}

interface RootState {
  todosReducer: {
    todos: Todo[];
    todo: Todo;
  };
}

export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="mb-3">Todo List</h2>
          
          <TodoForm />

          <div className="list-group">
            {todos.map((todo: Todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        </div>
      </div>
      <hr/>
    </div>
  );
}
