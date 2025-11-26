"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import * as client from "../client";
import PeopleDetails from "./Details";

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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const applyFilters = useCallback(async (currentRole: string, currentName: string) => {
    try {
      console.log("Applying filters - role:", currentRole, "name:", currentName);
      let users;
      if (currentRole && currentName) {
        // Both filters active
        console.log("Calling findUsersByRoleAndName");
        users = await client.findUsersByRoleAndName(currentRole, currentName);
      } else if (currentRole) {
        // Only role filter
        console.log("Calling findUsersByRole");
        users = await client.findUsersByRole(currentRole);
      } else if (currentName) {
        // Only name filter
        console.log("Calling findUsersByPartialName");
        users = await client.findUsersByPartialName(currentName);
      } else {
        // No filters
        console.log("Calling findAllUsers");
        users = await client.findAllUsers();
      }
      console.log("Received users:", users?.length);
      setUsers(users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }, []);

  const filterUsersByRole = (newRole: string) => {
    console.log("Role filter changed to:", newRole);
    setRole(newRole);
  };

  const filterUsersByName = (newName: string) => {
    console.log("Name filter changed to:", newName);
    setName(newName);
  };

  const createUser = async () => {
    try {
      await client.createUser({
        firstName: "New",
        lastName: `User${users.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `email${users.length + 1}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      });
      // Refresh the user list to show the new user
      await applyFilters(role, name);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  // Apply filters whenever role or name changes
  useEffect(() => {
    applyFilters(role, name);
  }, [role, name, applyFilters]);

  return (
    <div>
      {selectedUserId && (
        <PeopleDetails
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onRefresh={() => applyFilters(role, name)}
        />
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Users</h3>
        <Button onClick={createUser} className="btn btn-danger wd-add-people">
          <FaPlus className="me-2" />
          Users
        </Button>
      </div>
      <div className="mb-3">
        <Form.Control
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search people"
          value={name}
          className="float-start w-25 me-2 wd-filter-by-name"
        />
        <Form.Select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </Form.Select>
        <div className="clearfix"></div>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
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
              <td className="wd-login-id">{user.loginId || "N/A"}</td>
              <td className="wd-section">{user.section || "N/A"}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity || "N/A"}</td>
              <td className="wd-total-activity">{user.totalActivity || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

