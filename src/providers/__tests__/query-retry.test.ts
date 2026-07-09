import { ApiClientError } from '@/services/api';

import { shouldRetryQuery } from '../query-retry';

describe('shouldRetryQuery', () => {
  it.each(['network', 'timeout'] as const)('%s 오류는 최대 2회까지 재시도한다', (kind) => {
    const error = new ApiClientError('잠시 연결이 불안정해요.', { kind });

    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });

  it('서버 5xx 오류는 재시도한다', () => {
    const error = new ApiClientError('서버가 잠시 불안정해요.', {
      kind: 'http',
      status: 503,
    });

    expect(shouldRetryQuery(0, error)).toBe(true);
  });

  it('사용자 입력 또는 권한 문제로 볼 수 있는 오류는 재시도하지 않는다', () => {
    const error = new ApiClientError('요청을 처리할 수 없어요.', {
      kind: 'http',
      status: 400,
    });

    expect(shouldRetryQuery(0, error)).toBe(false);
  });

  it('예상하지 못한 오류는 한 번만 재시도한다', () => {
    const error = new Error('알 수 없는 오류');

    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(false);
  });
});
