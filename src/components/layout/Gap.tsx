import React, { PropsWithChildren, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SPACING } from '@src/utils/constants';
import { adaptiveSize } from '@src/utils/scaleUtils';

type GapProps = PropsWithChildren<{
  width?: number;
  height?: number;
  fillRemainingSpace?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

const Gap = ({
  width = adaptiveSize(SPACING.TINY),
  height = adaptiveSize(SPACING.TINY),
  fillRemainingSpace = false,
  style,
}: GapProps) => {
  const styles = useMemo(
    () => createStyles(width, height, fillRemainingSpace),
    [width, height, fillRemainingSpace]
  );

  return <View style={[styles.gap, style]} />;
};

const createStyles = (
  width: number,
  height: number,
  fillRemainingSpace: boolean
) =>
  StyleSheet.create({
    gap: {
      width: adaptiveSize(width),
      height: adaptiveSize(height, true),
      ...(fillRemainingSpace && { flex: 1 }),
    },
  });

export default Gap;
