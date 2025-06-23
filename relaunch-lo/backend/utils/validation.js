import Joi from 'joi';

// Lead validation schema
export const leadValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name ist erforderlich',
    'string.min': 'Name muss mindestens 2 Zeichen lang sein',
    'string.max': 'Name darf nicht länger als 100 Zeichen sein'
  }),
  
  email: Joi.string().email().required().messages({
    'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'string.empty': 'E-Mail ist erforderlich'
  }),
  
  salutation: Joi.string().valid('herr', 'frau').required().messages({
    'any.only': 'Anrede muss "herr" oder "frau" sein',
    'any.required': 'Anrede ist erforderlich'
  }),
  
  source: Joi.string().valid('automation', 'digitalization', 'website', 'contact', 'manual').required(),
  
  company: Joi.object({
    name: Joi.string().trim().max(200),
    website: Joi.string().uri().allow(''),
    industry: Joi.string().max(100),
    size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+')
  }).default({}),
  
  phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{7,20}$/).allow('').messages({
    'string.pattern.base': 'Bitte geben Sie eine gültige Telefonnummer ein'
  }),
  
  serviceDetails: Joi.object({    automation: Joi.object({
      monthlyBudget: Joi.number().min(0),
      conversionRate: Joi.number().min(0).max(100),
      marginPerSale: Joi.number().min(0),
      roiProjection: Joi.number(),
      estimatedRoi: Joi.number(),
      estimatedProfit: Joi.number()
    }),
      digitalization: Joi.object({
      currentUrl: Joi.string().pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).allow('').messages({
        'string.pattern.base': 'Bitte geben Sie eine gültige Website-URL ein'
      }),
      areas: Joi.array().items(Joi.string()),
      urgency: Joi.string().valid('sofort', '1-3 Monate', '3-6 Monate'),
      timeline: Joi.string().valid('sofort', '1-3 Monate', '3-6 Monate'),
      currentChallenges: Joi.array().items(Joi.string())
    }),
      website: Joi.object({
      currentUrl: Joi.string().pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).allow('').messages({
        'string.pattern.base': 'Bitte geben Sie eine gültige Website-URL ein'
      }),
      goals: Joi.array().items(Joi.string()),
      style: Joi.string(),
      timeline: Joi.string(),
      budget: Joi.string()
    })
  }).default({}),
  
  notes: Joi.string().max(1000),
  tags: Joi.array().items(Joi.string()),
  estimatedValue: Joi.number().min(0).default(0),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  leadType: Joi.string().valid('hot', 'warm', 'cold').default('warm'),
  
  privacyConsent: Joi.boolean().valid(true).required().messages({
    'any.only': 'Datenschutz-Zustimmung ist erforderlich'
  }),
  
  marketingConsent: Joi.boolean().default(false)
});

// User registration validation schema
export const userRegistrationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

// User login validation schema
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Validation functions
export const validateLeadData = (data) => {
  return leadValidationSchema.validate(data, { abortEarly: false });
};

export const validateUserRegistration = (data) => {
  return userRegistrationSchema.validate(data, { abortEarly: false });
};

export const validateUserLogin = (data) => {
  return userLoginSchema.validate(data, { abortEarly: false });
};
