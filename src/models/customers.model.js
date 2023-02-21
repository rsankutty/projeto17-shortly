import joi from "joi";

export const customersSchema = joi.object({
  name: joi.string().invalid('').required(),
  phone: joi.string().max(11).min(10).pattern(/^[0-9]+$/).required(),
  cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
  birthday: joi.string().pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required()
});

