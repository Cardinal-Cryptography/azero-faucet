import { EnvNamePage, EnvVar } from '../types';

export const envVars: EnvVar<EnvNamePage> = {
  BACKEND_URL: {
    default: 'http://localhost:5555',
    required: false,
    secret: false,
    type: 'string'
  },
  COOLDOWN: { default: 1000, required: false, secret: false, type: 'number' },
  DRIP_AMOUNT: { default: 10, required: false, secret: false, type: 'number' },
  ENV: { default: 'Devnet', required: false, secret: false, type: 'string' },
  GOOGLE_CAPTCHA_PRIVATE: {
    required: false,
    secret: true,
    type: 'string'
  },
  GOOGLE_CAPTCHA_SITE_KEY: {
    default: '6LfbhPscAAAAAMZpUXhAmHhu1ChB6Xb9Ys7ciOYJ',
    required: false,
    secret: false,
    type: 'string'
  },
  NETWORK_UNIT: {
    default: 'DZERO',
    required: false,
    secret: false,
    type: 'string'
  },
  PAGE_PORT: { default: 5556, required: false, secret: false, type: 'number' }
};
