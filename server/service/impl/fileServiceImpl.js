import fs from 'fs';
import File from '../../db/schema/file';

// DB에 파일명을 생성함.
export const insertOne = async (fileObj) => {
  const newFile = new File(fileObj);
  return await newFile.save();
};
export const findAll = async (findObj) => {
  return await File.find(findObj);
};
export const findOne = async (findObj) => {
  return await File.findOne(findObj);
};
export const findOneAndUpdate = async (findObj, changeObj) => {
  return await File.findOneAndUpdate(findObj, changeObj, { returnOriginal: false });
};
export const findOneAndDelete = async (findObj) => {
  return await File.findOneAndDelete(findObj);
};
export const deleteMany = async (findObj) => {
  return await File.deleteMany(findObj);
};
