/* eslint-disable promise/no-callback-in-promise */
import passport from 'passport';
import { ErrorHandler } from '../utils/error'
import { roleRights } from '../config/roles'

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ErrorHandler(401, 'You are not authenticated'));
  }
  res.locals.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ErrorHandler(403, 'You are not authorized'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
      req,
      res,
      next
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
