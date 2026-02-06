import { SPACING } from '@src/utils/constants';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Direction = 'horizontal' | 'vertical' | 'both';

type CenterProps = PropsWithChildren<{
  direction?: Direction;
  fillParent?: boolean;
  gap?: number;
  flexDirection?: 'row' | 'column';
  style?: ViewStyle;
}>;

const Center = ({
  direction = 'both',
  children,
  flexDirection = 'column',
  gap = SPACING.SMALL,
  fillParent,
  style,
}: CenterProps) => {
  const directionStyle: ViewStyle = {
    gap,
    flexDirection,
    justifyContent:
      direction === 'vertical' || direction === 'both' ? 'center' : undefined,
    alignItems:
      direction === 'horizontal' || direction === 'both' ? 'center' : undefined,
    ...(fillParent && { flex: 1 }),
  };
  return (
    <View style={[styles.containerStyle, directionStyle, style]}>
      {children}
    </View>
  );
};

export default Center;

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
  },
});
