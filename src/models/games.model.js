import joi from "joi";

export const gamesSchema = joi.object({
  name: joi.string().invalid('').required(),
  image: joi.string().uri().required(),
  stockTotal: joi.number().greater(0).required(),
  pricePerDay: joi.number().greater(0).required()
});