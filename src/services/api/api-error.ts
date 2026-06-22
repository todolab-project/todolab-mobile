export type ApiErrorKind =
  | 'configuration'
  | 'network'
  | 'timeout'
  | 'cancelled'
  | 'http'
  | 'api'
  | 'invalid-response';

type ApiClientErrorOptions = {
  kind: ApiErrorKind;
  status?: number;
  code?: number;
  cause?: unknown;
};

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: number;

  constructor(message: string, options: ApiClientErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'ApiClientError';
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
  }
}
