import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    uri: process.env.MONGO_URI as string,
    options: {
      useNewUrlParser: true,
    } as ConnectOptions,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES,
  },
};
