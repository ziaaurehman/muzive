import { HEIGHTS, SPACING } from '@src/utils/constants';
import React from 'react';
import { View, Pressable } from 'react-native';
import ClickableIcon from '../buttons/ClickableIcon';
import ICONS from '@src/utils/icons';
import Title from '../typography/Title';
import Subtitle from '../typography/SubTitle';
import SectionTitle from '@src/components/typography/SectionTitle';
import Row from '@src/components/layout/Row';
import Gap from '@src/components/layout/Gap';
import { useTheme } from '@src/theme/ThemeProvider';

export type PageHeaderAlignment = 'flex-start' | 'center' | 'flex-end';

export type PageHeaderMenu = {
  children: string | React.ComponentType<any> | React.ReactNode;
  title?: string;
  onPress?: () => void;
};

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  goBack?: () => void;
  menu?: PageHeaderMenu[];
};

const PageHeader = ({ title, subtitle, goBack, menu }: PageHeaderProps) => {
  const finalTitle = title ?? '';
  const { colors } = useTheme();

  return (
    <>
      <Row style={{ gap: SPACING.SMALL }}>
        {goBack && <ClickableIcon icon={ICONS.BACK} onPress={goBack} />}
        {goBack ? (
          <SectionTitle numberOfLines={1} ellipsizeMode='tail'>
            {finalTitle}
          </SectionTitle>
        ) : (
          <Title numberOfLines={1} ellipsizeMode='tail'>
            {finalTitle}
          </Title>
        )}
        <Gap fillRemainingSpace />
        <Row style={{ gap: SPACING.SMALL }}>
          {menu?.slice(0, 3)?.map((item, index) => {
            let Children = item?.children;
            let key = `key-${index}`;
            if (typeof Children === 'string') {
              return (
                <ClickableIcon
                  key={key}
                  icon={Children}
                  onPress={item.onPress}
                />
              );
            }
            if (typeof Children === 'function') {
              return (
                Children && (
                  <Pressable key={key} onPress={item.onPress}>
                    <Children color={colors.textColor} />
                  </Pressable>
                )
              );
            }
            if (React.isValidElement(Children)) {
              return <View key={key}>{Children}</View>;
            }
          })}
        </Row>
      </Row>
      {subtitle && (
        <>
          <Gap />
          <Subtitle>{subtitle}</Subtitle>
        </>
      )}
    </>
  );
};

export default PageHeader;
