import Joi from "joi";

const validationID = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid id ");
};

export const generalField = {
  email: Joi.string().email(),
  password: Joi.string()
    .regex(/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  id: Joi.string().custom(validationID).required(),
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    feildname: Joi.string().required(),
  }),
  headers: Joi.object({
    "cache-control": Joi.string(),
    "postman-token": Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    host: Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
    token: Joi.string().required(),
  }),
};
