import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

export default async () => {
  // 몽구스와 몽고디비 연결하는 부분
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URI, {
      dbName: process.env.MONGO_DB_NAME,
      useNewUrlParser: true,
    });
    console.log('몽고디비 연결 성공');

    mongoose.connection.on('error', (err) => {
      console.log('몽고디비 연결 에러', err);
      console.log(err)
    });
    mongoose.connection.addListener('disconnected', () => {
      console.log('몽고 디비 연결이 끊어졌습니다. 연결을 재시도 합니다.');
    });
  } catch (error) {
    console.log(err);
  }
};


mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});
