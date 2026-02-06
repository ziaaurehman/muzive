import { DARK_COLORS } from '@src/theme/colors';
import { ThemeColor } from '@src/theme/interfaces/theme.color';
import { useTheme } from '@src/theme/ThemeProvider';
import { BORDERS, RADIUS, SPACING } from '@src/utils/constants';
import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Caption from '../typography/Caption';
import Gap from './Gap';

export type AppCardType = 'primary' | 'secondary' | 'outline';

type CardProps = PropsWithChildren & {
  title?: string;
  noPadding?: boolean;
  titleGap?: number;
  cardType?: AppCardType;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const Card = ({
  children,
  style,
  noPadding,
  title,
  titleGap,
  onPress,
  cardType = 'primary',
  borderRadius = RADIUS.LARGE,
  paddingVertical = SPACING.PAGE_VERTICAL,
  paddingHorizontal = SPACING.PAGE_HORIZONTAL,
}: CardProps) => {
  const { colors } = useTheme();
  const { containerStyle } = createStyle(!!noPadding, colors);

  const baseContainerStyle: ViewStyle = {
    borderRadius: borderRadius,
    paddingHorizontal: noPadding ? 0 : paddingHorizontal,
    paddingVertical: noPadding ? 0 : paddingVertical,
  };

  const CardTypeStyles: Record<AppCardType, { cardStyle: ViewStyle }> = {
    primary: {
      cardStyle: {
        width: '92%',
        backgroundColor: colors.outlineBackgroundColor,
        shadowColor: colors.black,
        shadowOffset:
          colors.textColor === DARK_COLORS.textColor
            ? undefined
            : { width: 0, height: 4 },
        shadowOpacity: colors.textColor === DARK_COLORS.textColor ? 0 : 0.25,
        shadowRadius: colors.textColor === DARK_COLORS.textColor ? 0 : 12,
        elevation: colors.textColor === DARK_COLORS.textColor ? 0 : 6,
      },
    },
    secondary: {
      cardStyle: {
        width: '100%',
        backgroundColor: colors.radioButtonBackgroundColor,
      },
    },
    outline: {
      cardStyle: {
        width: '100%',
        backgroundColor: colors.outlineBackgroundColor,
        borderWidth: BORDERS.DEFAULT_BORDER,
        borderColor: colors.darkGray,
      },
    },
  };

  return (
    <Pressable
      onPress={onPress}
      style={[baseContainerStyle, CardTypeStyles[cardType].cardStyle, style]}
    >
      {title && (
        <>
          <Caption>{title}</Caption>
          <Gap height={titleGap ?? SPACING.SMALL} />
        </>
      )}
      {children}
    </Pressable>
  );
};

export default Card;

const createStyle = (noPadding: boolean, colors: ThemeColor) =>
  StyleSheet.create({
    containerStyle: {},
  });
