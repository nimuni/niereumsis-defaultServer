import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  return jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
export const generateRefreshToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  // return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return jwt.sign({ data: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
export const accessTokenVerify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        reject(false);
      } else {
        resolve(decoded);
      }
    });
  });
};
export const refreshTokenVerify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        reject(false);
      } else {
        resolve(decoded);
      }
    });
  });
};

// middleware
export const verifyJwt = async (req, res, next) => {
  // 0: 헤더 1:payload-저장한정보 2:verify signature
  // 처리가 안되면 세션만료인 것으로 판별.
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    // access 토큰 인증완료.
    const decodedAccessToken = await this.accessTokenVerify(accessToken);
    req.user = decodedAccessToken.data;
    next();
  } catch (error) {
    // access token이 만료된 경우
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }

      // refresh token 검증
      try {
        const decodedInfo = await this.refreshTokenVerify(refreshToken);
        const userInfo = {
          provider: decodedInfo.data.provider,
          id: decodedInfo.data.id,
          _id: decodedInfo.data._id,
          email: decodedInfo.data.email,
          email_verified: decodedInfo.data.email_verified,
          role: decodedInfo.data.role,
        };

        // refresh token으로 새로운 access token과 refresh token 발행
        const newAccessToken = this.generateAccessToken(userInfo);
        const newRefreshToken = this.generateRefreshToken(userInfo);

        // 새로 발행된 토큰 쿠키에 저장
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict' /* https 사용하는 경우. secure:true */ });

        req.user = userInfo;
        console.log('req.user');
        console.log(req.user);

        next();
      } catch (error) {
        // return res.status(401).json({ message: 'Invalid refresh token' });
        return res.redirect(`/login`);
      }
    } else {
      console.log(error.name);
      console.log(error);
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }
};
