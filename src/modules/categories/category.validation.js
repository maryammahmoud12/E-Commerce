import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
  }),
  file: Joi.object({
    imagge: generalField.file.required,
  }),
  headers: generalField.headers.required(),
};

export const updateCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
  }),
  params: generalField.id.required(),
  file: Joi.object({
    imagge: generalField.file.required,
  }),
  headers: generalField.headers.required(),
};

export const deleteCategory = {
  params: generalField.id.required(),
  headers: generalField.headers.required(),
};
