import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';

const Body = forwardRef<Animated.Text, BaseTextProps>(
  ({ children, fontWeight, tone, style, onPress }: BaseTextProps, ref) => {
    const { bodyStyle } = styles;

    return (
      <BaseText
        ref={ref}
        fontWeight={fontWeight}
        tone={tone}
        style={[bodyStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default Body;

const styles = StyleSheet.create({
  bodyStyle: {
    fontSize: FONT_SIZES.BODY,
  },
});
