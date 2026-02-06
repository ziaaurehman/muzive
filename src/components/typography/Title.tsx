import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';
import Animated from 'react-native-reanimated';

const Title = forwardRef<Animated.Text, BaseTextProps>(
  (
    { children, style, tone, fontWeight = 'bold', onPress }: BaseTextProps,
    ref
  ) => {
    const { titleStyle } = styles;

    return (
      <BaseText
        ref={ref}
        fontWeight={fontWeight}
        tone={tone}
        style={[titleStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default Title;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: FONT_SIZES.TITLE,
  },
});
