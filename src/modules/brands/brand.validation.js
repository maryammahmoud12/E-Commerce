import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createBrand = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
  }),
  file: Joi.object({
    imagge: generalField.file.required,
  }),
  headers: generalField.headers.required(),
};

export const updateBrand = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required(),
  }),
  params: generalField.id.required(),
  file: Joi.object({
    imagge: generalField.file.required,
  }),
  headers: generalField.headers.required(),
};

export const deleteBrand = {
  params: generalField.id.required(),
  headers: generalField.headers.required(),
};
