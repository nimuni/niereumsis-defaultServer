import VerifyCode from '../../mongoose/schema/verifyCode';
export const upsertOne = async (filter, update) => {
  const option = { new: true, upsert: true };
  const newVerifyCode = await VerifyCode.findOneAndUpdate(filter, update, option);
  return newVerifyCode;
};
export const findOneAndUpdate = async (findObj, changeObj) => {
  const foundData = await VerifyCode.findOneAndUpdate(findObj, changeObj, { returnOriginal: false });
  return foundData;
};
