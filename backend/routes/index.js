import { Router } from 'express';
// import { Joi, Segments, celebrate } from 'celebrate';
import { NotFoundError } from '../errors/index.js';
import { auth } from '../middlewares/auth.js';
import {
  login,
  register,
  readOne,
} from '../controllers/users.js';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
  celebrateParamsRouteMe,
} from '../validators/users.js';

// у вас это будет 'routes/auth.js'
const authRouter = Router();
authRouter.post('/signin', celebrateBodyAuth, login);
authRouter.post('/signup', celebrateBodyUser, register);

// у вас это будет 'routes/users.js'
const userRouter = Router();
// // пример того как выглядит валидация на каждом роуте
// userRouter.get(
//   '/:id',
//   // ----
//   // если бы мы писали мидлвару сами:
//   // (req, res, next) => {
//   //   // проверка валидатром req.params
//   //   // next(new Error('Ошибка валидации')) // если есть ошибки
//   //   // next() // если нет ошибок
//   // },
//
//   // повышаем абстракцию через celebrate
//   celebrate({
//     [Segments.PARAMS]: Joi.object({ // описываем целиком схему "на месте"
//       id: Joi.alternatives().try(
//         Joi.string().equal('me'),
//         Joi.string().hex().length(24),
//       ).required(),
//     }).required(),
//   }),
//   // ----
//   readOne,
// );
// ----
// выносим весь celebrate и схемы в отдельный файл, оставляем главное:
userRouter.get('/:id', celebrateParamsRouteMe, readOne);

// то, что останется в этом файле
export const router = Router();

router.use('/', authRouter);
router.use(auth); // все роуты ниже будут с авторизацией
router.use('/users', userRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
