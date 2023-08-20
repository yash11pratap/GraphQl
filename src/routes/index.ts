import express from 'express'
import authRoutes  from '../components/auth/auth.routes'
import userRoutes  from '../components/users/user.routes';
import  profileRoutes from '../components/profiles/profile.routes'
import tweetRoutes from '../components/tweets/tweet.routes'
export function getRoutes() {
  const router = express.Router();

  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/profiles', profileRoutes);
  router.use('/tweets', tweetRoutes);

  return router;
}

