import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createCart = {
  body: Joi.object({
    productId: generalField.id.required(),
    quantity: Joi.number().integer().required(),
  }),
  headers: generalField.headers.required(),
};

export const removeCart = {
  body: Joi.object({
    productId: generalField.id.required(),
  }),
  headers: generalField.headers.required(),
};

export const clearCart = {
  headers: generalField.headers.required(),
};
