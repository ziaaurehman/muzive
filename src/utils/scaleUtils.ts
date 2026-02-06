import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions for iPhone 14 Pro
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const SCALED_SPACE = Platform.OS === 'android' ? 0.8 : 1;

const scale = (value: number) =>
  PixelRatio.roundToNearestPixel((width / BASE_WIDTH) * value);

const verticalScale = (value: number) =>
  PixelRatio.roundToNearestPixel((height / BASE_HEIGHT) * value);

const moderateScaleHelper = (value: number, factor = 0.5) =>
  value + (scale(value) - value) * factor;

const moderateScale = (value: number, factor = 0.5) =>
  moderateScaleHelper(value, factor) * SCALED_SPACE;

// Adaptive font scaling
const adaptiveFont = (value: number): number => {
  const fontScale = PixelRatio.getFontScale();
  const scaledFont = moderateScaleHelper(value * fontScale);
  return Platform.OS === 'android' ? scaledFont * 1.1 : scaledFont;
};

// Adaptive size scaling
const adaptiveSize = (value: number, isHeight = false) =>
  isHeight ? verticalScale(value) : scale(value);

export { adaptiveSize, adaptiveFont, scale, verticalScale, moderateScale };
