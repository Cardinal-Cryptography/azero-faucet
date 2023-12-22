export type TypeofMap = {
  string: string;
  number: number;
  boolean: boolean;
};
export type PrimitivTypeString = keyof TypeofMap;

export type PrimitivType = string | number | boolean;

export type EnvNameServer =
  | 'FAUCET_ACCOUNT_MNEMONIC'
  | 'FAUCET_BALANCE_CAP'
  | 'INJECTED_TYPES'
  | 'NETWORK_DECIMALS'
  | 'PORT'
  | 'RPC_ENDPOINT';

export interface MetricsDefinition {
  meta: {
    prefix: string;
  };
  data: { [id: string]: number };
}

export type EnvNamePage =
  | 'BACKEND_URL'
  | 'DRIP_AMOUNT'
  | 'ENV'
  | 'PAGE_PORT'
  | 'COOLDOWN'
  | 'NETWORK_UNIT'
  | 'GOOGLE_CAPTCHA_PRIVATE'
  | 'GOOGLE_CAPTCHA_SITE_KEY';

export interface EnvOpt {
  default?: PrimitivType;
  required: boolean;
  secret: boolean;
  type: PrimitivTypeString;
}

export interface BalanceResponse {
  balance: string;
}

export interface DripErrorResponse {
  error: string;
}

export interface DripSuccessResponse {
  hash: string;
}

export type DripResponse = DripErrorResponse | DripSuccessResponse;

export interface PageRequestType {
  address: string;
  amount: string;
}

export type EnvVar<T extends EnvNameServer | EnvNamePage> = Record<T, EnvOpt>;
