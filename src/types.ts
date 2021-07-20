export type TypeofMap = {
  string: string,
  number: number,
  boolean: boolean
}
export type PrimitivTypeString = keyof TypeofMap;

export type PrimitivType = string | number | boolean;

export type EnvNameServer = 'FAUCET_ACCOUNT_MNEMONIC'|
 'INJECTED_TYPES'|
 'NETWORK_DECIMALS'|
 'PORT' |
 'RPC_ENDPOINT'
 ;

export type EnvNameBot = 'BACKEND_URL'|
 'DRIP_AMOUNT' |
 'MATRIX_ACCESS_TOKEN'|
 'MATRIX_BOT_USER_ID'|
 'NETWORK_DECIMALS'|
 'NETWORK_UNIT'
;

export type EnvNamePage = 'BACKEND_URL'|
 'DRIP_AMOUNT' |
 'PAGE_PORT' |
 'COOLDOWN' |
 'NETWORK_UNIT' |
 'GOOGLE_CAPTCHA_PRIVATE'
;

export interface EnvOpt {
  default?: PrimitivType;
  required: boolean;
  secret: boolean;
  type: PrimitivTypeString;
}

export interface BalanceResponse {
  balance: string;
}

export interface DripResponse {
  hash?: string | null;
  limitReached?: boolean;
}

export interface BotRequestType {
  address: string;
  amount: string;
  sender: string;
}

export interface PageRequestType {
  address: string;
  amount: string;
}

export type EnvVar<T extends EnvNameServer | EnvNameBot | EnvNamePage> = Record<T, EnvOpt>;
