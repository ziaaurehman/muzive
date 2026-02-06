import React from 'react';
import ICONS from '@src/utils/icons';
import { FONT_SIZES } from '@src/utils/constants';
import Row from '../layout/Row';
import AppIcon from '../icons/AppIcon';
import { StyleSheet } from 'react-native';
import Caption from '@src/components/typography/Caption';
import Gap from '../layout/Gap';

type ValidationItemProps = {
  message: string;
  isValid: boolean;
};
const SUCCESS_COLOR = '#3CBA58';
const ERROR_COLOR = '#F70808';

const ValidationItem = ({ message, isValid }: ValidationItemProps) => {
  return (
    <Row style={styles.container}>
      <AppIcon
        size={FONT_SIZES.BODY}
        icon={
          isValid ? ICONS.CHECKMARK_CIRCLE_OUTLINE : ICONS.CLOSE_CIRCLE_OUTLINE
        }
        style={{
          color: isValid ? SUCCESS_COLOR : ERROR_COLOR,
        }}
      />
      <Gap />
      <Caption fontWeight='regular'>{message}</Caption>
    </Row>
  );
};

export default ValidationItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
