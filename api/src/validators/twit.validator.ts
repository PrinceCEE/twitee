import Joi from "joi";

export const twitValidator = Joi.object({
  content: Joi.string().required(),
});
