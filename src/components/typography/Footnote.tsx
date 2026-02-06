import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';
import Animated from 'react-native-reanimated';

const Footnote = forwardRef<Animated.Text, BaseTextProps>(
  (
    { children, fontWeight = 'medium', tone, style, onPress }: BaseTextProps,
    ref
  ) => {
    const { footnoteStyle } = styles;

    return (
      <BaseText
        ref={ref}
        fontWeight={fontWeight}
        tone={tone}
        style={[footnoteStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default Footnote;

const styles = StyleSheet.create({
  footnoteStyle: {
    fontSize: FONT_SIZES.FOOTNOTE,
  },
});
