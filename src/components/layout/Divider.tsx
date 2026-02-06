import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemeColor } from '@src/theme/interfaces/theme.color';
import { BORDERS } from '@src/utils/constants';
import { useTheme } from '@src/theme/ThemeProvider';

type DividerProps = {
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const Divider = ({ style, color }: DividerProps) => {
  const { colors } = useTheme();
  const { dividerStyle } = createStyles(colors);
  const backgroundColor: ViewStyle = {
    backgroundColor: color ?? dividerStyle.backgroundColor,
  };

  return <View style={[dividerStyle, style, backgroundColor]} />;
};

export default Divider;

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    dividerStyle: {
      width: '100%',
      backgroundColor: colors.gray,
      height: BORDERS.BOLD_BORDER,
    },
  });
