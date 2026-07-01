import { getViewportWidthClass, shouldUseDesktopLayout } from '../responsive';

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

describe('shouldUseDesktopLayout', () => {
  it('넓지만 높이가 짧은 휴대폰 landscape에는 desktop layout을 쓰지 않는다', () => {
    expect(shouldUseDesktopLayout(844, 390)).toBe(false);
  });

  it('충분히 넓고 높은 Web viewport에는 desktop layout을 쓴다', () => {
    expect(shouldUseDesktopLayout(1024, 768)).toBe(true);
  });
});
