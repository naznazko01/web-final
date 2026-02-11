const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map((el) => el.message).join(', ');
            return next(new AppError(message, 400));
        }
        next();
    };
};

const schemas = {
    register: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    addFavorite: Joi.object({
        movieId: Joi.number().required(),
        title: Joi.string().required(),
        poster: Joi.string().allow('', null),
    }),
    updateFavorite: Joi.object({
        status: Joi.string().valid('planned', 'watching', 'watched').required(),
    }),
    updateProfile: Joi.object({
        username: Joi.string().min(3).max(30),
        email: Joi.string().email(),
        password: Joi.string().min(6),
    }),
};

module.exports = {
    validate,
    schemas,
};
