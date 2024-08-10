import Joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createWishList = {
  params: Joi.object({
    productId: generalField.id.required(),
  }),
  headers: generalField.headers.required(),
};
