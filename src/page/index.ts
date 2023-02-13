import { decodeAddress } from '@polkadot/keyring';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Response } from 'express';
import { ReCAPTCHA } from 'node-grecaptcha-verify';
import type { DripResponse } from 'src/types';

import { isDripSuccessResponse } from '../guards';
import { checkEnvVariables, getEnvVariable, logger } from '../utils';
import { envVars } from './pageEnvVars';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('static'));

checkEnvVariables(envVars);

const port = getEnvVariable('PAGE_PORT', envVars) as string;
const dripAmount = getEnvVariable('DRIP_AMOUNT', envVars) as number;
const cooldown = getEnvVariable('COOLDOWN', envVars) as number;
const baseURL = getEnvVariable('BACKEND_URL', envVars) as string;
const unit = getEnvVariable('NETWORK_UNIT', envVars) as string;

const env = getEnvVariable('ENV', envVars) as string;
const tokenSymbol = getEnvVariable('NETWORK_UNIT', envVars) as string;

const ax = axios.create({
  baseURL,
  timeout: 10000,
});

let lastSuccess = Date.now();

const recaptchaSecretKey = getEnvVariable('GOOGLE_CAPTCHA_PRIVATE', envVars);
const recaptchaSiteKey = getEnvVariable('GOOGLE_CAPTCHA_SITE_KEY', envVars);

function sendResponse(
  isHuman: boolean,
  address: string | Uint8Array | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Response<any, any>
) {
  if (isHuman) {
    try {
      decodeAddress(address);
    } catch (e) {
      response.status(400).send('Unparsable address.');
      return;
    }

    const attemptTime = Date.now();

    if (attemptTime - cooldown > lastSuccess) {
      ax.post<DripResponse>('/page-endpoint', {
        address,
        amount: dripAmount,
      })
        .then((inner_res) => {
          if (isDripSuccessResponse(inner_res.data)) {
            response
              .status(201)
              .send(`{"message": "Sent ${dripAmount} ${unit}s."}`);
            lastSuccess = attemptTime;
          } else {
            response
              .status(429)
              .send(
                inner_res.data.error ||
                  'An unexpected error occurred, please contact us and complain'
              );
            return;
          }
        })
        .catch(() => {
          response
            .status(500)
            .send(
              'An unexpected error occurred, please contact us and complain'
            );
        });
    } else {
      response.status(503).send('Too many faucet requests.');
    }
  } else {
    response.status(401).send('Google captcha failed.');
    return;
  }
}

app.post('/drip', (req, userResponse) => {
  const address = req.body.address;

  if (recaptchaSecretKey !== undefined) {
    console.log(recaptchaSecretKey);
    const recaptcha = new ReCAPTCHA(recaptchaSecretKey as string, 0.5);
    recaptcha
      .verify(req.body['g-recaptcha-response'])
      .then(function (response) {
        const isHuman = response.isHuman;
        sendResponse(isHuman, address, userResponse);
      });
  } else {
    sendResponse(true, address, userResponse);
  }
});

app.get('/', (req, res) => {
  res.render('index', {
    env,
    hasRecaptcha: recaptchaSecretKey !== undefined,
    recaptchaSiteKey,
    tokenSymbol,
  });
});

const main = () => {
  app.listen(port, () =>
    logger.info(`Faucet frontend listening on port ${port}.`)
  );
};

main();
