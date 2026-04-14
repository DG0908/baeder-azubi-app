import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  APP_PORT: Joi.number().port().default(3000),
  APP_CORS_ORIGINS: Joi.string().allow('').default('http://localhost:5173'),
  APP_COOKIE_DOMAIN: Joi.string().allow('').default(''),
  APP_COOKIE_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().default('900s'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_TTL: Joi.string().default('7d'),
  INVITATION_CODE_PEPPER: Joi.string().min(32).required(),
  PASSWORD_RESET_TOKEN_PEPPER: Joi.string().min(32).required(),
  PASSWORD_RESET_TTL: Joi.string().default('30m'),
  APP_PUBLIC_URL: Joi.string().uri({ scheme: ['http', 'https'] }).default('http://localhost:5173'),
  SMTP_HOST: Joi.string().allow('').default(''),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  SMTP_USER: Joi.string().allow('').default(''),
  SMTP_PASSWORD: Joi.string().allow('').default(''),
  SMTP_FROM: Joi.string().email().allow('').default(''),
  WEB_PUSH_PUBLIC_KEY: Joi.string().allow('').default(''),
  WEB_PUSH_PRIVATE_KEY: Joi.string().allow('').default(''),
  WEB_PUSH_SUBJECT: Joi.string().allow('').default('mailto:admin@example.com'),
  DUEL_DEFAULT_QUESTION_COUNT: Joi.number().integer().min(3).max(20).default(20),
  DUEL_REQUEST_TTL_MINUTES: Joi.number().integer().min(15).max(10080).default(2880),
  DUEL_TURN_TTL_MINUTES: Joi.number().integer().min(15).max(10080).default(2880),
  LOG_LEVEL: Joi.string().allow('').default('log,warn,error'),
  APP_TOTP_ENCRYPTION_KEY: Joi.string().min(32).allow('').default('')
});
