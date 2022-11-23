import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/index.js';
import { schemaAvatar, schemaEmail } from '../validators/users.js';

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => !schemaAvatar.validate(value).error,
      message: () => 'Аватар должен быть http(s)-URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => !schemaEmail.validate(value).error,
      message: () => 'Почта должна быть вида a@b.c',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
  statics: {
    findOneAndValidatePassword({ password, email }) {      
      return this.findOne({ email })
        .select('+password')
        .then((document) => {
          if (!document) {
            throw new UnauthorizedError('Неправильный логин или пароль');
          }

          return bcrypt.compare(password, document.password)
            .then((isSuccess) => {
              if (!isSuccess) {
                throw new UnauthorizedError('Неправильный логин или пароль');
              }

              const {
                password: removed, // удаляем пароль из объекта пользователя
                ...user
              } = document.toObject(); // превращаем документ в объект пользователя
              return user;
            });
        });
    },
  },
});

export const User = mongoose.model('User', schema);
