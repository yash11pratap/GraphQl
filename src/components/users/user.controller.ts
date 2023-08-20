import { pick } from 'lodash'
import { ErrorHandler } from '../../utils/error'
import  User  from '../users/user.model'
import Profile from '../profiles/profile.model'
import Tweet from '../tweets/tweet.model'
import { Request,Response,NextFunction } from 'express'
export const getUsers = async (req : Request, res : Response) => {
  const filters = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const users = await (User as any).paginate(filters, options);

  res.json(users);
};

export const getUserById = async (req : Request, res : Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  res.json({ user });
};

export const createUser = async (req : Request, res : Response) => {
  const userBody = pick(req.body, ['name', 'username', 'email', 'password', 'role', 'avatar']);

  if (await (User as any).isEmailTaken(userBody.email)) {
    throw new ErrorHandler(400, 'Email already taken');
  }

  if (await (User as any).isUsernameTaken(userBody.username)) {
    throw new ErrorHandler(400, 'Username already taken');
  }

  const user = new User(userBody);
  // Create user profile
  const profile = new Profile({ user: user.id });

  await Promise.all([user.save(), profile.save()]);

  res.status(201).json({ user });
};

export const updateUser = async (req : Request, res : Response) => {
  const newValues = pick(req.body, ['name', 'username', 'email', 'password', 'role', 'avatar']);
  const { userId } = req.params;

  if (newValues.email && (await (User as any).isEmailTaken(newValues.email, userId))) {
    throw new ErrorHandler(400, 'Email already taken');
  }

  if (newValues.username && (await (User as any).isUsernameTaken(newValues.username, userId))) {
    throw new ErrorHandler(400, 'Username already taken');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  Object.assign(user, newValues);

  await user.save();

  res.json({ user });
};

export const deleteUser = async (req : Request, res : Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId) as any;

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  await Promise.all([
    user.remove(),
    Profile.findOneAndRemove({ user: user._id }),
    Tweet.deleteMany({ author: user._id }),
  ]);

  res.json({ user });
};
