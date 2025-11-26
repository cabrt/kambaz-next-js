"use client";

import { useEffect, useState, useCallback } from "react";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { Form } from "react-bootstrap";
import * as client from "../../../Account/client";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  role: string;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

interface PeopleDetailsProps {
  userId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function PeopleDetails({ userId, onClose, onRefresh }: PeopleDetailsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const saveUser = async () => {
    if (!user) return;
    
    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || user.firstName;
      const lastName = nameParts.slice(1).join(" ") || user.lastName;
      
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email: editingEmail ? email : user.email,
        role: editingRole ? role : user.role,
      };
      
      await client.updateUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);
      setEditingEmail(false);
      setEditingRole(false);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await client.deleteUser(userId);
      if (onRefresh) {
        onRefresh();
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const fetchedUser = await client.findUserById(userId);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  useEffect(() => {
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25" style={{ zIndex: 1000 }}>
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
        style={{ zIndex: 1001 }}
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={() => {
              setEditing(true);
              setName(`${user.firstName} ${user.lastName}`);
            }}
            className="float-end fs-5 mt-2 wd-edit"
            style={{ cursor: "pointer" }}
          />
        )}
        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
            style={{ cursor: "pointer" }}
          />
        )}
        {!editing && (
          <div
            className="wd-name"
            onClick={() => {
              setEditing(true);
              setName(`${user.firstName} ${user.lastName}`);
            }}
            style={{ cursor: "pointer" }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <Form.Control
            className="w-50 wd-edit-name"
            defaultValue={`${user.firstName} ${user.lastName}`}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
            autoFocus
          />
        )}
      </div>
      <b>Roles:</b>{" "}
      {!editingRole ? (
        <>
          <span className="wd-roles">{user.role}</span>
          <FaPencil
            onClick={() => {
              setEditingRole(true);
              setRole(user.role);
            }}
            className="ms-2 fs-6"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : (
        <>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="d-inline-block w-50 wd-edit-role"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TA">TA</option>
            <option value="FACULTY">FACULTY</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </Form.Select>
          <FaCheck
            onClick={saveUser}
            className="ms-2 fs-6"
            style={{ cursor: "pointer" }}
          />
        </>
      )}
      <br />
      <b>Email:</b>{" "}
      {!editingEmail ? (
        <>
          <span className="wd-email">{user.email}</span>
          <FaPencil
            onClick={() => {
              setEditingEmail(true);
              setEmail(user.email);
            }}
            className="ms-2 fs-6"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : (
        <>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="d-inline-block w-50 wd-edit-email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
            autoFocus
          />
          <FaCheck
            onClick={saveUser}
            className="ms-2 fs-6"
            style={{ cursor: "pointer" }}
          />
        </>
      )}
      <br />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId || "N/A"}</span>
      <br />
      <b>Section:</b> <span className="wd-section">{user.section || "N/A"}</span>
      <br />
      <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity || "N/A"}</span>
      <hr />
      <button
        onClick={handleDelete}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="btn btn-secondary float-start float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}

