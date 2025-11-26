import model from "./model";

export interface User {
  _id?: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: Date | string;
  role?: string;
  loginId?: string;
  section?: string;
  lastActivity?: Date | string;
  totalActivity?: string;
}

export const createUser = (user: User) => model.create(user);

export const findAllUsers = () => model.find().lean();

export const findUsersByRole = (role: string) => model.find({ role: role }).lean();

export const findUsersByPartialName = (partialName: string) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  }).lean();
};

export const findUsersByRoleAndName = (role: string, partialName: string) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    role: role,
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  }).lean();
};

export const findUserById = (userId: string) => model.findById(userId);

export const findUserByUsername = (username: string) =>
  model.findOne({ username: username });

export const findUserByCredentials = (username: string, password: string) =>
  model.findOne({ username, password });

export const updateUser = (userId: string, user: Partial<User>) =>
  model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId: string) => model.deleteOne({ _id: userId });

