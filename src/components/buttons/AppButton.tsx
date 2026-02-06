import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Body from '@src/components/typography/Body';
import { useTheme } from '@src/theme/ThemeProvider';
import {
  BORDERS,
  FONT_SIZES,
  HEIGHTS,
  RADIUS,
  SPACING,
} from '@src/utils/constants';
import Caption from '../typography/Caption';
import AppIcon from '../icons/AppIcon';

export type AppButtonType =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'outlineContrast'
  | 'underline'
  | 'plain'
  | 'critical'
  | 'outlineCritical';

export type ButtonAlignment = 'left' | 'center' | 'right';

export type ButtonSize = 'default' | 'small' | 'tiny';
export type TextSize = 'default' | 'small';

type AppButtonProps = {
  icon?: string | ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  buttonType?: AppButtonType;
  buttonAlignment?: ButtonAlignment;
  title?: string;
  accessibilityLabel?: string;
  buttonSize?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  standardWidth?: boolean;
  mediumWidth?: boolean;
  textSize?: TextSize;
};

const AppButton = ({
  onPress,
  style,
  textStyle,
  buttonType = 'primary',
  buttonAlignment = 'center',
  disabled,
  icon,
  loading,
  title,
  accessibilityLabel,
  buttonSize = 'default',
  textSize = 'default',
  fullWidth,
  standardWidth,
  mediumWidth,
}: AppButtonProps) => {
  const { colors } = useTheme();
  const buttonSizeStyle: Record<ButtonSize, DimensionValue> = {
    default: HEIGHTS.INPUT_FIELD_HEIGHT,
    small: HEIGHTS.INPUT_FIELD_HEIGHT * 0.8,
    tiny: HEIGHTS.INPUT_FIELD_HEIGHT * 0.6,
  };
  const baseButtonStyle: ViewStyle = {
    borderRadius: RADIUS.SMALL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.SMALL,
    height: buttonSizeStyle[buttonSize],
    gap: SPACING.EXTRA_SMALL,
    ...(fullWidth && { width: '100%' }),
    ...(standardWidth && { width: '80%' }),
    ...(mediumWidth && { width: '64%' }),
  };

  const buttonAlignmentStyle: Record<ButtonAlignment, ViewStyle> = {
    left: { alignSelf: 'flex-start' },
    center: { alignSelf: 'center' },
    right: { alignSelf: 'flex-end' },
  };

  const buttonTypeStyles: Record<
    AppButtonType,
    { buttonStyle: ViewStyle; textStyle: TextStyle }
  > = {
    primary: {
      buttonStyle: {
        backgroundColor: colors.primaryColor,
      },
      textStyle: { color: colors.white },
    },
    secondary: {
      buttonStyle: {
        backgroundColor: colors.secondaryColor,
      },
      textStyle: { color: colors.white },
    },
    outline: {
      buttonStyle: {
        backgroundColor: colors.outlineBackgroundColor,
        borderWidth: BORDERS.DEFAULT_BORDER,
        borderColor: colors.borderColor,
      },
      textStyle: { color: colors.textColor },
    },
    outlineContrast: {
      buttonStyle: {
        backgroundColor: colors.textColor,
        borderWidth: BORDERS.DEFAULT_BORDER,
        borderColor: colors.textColor,
      },
      textStyle: { color: colors.backgroundColor },
    },
    outlineCritical: {
      buttonStyle: {
        backgroundColor: colors.transparentColor,
        borderWidth: BORDERS.DEFAULT_BORDER,
        borderColor: colors.inputCritical,
      },
      textStyle: { color: colors.inputCritical },
    },
    plain: {
      buttonStyle: {
        backgroundColor: colors.transparentColor,
        paddingHorizontal: 0,
      },
      textStyle: { color: colors.secondaryColor },
    },
    underline: {
      buttonStyle: {
        paddingHorizontal: 0,
        borderRadius: 0,
        borderBottomWidth: BORDERS.DEFAULT_BORDER * 1.2,
        borderColor: colors.textColor,
        height: 'auto',
      },
      textStyle: { color: colors.textColor, fontSize: FONT_SIZES.CAPTION },
    },
    critical: {
      buttonStyle: {
        backgroundColor: colors.inputCritical,
      },
      textStyle: { color: colors.white },
    },
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed || disabled ? 0.4 : 1 },
        baseButtonStyle,
        buttonTypeStyles[buttonType].buttonStyle,
        buttonAlignmentStyle[buttonAlignment],
        style,
      ]}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {loading && buttonType !== 'plain' ? (
        <ActivityIndicator size='small' color={colors.white} />
      ) : (
        <>
          {icon && typeof icon === 'string' && (
            <AppIcon
              size={HEIGHTS.MEDIUM_ICON_SIZE}
              icon={icon}
              color={buttonTypeStyles[buttonType].textStyle.color?.toString()}
            />
          )}
          {icon && typeof icon !== 'string' && icon}
          {title &&
            (buttonSize === 'tiny' || textSize === 'small' ? (
              <Caption
                fontWeight='medium'
                style={[buttonTypeStyles[buttonType].textStyle, textStyle]}
              >
                {title}
              </Caption>
            ) : (
              <Body
                fontWeight='medium'
                style={[buttonTypeStyles[buttonType].textStyle, textStyle]}
              >
                {title}
              </Body>
            ))}
        </>
      )}
    </Pressable>
  );
};

export default AppButton;
