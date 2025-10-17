const Joi = require('joi');

const createLetterSchema = Joi.object({
  destinationId: Joi.string().uuid().required(),
  subject: Joi.string().min(3).max(200).required(),
  body: Joi.string().min(5).required()
});

module.exports = { createLetterSchema };
