import { getViewportWidthClass } from '../responsive';

describe('getViewportWidthClass', () => {
  it.each([
    [320, 'compact'],
    [359, 'compact'],
    [360, 'regular'],
    [399, 'regular'],
    [400, 'wide'],
    [599, 'wide'],
    [600, 'tablet'],
    [839, 'tablet'],
    [840, 'desktop'],
  ] as const)('%dpx를 %s 구간으로 분류한다', (width, expected) => {
    expect(getViewportWidthClass(width)).toBe(expected);
  });
});
