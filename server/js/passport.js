import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20'
const LocalStrategy = passportLocal.Strategy
const GoogleStrategy = passportGoogle.Strategy
import userService from '../service/userService';
import userServiceImpl from '../service/impl/userServiceImpl';

export default () => {
  passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    console.log('call serializeUser');
    console.log(user);
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => {
    // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    // serializeUser에서 넘긴 user, 즉 Google id가 읽힘
    console.log('call deserializeUser');
    console.log(user);
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(
    new LocalStrategy(
      {
        // local 전략을 세움
        usernameField: 'id',
        passwordField: 'password',
        session: true, // 세션에 저장 여부
        passReqToCallback: false, // true 변경시 뒤 콜백이 req, id, password, done 로 변경됨
      },
      async (id, password, done) => {
        const projectionUserObj = {
          id: 1,
          _id: 1,
          provider: 1,
          password: 1,
          email: 1,
          email_verified: 1,
          role: 1,
        };
        const user = await userServiceImpl.findOne({ id: id }, projectionUserObj);
        if (user) {
          if (user.provider != 'ownAPI') return done(null, false, { message: '자체 가입회원이 아닙니다.' });
          if (!user.email_verified) return done(null, false, { message: '이메일 인증이 진행되지 않았습니다.' });
          user.comparePassword(password, (passError, isMatch) => {
            if (isMatch) {
              return done(null, {
                id: user.id,
                _id: user._id,
                provider: user.provider,
                email: user.email,
                email_verified: user.email_verified,
                role: user.role,
              });
            } else {
              return done(null, false, { message: '비밀번호가 틀렸습니다' });
            }
          });
        } else {
          return done(null, false, { message: '존재하지 않는 아이디입니다' });
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const projectionUserObj = {
            _id: 1,
            id: 1,
            provider: 1,
            password: 1,
            email: 1,
            email_verified: 1,
            role: 1,
          };
          let exUser = await userServiceImpl.findOne({ id: profile.id }, projectionUserObj);
          if (exUser) {
            // 이미가입된경우, provider가 google이면
            if (exUser.provider == 'google') {
              // 로그인시킨다
              delete exUser.password;
              done(null, exUser);
            } else {
              // 에러를 뱉는다. 다른 계정으로 가입된 경우임.
              done(new Error('이미 Google이 아닌 다른 방식으로 가입된 계정입니다.'));
            }
          } else {
            console.log('exuser없음.');
            console.log(profile);
            // 회원가입시키고 로그인시킨다.
            let newUser = await userService.register({
              provider: 'google',
              id: profile.id,
              email: profile.emails[0].value,
              email_verified: profile.emails[0].verified,
            });
            done(null, {
              _id: newUser._id,
              provider: newUser.provider,
              id: newUser.id,
              email: newUser.email,
              email_verified: newUser.email_verified,
              role: newUser.role,
            });
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
