"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { FaUserCircle, FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import * as usersClient from "../../../Users/client";
import * as courseClient from "../../client";
import * as enrollmentsClient from "../../../Enrollments/client";
import PeopleDetails from "./Details";

interface User {
  _id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: "STUDENT" | "FACULTY" | "ADMIN" | "TA";
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
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

export default function PeopleTable() {
  const params = useParams();
  const cid = params?.cid as string | undefined;
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "STUDENT" as "STUDENT" | "FACULTY" | "ADMIN" | "TA",
    loginId: "",
    section: "",
  });

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await courseClient.findUsersForCourse(cid as string);
      setUsers(fetchedUsers);
      setError("");
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          setError("Failed to load users. Please try again.");
        }
      } else {
        setError("Failed to load users. Please try again.");
      }
      setUsers([]);
    }
  }, [cid]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      role: "STUDENT",
      loginId: "",
      section: "",
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
    setError("");
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "", // Don't pre-fill password for security
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob || "",
      role: user.role,
      loginId: user.loginId || "",
      section: user.section || "",
    });
    setShowEditModal(true);
    setError("");
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setError("");
  };

  const handleCreateSubmit = async () => {
    try {
      if (!formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.email) {
        setError("Please fill in all required fields");
        return;
      }

      const newUser = await usersClient.createUser({
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        role: formData.role,
        loginId: formData.loginId,
        section: formData.section,
      });

      // Enroll the new user in the course
      await enrollmentsClient.enrollUserInCourse(newUser._id, cid as string);
      
      // Refresh the user list
      await fetchUsers();
      setShowCreateModal(false);
      resetForm();
      setError("");
    } catch (error: unknown) {
      console.error("Failed to create user:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Failed to create user. Please try again.");
      } else {
        setError("Failed to create user. Please try again.");
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!selectedUser) return;
      
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("Please fill in all required fields");
        return;
      }

      const updateData: usersClient.UpdateUserInput = {
        _id: selectedUser._id,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        role: formData.role,
        loginId: formData.loginId,
        section: formData.section,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersClient.updateUser(updateData);
      
      // Refresh the user list
      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      setError("");
    } catch (error: unknown) {
      console.error("Failed to update user:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Failed to update user. Please try again.");
      } else {
        setError("Failed to update user. Please try again.");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedUser) return;

      await usersClient.deleteUser(selectedUser._id);
      
      // Refresh the user list
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
      setError("");
    } catch (error: unknown) {
      console.error("Failed to delete user:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Failed to delete user. Please try again.");
      } else {
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div id="wd-people-table">
      {selectedUserId && (
        <PeopleDetails
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onRefresh={fetchUsers}
        />
      )}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      
      {isFaculty && (
        <div className="mb-3">
          <Button variant="danger" onClick={handleCreateClick}>
            <FaPlus className="me-2" />
            Add User
          </Button>
        </div>
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {isFaculty && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span
                  onClick={() => setSelectedUserId(user._id)}
                  style={{ cursor: "pointer", color: "red" }}
                  className="text-decoration-none"
                >
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name text-danger">{user.firstName}</span>{" "}
                  <span className="wd-last-name text-danger">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity || "N/A"}</td>
              <td className="wd-total-activity">{user.totalActivity || "N/A"}</td>
              {isFaculty && (
                <td>
                  <FaPencil
                    className="me-3 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(user)}
                  />
                  <FaTrash
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteClick(user)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "STUDENT" | "FACULTY" | "ADMIN" | "TA" })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="TA">TA</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.loginId}
                onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleCreateSubmit}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled
              />
              <Form.Text className="text-muted">Username cannot be changed</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (leave blank to keep current)</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password to change"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "STUDENT" | "FACULTY" | "ADMIN" | "TA" })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="TA">TA</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.loginId}
                onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          Are you sure you want to delete user{" "}
          <strong>
            {selectedUser?.firstName} {selectedUser?.lastName}
          </strong>
          ? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
