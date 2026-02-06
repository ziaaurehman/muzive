import { ThemeColor } from '@src/theme/interfaces/theme.color';
import { useTheme } from '@src/theme/ThemeProvider';
import { RADIUS, SPACING } from '@src/utils/constants';
import { Pressable, StyleSheet } from 'react-native';
import Row from '../layout/Row';
import Column from '../layout/Column';
import Caption from '../typography/Caption';
import Gap from '../layout/Gap';
import { ReactNode } from 'react';

type PressableCardProps = {
  title: string;
  icon?: ReactNode;
  description: string;
  onPress?: () => void;
};

export default function PressableCard({
  title,
  icon,
  description,
  onPress,
}: Readonly<PressableCardProps>) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Pressable onPress={onPress}>
      <Row style={styles.container}>
        <Column>
          <Row>
            <Caption>{title}</Caption>
            {icon && (
              <>
                <Gap width={SPACING.TINY} />
                {icon}
              </>
            )}
          </Row>
          <Caption fontWeight='regular'>{description}</Caption>
        </Column>
      </Row>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: SPACING.SMALL,
      paddingHorizontal: SPACING.PAGE_HORIZONTAL,
      borderRadius: RADIUS.MEDIUM_SMALL,
      backgroundColor: colors.radioButtonBackgroundColor,
    },
  });
