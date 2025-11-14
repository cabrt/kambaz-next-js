import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;
export const COURSES_API = `${HTTP_SERVER}/api/courses`;

export interface User {
  _id: string;
  username: string;
  password: string;
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

export interface CreateUserInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN" | "TA";
  loginId?: string;
  section?: string;
}

export interface UpdateUserInput {
  _id: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  role?: "STUDENT" | "FACULTY" | "ADMIN" | "TA";
  loginId?: string;
  section?: string;
}

/**
 * Get all users
 */
export const findAllUsers = async (): Promise<User[]> => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

/**
 * Get a specific user by ID
 */
export const findUserById = async (userId: string): Promise<User> => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}`);
  return response.data;
};

/**
 * Get all users enrolled in a specific course
 */
export const findUsersForCourse = async (courseId: string): Promise<User[]> => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

/**
 * Create a new user (Faculty only)
 */
export const createUser = async (user: CreateUserInput): Promise<User> => {
  const response = await axiosWithCredentials.post(USERS_API, user);
  return response.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (user: UpdateUserInput): Promise<User> => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
};

