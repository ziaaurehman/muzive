import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';
import Animated from 'react-native-reanimated';

const Subtitle = forwardRef<Animated.Text, BaseTextProps>(
  (
    { children, fontWeight = 'medium', tone, style, onPress }: BaseTextProps,
    ref
  ) => {
    const { subtitleStyle } = styles;

    return (
      <BaseText
        ref={ref}
        fontWeight={fontWeight}
        tone={tone}
        style={[subtitleStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default Subtitle;

const styles = StyleSheet.create({
  subtitleStyle: {
    fontSize: FONT_SIZES.SUBTITLE,
  },
});
