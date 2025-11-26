import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

if (!HTTP_SERVER) {
  console.error("NEXT_PUBLIC_HTTP_SERVER is not set! API calls will fail.");
  if (typeof window !== "undefined") {
    console.error("Current environment:", {
      NEXT_PUBLIC_HTTP_SERVER: process.env.NEXT_PUBLIC_HTTP_SERVER,
      NODE_ENV: process.env.NODE_ENV,
    });
  }
}

const COURSES_API = HTTP_SERVER ? `${HTTP_SERVER}/api/courses` : "";

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
  if (!HTTP_SERVER || !COURSES_API) {
    throw new Error("Server URL not configured. NEXT_PUBLIC_HTTP_SERVER environment variable is missing.");
  }
  console.log("Creating course:", { url: COURSES_API, course });
  try {
    const { data } = await axiosWithCredentials.post(COURSES_API, course);
    return data;
  } catch (error: unknown) {
    console.error("Create course error details:", {
      url: COURSES_API,
      httpServer: HTTP_SERVER,
      error: error,
    });
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown } };
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
    }
    throw error;
  }
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

