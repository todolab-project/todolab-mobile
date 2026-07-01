import { getMobileWidthClass } from '../responsive';

describe('getMobileWidthClass', () => {
  it.each([
    [320, 'compact'],
    [359, 'compact'],
    [360, 'regular'],
    [399, 'regular'],
    [400, 'wide'],
    [599, 'wide'],
  ] as const)('%dpx를 %s 구간으로 분류한다', (width, expected) => {
    expect(getMobileWidthClass(width)).toBe(expected);
  });
});
