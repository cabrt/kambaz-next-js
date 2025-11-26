import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

const COURSES_API = `${HTTP_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(COURSES_API);
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
  const { data } = await axiosWithCredentials.post(COURSES_API, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

interface CourseUpdate {
  _id: string;
  name?: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  department?: string;
  credits?: number;
}

export const updateCourse = async (course: CourseUpdate) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

interface ModuleInput {
  name: string;
  course: string;
  description?: string;
}

export const createModuleForCourse = async (courseId: string, module: ModuleInput) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

