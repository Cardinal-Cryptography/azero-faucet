import log4js from 'log4js';

import type {
  EnvNamePage,
  EnvNameServer,
  EnvOpt,
  EnvVar,
  PrimitivType
} from './types';

export const logger = log4js.getLogger();
logger.level = 'debug';

export function getEnvVariable<T extends EnvNameServer | EnvNamePage> (
  name: T,
  envVars: EnvVar<T>
): PrimitivType | undefined {
  // eslint-disable-next-line security/detect-object-injection
  const env = process.env[name];
  let returnedEnv: PrimitivType;
  // eslint-disable-next-line security/detect-object-injection
  const opts = envVars[name];

  if (!opts) {
    throw new Error(`Unknown variable ${name}`);
  }

  if (env === undefined) {
    if (opts.required) {
      throw new Error(`Required environment variable ${name} is undefined`);
    } else if (opts.default) {
      returnedEnv = opts.default;
    } else {
      return undefined;
    }
  } else {
    returnedEnv = env;
  }

  switch (opts.type) {
    case 'number':
      return Number(returnedEnv);

    case 'boolean':
      return !!returnedEnv;

    default:
      return returnedEnv;
  }
}

export function checkEnvVariables<T extends EnvNameServer | EnvNamePage> (
  envVars: EnvVar<T>
): void {
  Object.entries<EnvOpt>(envVars).forEach(([env, opt]) => {
    // eslint-disable-next-line security/detect-object-injection
    const value = process.env[env];

    if (value === undefined) {
      if (opt.required) {
        console.error(`✖︎ Required environment variable ${env} not set.`);
      } else {
        if (opt.default) {
          logger.info(
            `◉ Optional environment variable ${env} not set, using default (${opt.default.toString()}).`
          );
        }
      }
    } else {
      if (opt.secret) {
        logger.info(`✓ ${env} it set (secret)`);
      } else {
        logger.info(`✓ ${env} set to ${value}`);
      }
    }
  });
  logger.info('------------------------------------------');
}
