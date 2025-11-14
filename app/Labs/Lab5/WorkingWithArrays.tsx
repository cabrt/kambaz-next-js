"use client";

import React, { useState } from "react";
import { FormControl, FormCheck } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });
  const API = `${HTTP_SERVER}/lab5/todos`;

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos </a><hr/>
      <h4>Filtering Array Items</h4>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary"
         href={`${API}?completed=true`}>
        Get Completed Todos
      </a><hr/>
      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary"
         href={`${API}/create`}>
        Create Todo
      </a><hr/>
      <h4>Retrieving an Item from an Array by ID</h4>
      <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todo.id}`}>
        Get Todo by ID
      </a>
      <FormControl id="wd-todo-id" defaultValue={todo.id} className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
      <hr />
      <h4>Deleting from an Array</h4>
      <a id="wd-delete-todo" className="btn btn-primary float-end" href={`${API}/${todo.id}/delete`}>
        Delete Todo with ID = {todo.id}
      </a>
      <FormControl defaultValue={todo.id} className="w-50" id="wd-todo-id-delete"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
      <hr />
      <h4>Updating an Item in an Array</h4>
      <a id="wd-update-todo" href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`} className="btn btn-primary float-end">
        Update Todo
      </a>
      <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      <FormControl defaultValue={todo.title} className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
      <br /><br /><hr />
      <h4>Updating Todo Properties</h4>
      <div className="mb-3">
        <a id="wd-complete-todo" href={`${API}/${todo.id}/completed/${todo.completed}`} className="btn btn-primary float-end">
          Complete Todo ID = {todo.id}
        </a>
        <FormCheck type="checkbox" id="wd-todo-completed"
          checked={todo.completed} onChange={(e) =>
            setTodo({ ...todo, completed: e.target.checked })} />
        <label htmlFor="wd-todo-completed" className="ms-2">Completed</label>
      </div>
      <div className="mb-3">
        <a id="wd-describe-todo" href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`} className="btn btn-primary float-end">
          Describe Todo ID = {todo.id}
        </a>
        <FormControl defaultValue={todo.description} className="w-50"
          id="wd-todo-description"
          onChange={(e) => setTodo({ ...todo, description: e.target.value })} />
        <label htmlFor="wd-todo-description" className="ms-2">Description</label>
      </div>
      <hr />
    </div>
  );
}

