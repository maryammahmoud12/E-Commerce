import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(20).required(),
    stock: Joi.number().min(1).integer().required(),
    discount: Joi.number().min(1).max(100).integer(),
    price: Joi.number().min(1).integer().required(),
    brand: generalField.id.required(),
    category: generalField.id.required(),
    subCategory: generalField.id.required(),
    description: Joi.string(),
  }),
  files: Joi.object({
    image: Joi.array().items(generalField.file.required()).required(),
    coverImages: Joi.array().items(generalField.file.required()).required(),
  }).required(),
  headers: generalField.headers.required(),
};

export const updateProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(20),
    stock: Joi.number().min(1).integer(),
    discount: Joi.number().min(1).max(100).integer(),
    price: Joi.number().min(1).integer(),
    brand: generalField.id,
    category: generalField.id,
    subCategory: generalField.id,
    description: Joi.string(),
  }),
  params: Joi.object({
    id: generalField.id.required(),
  }),
  files: Joi.object({
    image: Joi.array().items(generalField.file),
    coverImages: Joi.array().items(generalField.file),
  }),
  headers: generalField.headers.required(),
};
