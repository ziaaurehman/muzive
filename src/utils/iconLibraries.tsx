import Ionicons from '@react-native-vector-icons/ionicons';
import Octicons from '@react-native-vector-icons/octicons';
// Import other icon libraries as needed

const ICON_LIBRARIES = {
  ionicons: Ionicons,
  octicons: Octicons,
  // Add other icon libraries here
};

export type IconLibraryType = keyof typeof ICON_LIBRARIES;

export default ICON_LIBRARIES;
