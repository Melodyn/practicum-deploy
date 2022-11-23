import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index.js';

export const auth = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Требуется аутентификация'));
  } else {
    const token = authorization.replace(/^Bearer*\s*/i, '');
    const { JWT_SALT } = req.app.get('config');
    try {
      const decoded = jwt.verify(token, JWT_SALT);
      req.user = { _id: decoded._id };
      next();
    } catch (err) {
      next(new UnauthorizedError('Требуется аутентификация'));
    }
  }
};
