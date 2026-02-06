export type Tone =
  | "default"
  | "placeholder"
  | "info"
  | "success"
  | "warning"
  | "critical";

export interface ThemeColor {
  transparentColor: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  containerBackgroundColor: string;
  radioButtonBackgroundColor: string;
  outlineBackgroundColor: string;
  overlayColor: string;
  editText: string;

  textColor: string;
  placeholderTextColor: string;
  infoTextColor: string;
  successTextColor: string;
  warningTextColor: string;
  criticalTextColor: string;

  borderColor: string;
  selectedBorderColor: string;

  white: string;
  black: string;
  gray: string;
  inactiveGray: string;
  darkGray: string;

  default: string;
  info: string;
  success: string;
  warning: string;
  critical: string;
  inputCritical: string;

  ticketSold: string;
  ticketRevenue: string;
  dayBackground: string;
  calendarDot: string;
  star: string;
  primaryStar: string;
  iconColor: string;
}
