import React from 'react';
import { ImageSourcePropType, StyleProp } from 'react-native';

import { HEIGHTS } from '@src/utils/constants';
import ICON_LIBRARIES, { IconLibraryType } from '@src/utils/iconLibraries';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '@src/theme/ThemeProvider';
import Animated from 'react-native-reanimated';

type AppIconProps = {
  icon: string | ImageSourcePropType;
  color?: string;
  size?: number;
  style?: StyleProp<any>;
};

const AppIcon = ({
  icon,
  color,
  size = HEIGHTS.MEDIUM_ICON_SIZE,
  style,
}: AppIconProps) => {
  const { colors } = useTheme();
  let iconType: IconLibraryType = 'ionicons';
  let iconName: string | undefined;

  if (typeof icon === 'string') {
    if (icon.includes(':')) {
      const splitList = icon.split(':');
      iconType = splitList[0] as keyof typeof ICON_LIBRARIES;
      iconName = splitList[1];
    } else {
      iconName = icon;
    }
  }

  const IconComponent = ICON_LIBRARIES[iconType] || Ionicons;
  return (
    <Animated.View style={[style]}>
      {!!iconName && (
        <IconComponent
          name={iconName as any}
          size={size}
          color={color ?? colors.textColor}
          style={style}
        />
      )}
    </Animated.View>
  );
};

export default AppIcon;
