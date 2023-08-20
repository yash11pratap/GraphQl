import config from '../config/keys'
import logger from './logger'

const isProd = config.env === 'production';

export class ErrorHandler extends Error {
  constructor( private statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleNotFound = (req, _res, next) => {
  const error = new ErrorHandler(404, `Route ${req.originalUrl} Not Found`);
  next(error);
};

// eslint-disable-next-line
export const handleError = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    if (config.env !== 'test') {
      logger.error(err);
    }
    res.status(err.statusCode || 500);
    res.json({
      message: err.message || 'Internal Server Error',
      ...(isProd ? null : { stack: err.stack }),
    });
  }
};

