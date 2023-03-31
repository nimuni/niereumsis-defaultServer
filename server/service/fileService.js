import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileImpl from './impl/fileServiceImpl';
import fs from 'fs';

// 파일 저장 경로.
export const getUploadablePath = () => {
  // TODO. 가변적으로 변경되어야 함.
  // ex) 관리자가 지정해둔 폴더의 용량이 꽉차지 않았는지 계산 후 공간이 남는 위치로
  // 자동지정할 수 있도록 함수 구현.
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  // 1. DB?에서 지정된 폴더경로 불러오기
  // 2. 폴더들의 지정된 용량, 남은 저장공간 계산
  // 3. 여유가 있으면 폴더경로 리턴

  return uploadPath;
};
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
