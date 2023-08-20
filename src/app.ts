import express from 'express'
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors'
import passport from 'passport'
import config from './config/keys'
import  jwtStrategy  from './config/passport'
import { getRoutes } from './routes'
import { handleNotFound, handleError } from  './utils/error'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Handle routes
app.use('/api', getRoutes());

// 404 error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

export default app;
