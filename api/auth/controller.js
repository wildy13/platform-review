import passport from 'passport';

const authLocal = async (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      const error = err || info;
      if (error) {
        throw new Error(error.message);
      }
      if (!user) {
        throw new Error('Something went wrong, please try again');
      }

      const {
        id, name, email, role,
      } = user;

      const token = await res.jwtSign({
        id, name, email, role,
      });

      resolve({ token });
    } catch (error) {
      reject(error);
    }
  })(req, res);
});

export const login = async (req, res) => {
  try {
    const token = await authLocal(req, res);
    res.status(200).send(token);
  } catch (error) {
    res.status(401).send(new Error(error.message));
  }
};

export const logout = (req, res) => {
  try {
    res.status(200).send('logout');
  } catch (error) {
    res.status(500).send(error);
  }
};
