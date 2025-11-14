import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export const USERS_API = `${HTTP_SERVER}/api/users`;

interface Credentials {
  username: string;
  password: string;
}

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

interface SignupUser {
  username: string;
  password: string;
}

export const signup = async (user: SignupUser) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

interface UpdateUser {
  _id: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  role?: string;
}

export const updateUser = async (user: UpdateUser) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

interface CourseInput {
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
  department?: string;
  credits?: number;
}

export const createCourse = async (course: CourseInput) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

