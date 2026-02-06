import { adaptiveFont, adaptiveSize, moderateScale } from './scaleUtils';

export const FONT_SIZES = {
  INPUT_FIELD_TITLE: adaptiveFont(14),
  INPUT_FIELD_TEXT: adaptiveFont(14),

  TITLE: adaptiveFont(32),
  SUBTITLE: adaptiveFont(14),
  SECTION_TITLE: adaptiveFont(18),
  SECTION_TITLE_LARGE: adaptiveFont(20),
  SECTION_TITLE_SMALL: adaptiveFont(16),
  BODY: adaptiveFont(16),
  CAPTION: adaptiveFont(14),
  FOOTNOTE: adaptiveFont(12),
  BUTTON_TEXT: adaptiveFont(14),
  EXTRA_SMALL: adaptiveFont(8),
};

export const SPACING = {
  PAGE_HORIZONTAL: moderateScale(16),
  PAGE_VERTICAL: moderateScale(16),
  CARD_HORIZONTAL: moderateScale(16),
  CARD_VERTICAL: moderateScale(16),
  INPUT_HORIZONTAL: moderateScale(20),
  INPUT_VERTICAL: moderateScale(16),
  TAB_HORIZONTAL: moderateScale(16),
  LARGE: moderateScale(40),
  SEMI_LARGE: moderateScale(30),
  MEDIUM: moderateScale(20),
  MEDIUM_PLUS: moderateScale(24),
  SEMI_MEDIUM: moderateScale(16),
  SMALL: moderateScale(12),
  EXTRA_SMALL: moderateScale(8),
  TINY: moderateScale(4),
};

export const HEIGHTS = {
  INPUT_FIELD_HEIGHT: adaptiveSize(48, true),
  BUTTON_HEIGHT: adaptiveSize(44, true),
  OUTLINE_BUTTON_HEIGHT: adaptiveSize(28, true),
  MEDIUM_BUTTON_HEIGHT: adaptiveSize(21, true),
  LARGE_ICON_SIZE: adaptiveSize(36, true),
  MEDIUM_LARGE_ICON_SIZE: adaptiveSize(24, true),
  MEDIUM_ICON_SIZE: adaptiveSize(20, true),
  SMALL_ICON_SIZE: adaptiveSize(16, true),
  BODY_SIZE: adaptiveSize(14, true),
  TAB_HEIGHT: adaptiveSize(56, true),
  MEDIUM_PROFILE_SIZE: adaptiveSize(36, true),
  LARGE_PROFILE_SIZE: adaptiveSize(48, true),
  TINY_ICON_SIZE: adaptiveSize(12, true),
  CONFIR_CODE_SIZE: adaptiveSize(59, true),

  FIXED_BUTTON_HEIGHT: adaptiveSize(64, true),

  AGE_CONTAINER_SIZE: adaptiveSize(36, true),

  SUMMARY_IMAGE_SIZE: adaptiveSize(84, true),
  ITEM_SIZE_84: adaptiveSize(84, true),
  ITEM_SIZE_30: adaptiveSize(30, true),
  ITEM_SIZE_35: adaptiveSize(35, true),
  ITEM_SIZE_64: adaptiveSize(64, true),
};

export const SERVICE_GRID_IMAGE_WIDTH = adaptiveSize(0.55);
export const GRID_IMAGE_WIDTH = adaptiveSize(0.75);

export const BORDERS = {
  DEFAULT_BORDER: moderateScale(1),
  BOLD_BORDER: moderateScale(2),
  RADIO_SECLECTED_BORDER: moderateScale(2),
  RADIO_SELECTED_CIRCLE_BORDER: moderateScale(4),
};

export const RADIUS = {
  LARGE: moderateScale(20),
  MEDIUM: moderateScale(12),
  MEDIUM_SMALL: moderateScale(10),
  SMALL: moderateScale(8),
  TINY: moderateScale(4),
  FULL: moderateScale(100),
};

export const SHADOW_OFFSET = {
  REGULAR_HEIGHT: moderateScale(4),
  REGULAR_WIDTH: moderateScale(4),
};

export const SHADOW_OPACITY = {
  REGULAR: 0.3,
};

export const PRESSABLE_OPACITY = {
  ACTIVE: 0.6,
};

export const FONT_WEIGHTS: Record<string, FontWeight> = {
  THIN: '100',
  EXTRA_LIGHT: '200',
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
  BLACK: '900',
};

export type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'normal'
  | 'bold';

export const FONT_FAMILY = {
  REGULAR: 'Satoshi-Regular',
  MEDIUM: 'Satoshi-Medium',
  SEMI_BOLD: 'Satoshi-SemiBold',
  BOLD: 'Satoshi-Bold',
};
