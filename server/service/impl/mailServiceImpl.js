import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: process.env.MAIL_SERVICE,
  // host를 gmail로 설정
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // Gmail 주소 입력, 'testmail@gmail.com'
    user: process.env.MAIL_USER,
    // Gmail 패스워드 입력
    pass: process.env.MAIL_PWD,
  },
});

export const getContents = async (type, data) => {
  console.log('call getContents');
  const findIdDiv = `
<div style='border:1px solid #c8c8c8; padding:5px;'>
  <p style='color:black'>mycloud9x 서비스의 ID를 찾기 위한 이메일 입니다.</p>
  <p style='color:black'>귀하의 ID는 다음과 같습니다.</p>
  <h2>${data.id}</h2>
  <br>
  <p style='color:red; font-size:8pt;'>본 메일은 발신전용입니다.</p>
</div>`;
  const findPwdDiv = `
<div style='border:1px solid #c8c8c8; padding:5px;'>
  <p style='color:black'>mycloud9x 서비스의 비밀번호 재설정 이메일 입니다.</p>
  <p style='color:black'>설정된 임시 비밀번호는 다음과 같습니다.</p>
  <h2>${data.password}</h2>
  <br>
  <p style='color:red; font-size:8pt;'>본 메일은 발신전용입니다.</p>
</div>`;
  const verifyEmail = `
<div style='border:1px solid #c8c8c8; padding:5px;'>
  <p style='color:black'>mycloud9x 서비스의 이메일 인증을 위한 메일입니다..</p>
  <p style='color:black'>아래 버튼을 눌러서 인증을 완료해주세요.</p>
  <a  href="${process.env.URI_ORIGIN}:${process.env.PORT}/api/user/verifyCode/${data.verifyCode}" 
      onclick="window.open(this.href, '_blank'); return false;">
    인증하기
  </a>
  <br>
  <p style='color:red; font-size:8pt;'>본 메일은 발신전용입니다.</p>
</div>  
  `;

  switch (type) {
    case 'id':
      return findIdDiv;
    case 'pwd':
      return findPwdDiv;
    case 'verifyEmail':
      return verifyEmail;
    default:
      return ``;
  }
};

export const sendMail = async (email, contents) => {
  console.log('call sendMail');
  let info = await transporter.sendMail({
    from: `mycloud9x`,
    to: email,
    subject: contents.subject,
    html: contents.html,
  });

  console.log('Message sent: %s', info.messageId);
  return true;
};
