import React, { PropsWithChildren } from 'react';
import { DimensionValue, ViewStyle, View } from 'react-native';
import { SPACING } from '@src/utils/constants';

type PaddingProps = PropsWithChildren & {
  paddingHorizontal?: DimensionValue;
  paddingVertical?: DimensionValue;
};

export default function Padding({
  paddingHorizontal,
  paddingVertical,
  children,
}: Readonly<PaddingProps>) {
  const style: ViewStyle = {
    paddingHorizontal: paddingHorizontal ?? SPACING.PAGE_HORIZONTAL,
    paddingVertical: paddingVertical ?? SPACING.PAGE_VERTICAL,
    width: '100%',
  };
  return <View style={style}>{children}</View>;
}
