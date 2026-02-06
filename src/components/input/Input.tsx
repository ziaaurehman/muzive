import React, { useCallback, useMemo, useState } from 'react';
import ClickableIcon from '@src/components/buttons/ClickableIcon';
import Gap from '@src/components/layout/Gap';
import Row from '@src/components/layout/Row';
import Caption from '@src/components/typography/Caption';
import ValidationItem from '@src/components/input/ValidationItem';
import { ThemeColor } from '@src/theme/interfaces/theme.color';
import { useTheme } from '@src/theme/ThemeProvider';
import {
  BORDERS,
  FONT_SIZES,
  HEIGHTS,
  RADIUS,
  SPACING,
} from '@src/utils/constants';
import ICONS from '@src/utils/icons';
import {
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

export type AppValidationRule = {
  id: string;
  rule: string;
  validate: (value: string) => boolean;
};

type InputProps<T extends FieldValues> = TextInputProps &
  UseControllerProps<T> & {
    label?: string;
    errorMessage?: string;
    hasError?: boolean;
    height?: number;
    otherIcon?: React.ReactNode;
    validationRules?: AppValidationRule[];
    onValidationChange?: (isValid: boolean) => void;
  };

const Input = <T extends FieldValues>({
  label,
  editable,
  errorMessage,
  hasError,
  secureTextEntry,
  control,
  name,
  onChangeText,
  otherIcon,
  height,
  validationRules = [],
  onValidationChange,
  ...props
}: InputProps<T>) => {
  const { colors } = useTheme();
  const { containerStyle, inputContainerStyle, iconStyle, inputStyle } =
    createStyles(colors, height);
  const { field } = useController<T>({
    control,
    name,
    defaultValue: '' as PathValue<T, Path<T>>,
  });
  const [isActive, setIsActive] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [validations, setValidations] = useState<Record<string, boolean>>({});

  const borderStyle: ViewStyle = {
    borderWidth: isActive ? BORDERS.BOLD_BORDER : BORDERS.DEFAULT_BORDER,
    borderColor: hasError ? colors.inputCritical : colors.borderColor,
  };

  const secureIcon = isSecure ? ICONS.EYE_CLOSED : ICONS.EYE_OPEN;

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
    field.onBlur();
  };

  const validateField = useCallback(
    (value: string) => {
      const newValidation = validationRules.reduce((acc, rule) => {
        acc[rule.id] = rule.validate(value);
        return acc;
      }, {} as Record<string, boolean>);
      setValidations(newValidation);
      const isValid = Object.values(newValidation).every(Boolean);
      onValidationChange?.(isValid);
    },
    [validationRules, onValidationChange]
  );

  const renderValidationRules = useMemo(() => {
    return validationRules.map((validationRule: AppValidationRule) => {
      const { id, rule } = validationRule;
      const isValid = validations[id];
      return <ValidationItem key={id} message={rule} isValid={isValid} />;
    });
  }, [validations, validationRules]);

  const handleOnChange = (text: string) => {
    onChangeText?.(text);
    field.onChange(text);
    if (validationRules.length > 0) {
      validateField(text);
    }
  };

  const handleClearText = () => {
    onChangeText?.('');
    field.onChange('');
  };

  return (
    <View style={containerStyle}>
      {label && <Caption>{label}</Caption>}
      <Gap height={SPACING.TINY + 2} />
      <Row style={[inputContainerStyle, borderStyle]}>
        <TextInput
          cursorColor={colors.primaryColor}
          value={field.value}
          editable={editable}
          underlineColorAndroid={'transparent'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleOnChange}
          secureTextEntry={isSecure}
          style={inputStyle}
          placeholderTextColor={colors.placeholderTextColor}
          {...props}
        />
        <Gap fillRemainingSpace />
        {secureTextEntry && (
          <ClickableIcon
            icon={secureIcon}
            onPress={() => setIsSecure((prev) => !prev)}
            iconStyle={iconStyle}
          />
        )}
        {editable && !secureTextEntry && !otherIcon && field.value ? (
          <ClickableIcon
            icon={ICONS.CLOSE_FILL}
            iconStyle={iconStyle}
            onPress={handleClearText}
            size={HEIGHTS.SMALL_ICON_SIZE}
          />
        ) : null}
        {otherIcon}
      </Row>
      {hasError && validationRules.length === 0 && (
        <>
          <Gap height={SPACING.TINY} />
          <Caption fontWeight='regular' tone='input-critical'>
            {errorMessage ?? ''}
          </Caption>
        </>
      )}
      {validationRules.length > 0 && (
        <>
          <Gap />
          {renderValidationRules}
        </>
      )}
    </View>
  );
};

export default Input;

const createStyles = (colors: ThemeColor, height?: number) =>
  StyleSheet.create({
    containerStyle: {
      width: '100%',
    },
    inputContainerStyle: {
      borderRadius: RADIUS.SMALL,
      paddingHorizontal: SPACING.SEMI_MEDIUM,
      backgroundColor: 'transparent',
      paddingVertical: height ? SPACING.SMALL : 0,
      alignItems: height ? 'flex-start' : 'center',
      height: height ?? HEIGHTS.INPUT_FIELD_HEIGHT,
    },
    inputStyle: {
      color: colors.white,
      width: '90%',
      fontSize: FONT_SIZES.FOOTNOTE,
    },
    iconStyle: {
      color: colors.white,
    },
  });
