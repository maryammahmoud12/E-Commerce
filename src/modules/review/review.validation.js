import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createReview = {
  body: Joi.object({
    comment: Joi.string().required(),
    rate: Joi.number().min(1).max(5).integer().required(),
    productId: generalField.id.required(),
  }),
  params: Joi.object({
    productId: generalField.id.required(),
  }),
  headers: generalField.headers.required(),
};

export const deleteReview = {
  params: Joi.object({
    productId: generalField.id.required(),
  }),
  headers: generalField.headers.required(),
};
