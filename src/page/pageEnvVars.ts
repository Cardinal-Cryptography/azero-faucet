import { EnvNamePage, EnvVar } from '../types';

export const envVars: EnvVar<EnvNamePage> = {
  DRIP_AMOUNT: { default: 10, required: false, secret: false, type: 'number' },
  PAGE_PORT: { default: 5556, required: false, secret: false, type: 'number' },
  COOLDOWN: { default: 1000, required: false, secret: false, type: 'number' },
  BACKEND_URL: { default: 'http://localhost:5555', required: false, secret: false, type: 'string' },
  NETWORK_UNIT: { default: 'UNIT', required: false, secret: false, type: 'string' },
  GOOGLE_CAPTCHA_PRIVATE: { default: '', required: true, secret: false, type: 'string' }
};
