import React, { PropsWithChildren } from 'react';
import { SPACING } from '@src/utils/constants';
import { View, ViewStyle } from 'react-native';

type Direction = 'left' | 'right' | 'horizontal';

type IgnorePagePaddingProps = PropsWithChildren<{
  direction?: Direction;
}>;

const IgnorePagePadding = ({
  direction = 'horizontal',
  children,
}: IgnorePagePaddingProps) => {
  const space = -SPACING.PAGE_HORIZONTAL * 2;
  const style: Record<Direction, ViewStyle> = {
    left: { marginLeft: space },
    right: { marginRight: space },
    horizontal: {
      marginHorizontal: space,
    },
  };

  return <View style={[style[direction]]}>{children}</View>;
};

export default IgnorePagePadding;
