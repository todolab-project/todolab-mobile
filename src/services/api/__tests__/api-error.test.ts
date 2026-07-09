import { ApiClientError, getUserFacingApiErrorMessage } from '../api-error';

describe('getUserFacingApiErrorMessage', () => {
  it.each([
    [
      new ApiClientError('원본 network 오류', { kind: 'network' }),
      '서버에 연결할 수 없어요. 네트워크 상태를 확인해 주세요.',
    ],
    [
      new ApiClientError('원본 timeout 오류', { kind: 'timeout' }),
      '응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.',
    ],
    [
      new ApiClientError('원본 설정 오류', { kind: 'configuration' }),
      'API 연결 설정을 확인해 주세요.',
    ],
    [
      new ApiClientError('원본 응답 오류', { kind: 'invalid-response' }),
      '서버 응답을 읽을 수 없어요. 잠시 후 다시 시도해 주세요.',
    ],
    [
      new ApiClientError('서버 내부 오류', { kind: 'http', status: 503 }),
      '서버가 잠시 불안정해요. 잠시 후 다시 시도해 주세요.',
    ],
  ] as const)('공통 API 오류를 사용자용 문구로 변환한다', (error, expected) => {
    expect(getUserFacingApiErrorMessage(error)).toBe(expected);
  });

  it('4xx와 API 검증 오류는 서버 메시지를 유지한다', () => {
    expect(
      getUserFacingApiErrorMessage(
        new ApiClientError('제목을 입력해 주세요.', { kind: 'http', status: 400 }),
      ),
    ).toBe('제목을 입력해 주세요.');

    expect(
      getUserFacingApiErrorMessage(
        new ApiClientError('이미 삭제된 항목이에요.', { kind: 'api', status: 409 }),
      ),
    ).toBe('이미 삭제된 항목이에요.');
  });

  it('예상하지 못한 Error는 기존 메시지를 유지한다', () => {
    expect(getUserFacingApiErrorMessage(new Error('알 수 없는 오류'))).toBe('알 수 없는 오류');
  });
});
