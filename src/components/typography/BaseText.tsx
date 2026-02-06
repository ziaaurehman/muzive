import React, { forwardRef, PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { ThemeColor, Tone } from '@src/theme/interfaces/theme.color';
import { useTheme } from '@src/theme/ThemeProvider';
import { FONT_FAMILY, FONT_WEIGHTS } from '@src/utils/constants';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextTone = Tone | 'input-critical' | 'white';

export type BaseTextProps = PropsWithChildren &
  TextProps & {
    style?: StyleProp<TextStyle>;
    onPress?: () => void;
    fontWeight?: FontWeight;
    tone?: TextTone;
    onLayout?: () => void;
  };

const BaseText = forwardRef<Animated.Text, BaseTextProps>(
  (
    {
      children,
      style,
      fontWeight = 'regular',
      tone = 'default',
      onPress,
      onLayout,
    }: BaseTextProps,
    ref
  ) => {
    const { colors } = useTheme();
    const { baseTextStyle } = createStyles(colors);

    const fontWeightStyle: Record<FontWeight, TextStyle> = {
      regular: { fontWeight: FONT_WEIGHTS.REGULAR },
      medium: {
        fontWeight: FONT_WEIGHTS.MEDIUM,
        fontFamily: FONT_FAMILY.MEDIUM,
      },
      semibold: {
        fontWeight: FONT_WEIGHTS.SEMI_BOLD,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
      },
      bold: { fontWeight: FONT_WEIGHTS.BOLD },
    };

    const toneStyle: Record<TextTone, TextStyle> = {
      default: { color: colors.textColor },
      placeholder: { color: colors.placeholderTextColor },
      info: { color: colors.infoTextColor },
      warning: { color: colors.warningTextColor },
      critical: { color: colors.criticalTextColor },
      success: { color: colors.successTextColor },
      'input-critical': { color: colors.inputCritical },
      white: { color: colors.white },
    };

    return (
      <Animated.Text
        ref={ref}
        onLayout={onLayout}
        style={[
          baseTextStyle,
          fontWeightStyle[fontWeight],
          toneStyle[tone],
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Animated.Text>
    );
  }
);

export default BaseText;

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    baseTextStyle: {
      fontFamily: 'Inter',
      padding: 0,
    },
  });
