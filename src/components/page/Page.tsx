import {
  View,
  StyleSheet,
  StatusBar,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LIGHT_COLORS } from '@src/theme/colors';
import { ThemeColor } from '@src/theme/interfaces/theme.color';
import { useTheme } from '@src/theme/ThemeProvider';
import { BORDERS, SPACING } from '@src/utils/constants';
import React, { PropsWithChildren } from 'react';

import PageHeader, { PageHeaderMenu } from './PageHeader';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import IgnorePagePadding from '@src/components/layout/IgnorePagePadding';
import Padding from '@src/components/layout/Padding';

type PageProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  noHorizontalPadding?: boolean;
  goBack?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  fullPageContent?: boolean;
  notScrollable?: boolean;
  headerMenu?: PageHeaderMenu[];
  fixedBottomSeparator?: boolean;
  fixedBottomComponent?: React.ReactNode;
}>;

const Page = ({
  title,
  subtitle,
  noHorizontalPadding,
  goBack,
  style,
  notScrollable,
  contentStyle,
  isLoading,
  fullPageContent,
  children,
  headerMenu,
  fixedBottomSeparator = false,
  fixedBottomComponent,
}: PageProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, !!noHorizontalPadding);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.containerStyle, style]}>
      <StatusBar
        barStyle={
          colors.textColor === LIGHT_COLORS.textColor
            ? 'dark-content'
            : 'light-content'
        }
        backgroundColor={colors.backgroundColor}
      />
      {isLoading ? (
        <SafeAreaView
          style={[styles.loadingStyle, styles.fullPageContentStyle]}
        >
          {/* TODO: Use Lottie  */}
          <ActivityIndicator color={colors.textColor} />
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={[
            styles.containerStyle,
            { marginTop: Math.min(insets.top, SPACING.SMALL) },
          ]}
        >
          <Padding
            paddingHorizontal={
              noHorizontalPadding ? SPACING.PAGE_HORIZONTAL : 0
            }
          >
            <PageHeader
              title={title}
              subtitle={subtitle}
              goBack={goBack}
              menu={headerMenu}
            />
          </Padding>
          {notScrollable ? (
            <View
              style={[
                styles.contentBaseStyle,
                contentStyle ?? style,
                fullPageContent ? styles.fullPageContentStyle : {},
              ]}
            >
              {children}
            </View>
          ) : (
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={[contentStyle ?? style]}
              enableOnAndroid={true}
              keyboardOpeningTime={0}
            >
              {children}
            </KeyboardAwareScrollView>
          )}
          {fixedBottomComponent && (
            <IgnorePagePadding>
              <View
                style={[
                  styles.fixedBottomComponentStyle,
                  {
                    borderTopWidth: fixedBottomSeparator
                      ? BORDERS.DEFAULT_BORDER
                      : 0,
                  },
                ]}
              >
                <Padding paddingVertical={0}>{fixedBottomComponent}</Padding>
              </View>
            </IgnorePagePadding>
          )}
        </SafeAreaView>
      )}
    </View>
  );
};

export default Page;

const createStyles = (colors: ThemeColor, noHorizontalPadding: boolean) =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
      paddingHorizontal: noHorizontalPadding
        ? 0
        : SPACING.PAGE_HORIZONTAL * 0.5,
      paddingTop: Platform.OS == 'android' ? SPACING.PAGE_VERTICAL : 0,
    },
    loadingStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentBaseStyle: {
      flex: 1,
    },
    fullPageContentStyle: {
      ...StyleSheet.absoluteFillObject,
    },
    fixedBottomComponentStyle: {
      borderTopWidth: BORDERS.DEFAULT_BORDER,
      borderTopColor: colors.placeholderTextColor,
      paddingVertical: SPACING.MEDIUM,
      paddingHorizontal: SPACING.SMALL,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
