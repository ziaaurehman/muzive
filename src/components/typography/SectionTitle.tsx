import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_SIZES } from '@src/utils/constants';
import BaseText, { BaseTextProps } from './BaseText';
import Animated from 'react-native-reanimated';

const SectionTitle = forwardRef<Animated.Text, BaseTextProps>(
  (
    { children, style, tone, fontWeight = 'bold', onPress }: BaseTextProps,
    ref
  ) => {
    const { sectionTitleStyle } = styles;

    return (
      <BaseText
        ref={ref}
        tone={tone}
        fontWeight={fontWeight}
        style={[sectionTitleStyle, style]}
        onPress={onPress}
      >
        {children}
      </BaseText>
    );
  }
);

export default SectionTitle;

const styles = StyleSheet.create({
  sectionTitleStyle: {
    fontSize: FONT_SIZES.SECTION_TITLE,
  },
});
