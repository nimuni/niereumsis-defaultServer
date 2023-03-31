import express from 'express';
const router = express.Router();
import fileService from'../service/fileService';

// 기본업로드. 드라이브를 이용해서 올리는 것 말고,
// 서버에 프로필 이미지나 기타 자료를 업로드 할 때 사용.
router.post('/upload', async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
    // 파일 업로드 처리
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const filesInfo = await fileService.upload(files);
    res.send({ fileIds: filesInfo.map((e) => e._id.toString()) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 기본 다운로드. 업로드된 파일의 ID기반으로 해당 파일을 다운로드.
router.get('/download/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const filePath = await fileService.getFileData(_id);
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
