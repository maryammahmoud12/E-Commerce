import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createCoupon = {
  body: Joi.object({
    code: Joi.string().min(3).max(20).required(),
    amount: Joi.number().min(1).max(100).integer().required(),
    fromDate: Joi.date().greater(Date.now()).required(),
    toDate: Joi.date().greater(Joi.ref("fromDate")).required(),
  }),
  headers: generalField.headers.required(),
};

export const updateCoupon = {
  body: Joi.object({
    code: Joi.string().min(3).max(20),
    amount: Joi.number().min(1).max(100).integer(),
    fromDate: Joi.date().greater(Date.now()),
    toDate: Joi.date().greater(Joi.ref("fromDate")),
  }),
  params: generalField.id.required(),
  headers: generalField.headers.required(),
};

export const deleteCoupon = {
  params: generalField.id.required(),
  headers: generalField.headers.required(),
};
