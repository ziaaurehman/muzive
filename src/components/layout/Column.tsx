import { SPACING } from '@src/utils/constants';
import React, { PropsWithChildren } from 'react';
import {
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';

type ColumnProps = PropsWithChildren<{
  pagePadding?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}>;

const Column = ({ children, style, pagePadding, onPress }: ColumnProps) => {
  const paddingStyle: ViewStyle = pagePadding
    ? { paddingHorizontal: SPACING.PAGE_HORIZONTAL }
    : {};
  const renderView = () => {
    if (onPress) {
      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={[styles.columnStyle, style, paddingStyle]}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return <View style={[styles.columnStyle, style]}>{children}</View>;
  };
  return <>{renderView()}</>;
};

export default Column;

const styles = StyleSheet.create({
  columnStyle: {
    flexDirection: 'column',
  },
});
