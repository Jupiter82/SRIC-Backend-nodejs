const Joi = require("joi");

const skillsSchema = Joi.array().items({ title: Joi.string().required() });

const aboutCreateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  subTitle: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(500).required(),
  skill: Joi.string().required(),
});

module.exports = { aboutCreateSchema };
