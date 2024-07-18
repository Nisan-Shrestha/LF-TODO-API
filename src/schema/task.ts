import Joi from "joi";

export const getTaskByIDSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string!",
    "any.required": "ID is required",
  }),
}).options({ stripUnknown: true });

export const getAllTasksSchema = Joi.object({
  page: Joi.number()
    .optional()
    .messages({
      "string.base": "page must be a number okay!",
    })
    .default(1),
  size: Joi.number()
    .optional()
    .messages({
      "string.base": "size must be a number okay!",
    })
    .default(10),
}).options({ stripUnknown: true });

export const createTaskSchema = Joi.object({
  detail: Joi.string().required().messages({
    "string.base": "Detail must be a string okay!",
    "any.required": "Detail is required",
  }),
}).options({ stripUnknown: true });

export const updateTaskByIDParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string okay!",
    "any.required": "ID is required",
  }),
}).options({ stripUnknown: true });

export const updateTaskByIDBodySchema = Joi.object({
  detail: Joi.string().optional().messages({
    "string.base": "ID must be a string okay!",
  }),
  status: Joi.string().optional().messages({
    "string.base": "ID must be a string okay!",
  }),
}).options({ stripUnknown: true });

export const updateTaskByIDQuerySchema = Joi.object({
  update: Joi.string().valid("status", "detail").required().messages({
    "string.base": "update must be a string okay!",
    "any.only": "update must be either 'done' or 'pending'",
    "any.required": "update is required",
  }),
}).options({ stripUnknown: true });

export const deleteTaskByIDSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string!",
    "any.required": "ID is required",
  }),
}).options({ stripUnknown: true });
