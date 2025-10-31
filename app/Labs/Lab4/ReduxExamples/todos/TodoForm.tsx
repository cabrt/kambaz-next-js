"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

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

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <div className="d-flex gap-2 mb-3">
      <input 
        type="text"
        className="form-control"
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        placeholder="Enter todo..."
      />
      <button 
        onClick={() => dispatch(updateTodo(todo))}
        className="btn btn-warning"
        id="wd-update-todo-click"
      >
        Update
      </button>
      <button 
        onClick={() => dispatch(addTodo(todo))}
        className="btn btn-success"
        id="wd-add-todo-click"
      >
        Add
      </button>
    </div>
);}
