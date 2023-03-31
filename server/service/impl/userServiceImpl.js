import User from '../../mongoose/schema/user';

export const insertOne = async (userObj) => {
  const newUser = new User(userObj);
  return await newUser.save();
};
export const findAll = async (findObj, projectionUserObj) => {
  const users = await User.find(findObj).select(projectionUserObj);
  return users;
};
export const findOne = async (findObj, projectionUserObj) => {
  return await User.findOne(findObj).select(projectionUserObj);
};
export const findOneAndUpdate = async (findObj, changeObj, projectionUserObj) => {
  return await User.findOneAndUpdate(findObj, changeObj, { returnOriginal: false }).select(projectionUserObj);
};
export const findOneAndDelete = async (findObj) => {
  return await User.findOneAndDelete(findObj);
};
