import Joi  from 'joi'
import { password, url }  from '../../utils/customValidation'

export const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    avatar: Joi.string().custom(url).max(255),
  }),
};

export const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};


