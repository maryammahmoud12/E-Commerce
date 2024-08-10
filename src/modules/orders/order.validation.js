import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createOreder = {
  body: Joi.object({
    productId: generalField.id,
    quantity: Joi.number().integer(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    couponCode: Joi.string().min(3),
    paymentMethod: Joi.string().valid("card", "cash"),
  }),
  headers: generalField.headers.required(),
};

export const cancleOrder = {
  body: Joi.object({
    reason: Joi.string().required(),
  }),
  params: generalField.id.required,
  headers: generalField.headers.required(),
};
