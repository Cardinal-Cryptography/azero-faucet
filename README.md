## Generic Faucet for Substrate based chains

## Development

Setup dependencies and git hooks

```bash
yarn install
yarn simple-git-hooks
```

To launch a hot-reloading dev environment

```bash
yarn dev:backend
yarn dev:bot
```

To launch faucet frontend

```bash
yarn page
```

and then open [http://localhost:5556](http://localhost:5556) in your web browser.

## Server environment variables

The only common variable between the bot and the server is the NETWORK_DECIMALS.
Also the server's `PORT` should be part of the bot's `BACKEND_URL`.

Setup a .env file with the following variables, example

```bash
FAUCET_ACCOUNT_MNEMONIC="this is a fake mnemonic"
NETWORK_DECIMALS=12
PORT=5555
RPC_ENDPOINT="http://localhost:9944"
GOOGLE_CAPTCHA_PRIVATE=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
GOOGLE_CAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
NETWORK_UNIT="DZERO"
COOLDOWN=100
BACKEND_URL=http://localhost:5555
DRIP_AMOUNT=150
ENV=Devnet
```

### Recaptcha keys

* Both `GOOGLE_CAPTCHA_PRIVATE` and `GOOGLE_CAPTCHA_SITE_KEY` are optional,
* there is no default `GOOGLE_CAPTCHA_PRIVATE` value - if not given, there's no captcha widget displayed,
* `GOOGLE_CAPTCHA_SITE_KEY` is hardcoded but can be overwritten.
* `GOOGLE_CAPTCHA_PRIVATE` and `GOOGLE_CAPTCHA_SITE_KEY` in above snippet are 
[official Google ones for CI testing purposes](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do)  

Google captcha secret key is a public [well-known test key](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do), 
do not use for production purposes!

## Bot environment variables

Setup a .env file with the following variables

``` bash
BACKEND_URL #optional - full url for the bot to reach the backend
DRIP_AMOUNT #optional - default amount of token to send
MATRIX_ACCESS_TOKEN #required - your bot access token here is how to find it https://t2bot.io/docs/access_tokens/
MATRIX_BOT_USER_ID #required - your bot user id
NETWORK_DECIMALS #optional - decimal amount for the network
NETWORK_UNIT #optional - token unit for the network
```

example:
```bash
BACKEND_URL="http://localhost:5555"
DRIP_AMOUNT=10
MATRIX_ACCESS_TOKEN="ThisIsNotARealAccessToken"
MATRIX_BOT_USER_ID="@test_bot_faucet:matrix.org"
NETWORK_DECIMALS=12
NETWORK_UNIT="CAN"
```
---

## Ignore List / Blacklist

A list of Matrix accounts that will be silently (but logged) ignored:
```
FAUCET_IGNORE_LIST="@alice:matrix.org,@bob:domain.com"
```

## Helm deployment / Adding a new faucet

0. Create an account for your MATRIX_BOT_USER_ID at https://matrix.org/, login and retrieve MATRIX_ACCESS_TOKEN in `Settigns -> Help and about -> click to reveal`

1. Create a *chainName-values.yaml* file and define all non default variables. Secret variables (MATRIX_ACCESS_TOKEN & FAUCET_ACCOUNT_MNEMONIC) you need to supply externally
via CI / command line / ...

2. Create a new CI-Job / Environment in *.gitlab-ci.yml* file and add Secrets (in clear / non-base64 encoded format) to `gitlab -> CI/CD Settings -> Secret Variables`).

4. Run CI/CD or use `helm` to deploy.


### Example Helm usage:

```
helm template westend . \
 --values ./westend-values.yaml \
 --set server.secret.FAUCET_ACCOUNT_MNEMONIC='ich und du muellers esel das bist du' \
 --set server.image.dockerTag=latest \
 --set bot.secret.MATRIX_ACCESS_TOKEN='asdf-not-a-secret-asfd'

helm -n faucetbots ls --all

helm -n faucetbots rollback westend 2
```

### Misc:
* Bump API: `yarn upgrade @polkadot/util@latest @polkadot/wasm-crypto@latest @polkadot/keyring@latest @polkadot/x-randomvalues@latest @polkadot/api@latest @polkadot/keyring@latest @polkadot/util-crypto@latest`
* Server can be queried for Prometheus metrics via http://$BACKEND_URL/metrics
* Readiness check URL  via http://$BACKEND_URL/ready
* Health check URL  via http://$BACKEND_URL/health
