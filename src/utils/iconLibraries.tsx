import Ionicons from '@react-native-vector-icons/ionicons';
import Octicons from '@react-native-vector-icons/octicons';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const ICON_LIBRARIES = {
  ionicons: Ionicons,
  octicons: Octicons,
  materialIcons: MaterialIcons,
};

export type IconLibraryType = keyof typeof ICON_LIBRARIES;

export default ICON_LIBRARIES;
