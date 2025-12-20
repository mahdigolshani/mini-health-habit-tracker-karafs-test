jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockDimensions = {
  get: jest.fn(() => ({width: 375, height: 812})),
  set: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  window: {width: 375, height: 812},
  screen: {width: 375, height: 812},
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);

const mockPixelRatio = {
  get: jest.fn(() => 2),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn(layoutSize => layoutSize * 2),
  roundToNearestPixel: jest.fn(layoutSize => layoutSize),
};

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  get: jest.fn(() => 2),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn(layoutSize => layoutSize * 2),
  roundToNearestPixel: jest.fn(layoutSize => layoutSize),
}));

jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn(styles => styles),
  flatten: jest.fn(style => style),
  compose: jest.fn((style1, style2) => [style1, style2]),
  setStyleAttributePreprocessor: jest.fn(),
  hairlineWidth: 0.5,
  absoluteFill: {},
  absoluteFillObject: {},
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({
    getConstants: jest.fn(() => ({})),
  })),
  get: jest.fn(() => ({
    getConstants: jest.fn(() => ({})),
  })),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn(({ios}) => ios),
    },
    Settings: {
      get: jest.fn(),
      set: jest.fn(),
      watchKeys: jest.fn(),
      clearWatch: jest.fn(),
    },
  };
});

