import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileImpl from './impl/fileServiceImpl';
import fs from 'fs';
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY, // Access key ID
  secretAccesskey: process.env.AWS_SECRET_KEY, // Secret access key
  region: process.env.AWS_REGION //Region
})
const s3 = new AWS.S3();

export const upload = async (files) => {
  console.log('call fileService upload');
  let filesInfo = [];
  for (let file of files) {
    // 파일 정보 생성
    const fileUUID = uuidv4();
    const fileName = `${fileUUID}${path.extname(file.name)}`;

    // 파일 저장
    const currentPath = path.join(this.getUploadablePath(), fileName);
    await file.mv(currentPath);

    // 파일 정보 저장
    const savedFileData = await fileImpl.insertOne({
      name: file.name,
      uuid: fileUUID,
      mimetype: file.mimetype,
      size: file.size,
      currentPath: currentPath,
    });
    // filesInfo.push(savedFileData._id.toString())
    filesInfo.push(savedFileData);
  }
  return filesInfo;
};
export const getFileData = async (fileId) => {
  const fileData = await fileImpl.findOne({ _id: fileId });
  if (!fileData) {
    throw new Error('File not found');
  }
  const filePath = fileData.currentPath;
  return filePath;
  // return {
  //   filePath: filePath,
  //   fileName: fileData.name
  // }
};
export const removeFile = async (fileId) => {
  try {
    const fileInfo = await this.getFileData(fileId);
    fs.unlinkSync(fileInfo.currentPath);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const removeFiles = async (savedFileIdArray) => {
  try {
    const deletePromises = savedFileIdArray.map((id) => {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(await this.removeFile(id));
        } catch (error) {
          reject(error);
        }
      });
    });
    let result = await Promise.all(deletePromises);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
