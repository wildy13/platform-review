import passport from 'passport';
import { Strategy } from 'passport-local';

const localAuthenticate = async (User, email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Invalid Email or Password' });
    }

    const authPassword = await user.verifyPasswordSync(password);

    if (!authPassword) {
      return done(null, false, { message: 'Invalid Email or Password' });
    }

    return done(null, user.profile);
  } catch (error) {
    return done(error);
  }
};

export default (User) => {
  passport.use(
    new Strategy(
      { usernameField: 'email', passwordField: 'password' },
      (email, password, done) => localAuthenticate(User, email, password, done),
    ),
  );
};
