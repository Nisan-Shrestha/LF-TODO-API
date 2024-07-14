import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email invalid",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.base": "Password invalid",
  }),
}).options({ stripUnknown: true });

export const refreshSchema = Joi.object({
  authorization: Joi.string().required().messages({
    "any.required": "Authorization token not set",
  }),
}).options({ stripUnknown: true });
