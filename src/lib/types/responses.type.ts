export type ErrorMeta = {
  path: string;
  timestamp: Date;
};

export type BaseErrorDetails = {
  status: string;
  code: string;
  detail: string;
  meta: ErrorMeta;
};

export type BaseError = {
  errors: BaseErrorDetails[];
  details?: string[];
  message?: string;
};
