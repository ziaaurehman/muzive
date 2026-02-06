import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import AppIcon from '@src/components/icons/AppIcon';
import { HEIGHTS } from '@src/utils/constants';
import { useTheme } from '@src/theme/ThemeProvider';

interface ClickableIconProps {
  onPress?: () => void;
  icon: string | ImageSourcePropType;
  size?: number;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const ClickableIcon = ({
  onPress,
  icon,
  size = HEIGHTS.MEDIUM_ICON_SIZE,
  style,
  iconStyle,
  disabled = false,
}: ClickableIconProps) => {
  const { colors } = useTheme();
  const disabledStyle: StyleProp<TextStyle> = {
    color: disabled ? colors.placeholderTextColor : colors.textColor,
  };
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={style}>
      <AppIcon icon={icon} size={size} style={[disabledStyle, iconStyle]} />
    </TouchableOpacity>
  );
};

export default ClickableIcon;
