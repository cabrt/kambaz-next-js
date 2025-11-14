import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

/**
 * Enroll a user in a course
 * @param userId - User ID or "current" for the logged-in user
 * @param courseId - Course ID
 */
export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(ENROLLMENTS_API, { userId, courseId });
  return response.data;
};

/**
 * Unenroll a user from a course
 * @param userId - User ID or "current" for the logged-in user
 * @param courseId - Course ID
 */
export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  await axiosWithCredentials.delete(ENROLLMENTS_API, { data: { userId, courseId } });
};

/**
 * Get all enrollments for the currently logged-in user
 */
export const findMyEnrollments = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/current/enrollments`);
  return response.data;
};

/**
 * Get all enrollments for a specific user
 */
export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/enrollments`);
  return response.data;
};

/**
 * Get all enrollments for a specific course
 */
export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/enrollments`);
  return response.data;
};

/**
 * Get all enrollments (admin/faculty view)
 */
export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(ENROLLMENTS_API);
  return response.data;
};

