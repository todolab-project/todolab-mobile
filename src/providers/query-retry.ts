import { ApiClientError } from '@/services/api';

const MAX_RETRY_COUNT = 2;

export function shouldRetryQuery(failureCount: number, error: Error) {
  if (failureCount >= MAX_RETRY_COUNT) {
    return false;
  }

  if (!(error instanceof ApiClientError)) {
    return failureCount < 1;
  }

  if (error.kind === 'network' || error.kind === 'timeout') {
    return true;
  }

  return error.kind === 'http' && (error.status ?? 0) >= 500;
}
