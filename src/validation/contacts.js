import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().pattern(/^[0-9+\-() ]+$/).required(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    phoneNumber: Joi.string().pattern(/^[0-9+\-() ]+$/).optional(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1);