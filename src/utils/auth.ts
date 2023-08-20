import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config  from '../config/keys'

export const generateAccessToken = (userId) => {
  const payload = {
    sub: userId,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: Number(config.jwt.expires || 3600),
  });
};

export const hashPassword = async (password, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

export const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};


