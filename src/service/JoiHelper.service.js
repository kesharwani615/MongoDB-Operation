// validations/articleValidation.js
import Joi from 'joi';

export const articleSchemaValidation = Joi.object({
  ArticleTitle:Joi.string().trim().min(1).required().messages({
    'string.empty': 'ArticleTitle is required',
  }),
  ArticleDescription:Joi.string().trim().min(1).required().messages({
    'string.empty': 'ArticleDescription is required',
  }),
  ArticleCategory:Joi.string().trim().min(1).required().messages({
    'string.empty': 'ArticleCategory is required',
  }),
  Articleimage: Joi.string().trim().uri().required().messages({
    'string.empty': 'Articleimage is required',
    'string.uri': 'Articleimage must be a valid URI',
  }),
  ArticleUrl: Joi.string().trim().uri().required().messages({
    'string.empty': 'ArticleUrl is required',
    'string.uri': 'ArticleUrl must be a valid URI',
  }),
  ArticleContent:Joi.string().trim().min(1).required().messages({
    'string.empty': 'ArticleContent is required',
  }),
});


export const articleStatusChangeSchemaValidation = Joi.object({
  status: Joi.string().trim().valid('pending', 'approved', 'rejected').min(1).required().messages({
    'string.empty': 'Status is required',
    'string.min': 'Status cannot be empty or just spaces',
  }),
});