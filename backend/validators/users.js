import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemaObjectId,
  schemaURL,
} from './common.js';

const schemaRouteMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  schemaObjectId,
).required();

export const schemaAvatar = schemaURL;
export const schemaEmail = Joi.string().email().required();
const schemaPassword = Joi.string().required();
// необязательные поля без required
const schemaName = Joi.string().min(2).max(30);
const schemaAbout = Joi.string().min(2).max(30);

const schemaObjectRouteMe = Joi.object({
  id: schemaRouteMe,
}).required();
const schemaObjectProfile = Joi.object({
  name: schemaName,
  about: schemaAbout,
}).required();
const schemaObjectAvatar = Joi.object({
  avatar: schemaAvatar,
}).required();
const schemaObjectAuth = Joi.object({
  email: schemaEmail,
  password: schemaPassword,
}).required();
const schemaObjectUser = schemaObjectAuth // объединяем несколько схем в одну
  .concat(schemaObjectProfile)
  .concat(schemaObjectAvatar);

const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteMe };

export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);
