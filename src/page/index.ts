import { decodeAddress } from '@polkadot/keyring';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
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

const recaptcha = new ReCAPTCHA(
  getEnvVariable('GOOGLE_CAPTCHA_PRIVATE', envVars) as string,
  0.5
);

app.post('/drip', (req, res) => {
  const address = req.body.address;

  recaptcha.verify(req.body['g-recaptcha-response']).then(function (response) {
    const isHuman = response.isHuman;

    if (isHuman) {
      try {
        decodeAddress(address);
      } catch (e) {
        res.status(400).send('Unparsable address.');
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
              res
                .status(201)
                .send(`{"message": "Sent ${dripAmount} ${unit}s."}`);
              lastSuccess = attemptTime;
            } else {
              res
                .status(429)
                .send(
                  inner_res.data.error ||
                    'An unexpected error occured, please contact us and complain'
                );
              return;
            }
          })
          .catch(() => {
            res
              .status(500)
              .send(
                'An unexpected error occured, please contact us and complain'
              );
          });
      } else {
        res.status(503).send('Too many faucet requests.');
      }
    } else {
      res.status(401).send('Google captcha failed.');
      return;
    }
  });
});

app.get('/', (req, res) => {
  res.render('index', { env, tokenSymbol });
});

const main = () => {
  app.listen(port, () =>
    logger.info(`Faucet frontend listening on port ${port}.`)
  );
};

main();
