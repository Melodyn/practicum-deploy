import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Запрашиваемый пользователь не найден');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const UniqueErrorCode = 11000;

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((userData) => {
      const { JWT_SALT } = req.app.get('config');
      const token = jwt.sign({ _id: userData._id }, JWT_SALT, { expiresIn: '1h' });
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;

      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === UniqueErrorCode) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const readOne = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;

  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};
