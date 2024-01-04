import 'dotenv/config';
import User from '../users/model.js';

const userRoles = process.env.USER_ROLES;

export const isAuthenticated = () => async (req, res) => {
  if (!req.user) {
    res.status(401).send('Access Denied / Forbidden');
  } else {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      res.status(401).send('Access Denied / Forbidden');
    }
  }
};

export const isAdmin = () => async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(401).send('Access Denied / Forbidden');
  }
};

export const hasRole = (role) => async (req, res) => {
  if (!req.user || userRoles.indexOf(role) >= userRoles.indexOf(req.user.role)) {
    res.status(401).send('Access Denied / Forbidden');
  }
};
