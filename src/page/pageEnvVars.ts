import { EnvNamePage, EnvVar } from '../types';

export const envVars: EnvVar<EnvNamePage> = {
  BACKEND_URL: {
    default: 'http://localhost:5555',
    required: false,
    secret: false,
    type: 'string',
  },
  COOLDOWN: { default: 1000, required: false, secret: false, type: 'number' },
  DRIP_AMOUNT: { default: 10, required: false, secret: false, type: 'number' },
  GOOGLE_CAPTCHA_PRIVATE: {
    default: '',
    required: true,
    secret: false,
    type: 'string',
  },
  NETWORK_UNIT: {
    default: 'UNIT',
    required: false,
    secret: false,
    type: 'string',
  },
  PAGE_PORT: { default: 5556, required: false, secret: false, type: 'number' },
};
