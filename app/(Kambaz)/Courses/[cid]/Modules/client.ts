import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const MODULES_API = `${HTTP_SERVER}/api/modules`;

interface Module {
  _id: string;
  name: string;
  course: string;
  description?: string;
  editing?: boolean;
}

export const updateModule = async (module: Module) => {
  const { data } = await axiosWithCredentials.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

