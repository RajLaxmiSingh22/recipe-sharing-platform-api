import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.error(err); // in real prod, pipe to a logger, not console
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
};