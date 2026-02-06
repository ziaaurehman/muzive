import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';
import Animated from 'react-native-reanimated';

const Caption = forwardRef<Animated.Text, BaseTextProps>(
  (
    { children, fontWeight = 'semibold', tone, style, onPress }: BaseTextProps,
    ref
  ) => {
    const { captionStyle } = styles;

    return (
      <BaseText
        ref={ref}
        fontWeight={fontWeight}
        tone={tone}
        style={[captionStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default Caption;

const styles = StyleSheet.create({
  captionStyle: {
    fontSize: FONT_SIZES.CAPTION,
  },
});
