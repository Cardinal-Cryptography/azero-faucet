## Faucet for aleph-node chain

## Development

Setup dependencies and git hooks

```bash
yarn install
yarn simple-git-hooks
```

To launch a hot-reloading dev environment

```bash
yarn dev:backend
```

To launch faucet frontend

```bash
yarn page
```

and then open [http://localhost:5556](http://localhost:5556) in your web browser.

## Docker development

```bash
docker build --tag faucet:latest -f Dockerfile . 
docker run --rm -it --network=host --name faucet faucet:latest dev:backend
docker run --rm -it --network=host --name faucet-frontend faucet:latest page
```

## Server environment variables

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

### Misc:
* Bump API: `yarn upgrade @polkadot/util@latest @polkadot/wasm-crypto@latest @polkadot/keyring@latest @polkadot/x-randomvalues@latest @polkadot/api@latest @polkadot/keyring@latest @polkadot/util-crypto@latest`
* Server can be queried for Prometheus metrics via http://$BACKEND_URL/metrics
* Readiness check URL  via http://$BACKEND_URL/ready
* Health check URL  via http://$BACKEND_URL/health
