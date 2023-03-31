import userImpl from './impl/userServiceImpl';
import { encrypt, decrypt } from '../js/crypto';
import { isEmpty, generateRandomString } from '../js/common.util';
import mailImpl from './impl/mailServiceImpl';
import verifyCodeImpl from './impl/VerifyCodeServiceImpl';

const projectionUserObj = {
  provider: 1,
  id: 1,
  _id: 1,
  email: 1,
  email_verified: 1,
  role: 1,
  createdAt: 1,
  updatedAt: 1,
};
export const register = async (reqBody) => {
  // provider: ‘google’ // google, ownAPI, kakao
  // id: ‘사용자입력아이디’ // ‘104226972280412090842’
  // password: ‘’ // ownAPI인 경우에만 사용
  // email: ‘사용자입력이메일’
  // email_verified: false
  // 전송된 email에서 확인버튼 누르면 최종가입완료.
  try {
    if (reqBody.provider != 'ownAPI' && reqBody.provider != 'google' && reqBody.provider != 'kakao') {
      throw new Error('provider 형식이 잘못되었음.');
    }
    let newUserObj = {
      provider: reqBody.provider,
      id: reqBody.id,
      email: reqBody.email,
      email_verified: reqBody.email_verified,
      nickname: reqBody.id,
    };
    if (reqBody.provider == 'ownAPI') {
      newUserObj.email_verified = false;
      if (reqBody?.password) newUserObj.password = encrypt(reqBody.password);

      const user = await userImpl.insertOne(newUserObj);

      // 인증용 이메일 보내기
      await this.verifyEmail({ email: user.email });
      const folderObj = {
        parentFolderId: 'root',
        name: '내 폴더',
        owner: user._id,
      };

      return user;
    } else {
      const user = await userImpl.insertOne(newUserObj);
      return user;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findAll = async (reqBody) => {
  try {
    let findObj = {};
    if (!isEmpty(reqBody?.provider)) findObj.provider = reqBody.provider;
    if (!isEmpty(reqBody?.id)) findObj.id = reqBody.id;
    if (!isEmpty(reqBody?._id)) findObj.id = reqBody._id;
    if (!isEmpty(reqBody?.email)) findObj.email = reqBody.email;
    if (!isEmpty(reqBody?.email_verified)) findObj.email_verified = reqBody.email_verified;
    if (!isEmpty(reqBody?.role)) findObj.role = reqBody.role;

    const users = await userImpl.findAll(findObj, projectionUserObj);
    return users;
  } catch (error) {
    throw error;
  }
};

export const findOne = async (reqBody) => {
  try {
    let findObj = {};
    if (!isEmpty(reqBody?.provider)) findObj.provider = reqBody.provider;
    if (!isEmpty(reqBody?.id)) findObj.id = reqBody.id;
    if (!isEmpty(reqBody?._id)) findObj.id = reqBody._id;
    if (!isEmpty(reqBody?.email)) findObj.email = reqBody.email;
    if (!isEmpty(reqBody?.email_verified)) findObj.email_verified = reqBody.email_verified;
    if (!isEmpty(reqBody?.role)) findObj.role = reqBody.role;

    const user = await userImpl.findOne(findObj, projectionUserObj);
    return user;
  } catch (error) {
    throw error;
  }
};
export const checkPassword = async (findObj, reqBody) => {
  try {
    const user = await userImpl.findOne(findObj, { id: 1, password: 1 });
    return reqBody.password == decrypt(user.password);
  } catch (error) {
    throw error;
  }
};

export const update = async (findObj, reqBody) => {
  try {
    let changeObj = {};
    if (!isEmpty(reqBody?.password)) changeObj.password = encrypt(reqBody.password);
    if (!isEmpty(reqBody?.email)) changeObj.email = reqBody.email;
    if (!isEmpty(reqBody?.email_verified)) changeObj.email_verified = reqBody.email_verified;
    if (!isEmpty(reqBody?.role)) changeObj.role = reqBody.role;

    const changedUser = await userImpl.findOneAndUpdate(findObj, changeObj, projectionUserObj);
    return changedUser;
  } catch (error) {
    throw error;
  }
};

export const login = async (idAndPwdObj) => {
  try {
    const user = await userImpl.findOne({ id: idAndPwdObj?.id });
    if (decrypt(user.password) == idAndPwdObj?.password) {
      return {
        id: user.id,
        _id: user._id,
        provider: user.provider,
        email: user.email,
        email_verified: user.email_verified,
        role: user.role,
      };
    } else {
      // TODO. 일정 횟수 이상 로그인 실패하면 로그인 금지시키기.
      // user 스키마에 로그인 실패횟수 및 로그인 금지시간 설정
      return false;
    }
  } catch (error) {
    throw error;
  }
};

// export const delete = async (findObj, reqBody) => {
//   try {
//     // TODO. 사용여부만 false로 바꾸는 식으로 진행예정. 실제삭제x 데이터 업데이트만.
//     let changeObj = {}
//     if(!isEmpty(reqBody?.provider))
//       changeObj.provider = reqBody.provider;
//     if(!isEmpty(reqBody?.id))
//       changeObj.id = reqBody.id;
//     if(!isEmpty(reqBody?.password))
//       changeObj.password = encrypt(reqBody.password);
//     if(!isEmpty(reqBody?.email))
//       changeObj.email = reqBody.email;
//     if(!isEmpty(reqBody?.email_verified))
//       changeObj.email_verified = reqBody.email_verified;

//     const changedUser = await userImpl.findOneAndUpdate(findObj, changeObj, projectionUserObj)
//     return changedUser;
//   } catch (error) {
//     throw error
//   }
// }

export const findAccount = async (type, reqBody) => {
  try {
    let findObj = {};
    findObj.email = reqBody.email;
    const user = await userImpl.findOne(findObj, projectionUserObj);

    let subject, html;
    switch (type) {
      case 'id':
        console.log('step id');
        subject = 'mycloud9x 고객님의 ID 입니다.';
        html = await mailImpl.getContents('id', user);
        console.log(html);
        await mailImpl.sendMail(reqBody.email, { subject, html });
        break;
      case 'pwd':
        console.log('step pwd');
        let tempPassword = generateRandomString(10);
        await userImpl.findOneAndUpdate({ id: user.id }, { password: encrypt(tempPassword) }, projectionUserObj);

        subject = 'mycloud9x 고객님의 임시 비밀번호가 설정되었습니다.';
        html = await mailImpl.getContents('pwd', { password: tempPassword });
        await mailImpl.sendMail(reqBody.email, { subject, html });
        break;
      default:
        throw new Error('no findAccount type');
    }
    return;
  } catch (error) {
    console.log('error in findAccount');
    console.log(error);
    throw error;
  }
};
export const verifyEmail = async (userObj) => {
  try {
    // 인증번호 랜덤 생성 및 DB에 저장
    const verifyCode = generateRandomString(16);
    let limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 1);
    const filter = {
      email: userObj.email,
    };
    const update = {
      verify_code: verifyCode,
      verified: false,
      limit: limitDate,
    };
    // 인증번호 입력 특정시간동안 안하면 재 요청/생성 하게 upsert콜.
    // 가입 시 정보가 있으면 다시 verifyEmail 호출하게.
    await verifyCodeImpl.upsertOne(filter, update);

    // 이메일전송
    // 이메일에 해당 인증번호의 url 연결버튼 설정
    let subject = 'mycloud9x 이메일 인증을 완료해주세요.';
    let html = await mailImpl.getContents('verifyEmail', { verifyCode: verifyCode });
    await mailImpl.sendMail(userObj.email, { subject, html });
  } catch (error) {
    throw error;
  }
};
export const verifyCode = async (code) => {
  console.log('call in userService verifyCode');
  console.log(code);
  try {
    const foundData = await verifyCodeImpl.findOneAndUpdate({ verify_code: code }, { verified: true });
    if (foundData) {
      const findObj = {
        email: foundData.email,
      };
      const changeObj = {
        email_verified: true,
      };
      const changedUser = await userImpl.findOneAndUpdate(findObj, changeObj, projectionUserObj);
      return changedUser;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error verifyCode');
    console.log(error);
  }
};
