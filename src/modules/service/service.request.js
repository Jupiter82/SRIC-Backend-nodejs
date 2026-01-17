const Joi = require("joi");

const serviceCreateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  icon: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(1000).required(),
  status: Joi.string()
    .regex(/^(active|inactive)$/)
    .default("inactive"),
});

module.exports = { serviceCreateSchema };
