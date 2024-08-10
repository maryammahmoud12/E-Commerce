import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const signUp = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: generalField.email.required(),
    password: generalField.password.required(),
    age: Joi.number().required(),
    address: Joi.string(),
    phone: Joi.number().min(11).max(11),
  }),
};

export const forgetPass = {
  body: Joi.object({
    email: generalField.email.required(),
  }),
};

export const resetPass = {
  body: Joi.object({
    email: generalField.email.required(),
    code: Joi.string(),
    password: generalField.password.required(),
  }),
};

export const signIn = {
  body: Joi.object({
    email: generalField.email.required(),
    password: generalField.password.required(),
  }),
};
