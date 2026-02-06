import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@src/theme/ThemeProvider';
import { FONT_WEIGHTS, SPACING } from '@src/utils/constants';
import Footnote from '../typography/Footnote';

interface PasswordStrengthBarProps {
    password?: string;
    height?: number;
    radius?: number;
}

const PasswordStrengthBar = ({
    password = '',
    height = 8,
    radius = 3
}: PasswordStrengthBarProps) => {
    const { colors } = useTheme();

    const progress = useSharedValue(0);

    const strength = useMemo(() => {
        if (!password) return { level: 'None', percent: 0, color: colors.white };

        // Simple criteria for demonstration - can be expanded
        const hasLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUpper = /[A-Z]/.test(password);

        let score = 0;
        if (password.length > 0) score = 1; // Weak
        if (password.length >= 6 && (hasNumber || hasUpper)) score = 2; // Medium
        if (hasLength && hasNumber && hasSpecial && hasUpper) score = 3; // Strong

        switch (score) {
            case 1:
                return { level: 'Weak', percent: 0.25, color: colors.critical };
            case 2:
                return { level: 'Medium', percent: 0.65, color: colors.warning };
            case 3:
                return { level: 'Strong', percent: 1, color: colors.success };
            default:
                return { level: 'None', percent: 0, color: colors.white };
        }
    }, [password, colors]);

    useEffect(() => {
        progress.value = withSpring(strength.percent, {
            damping: 20,
            stiffness: 90
        });
    }, [strength.percent]);

    const animatedBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
            backgroundColor: withTiming(strength.color, { duration: 100 }),
        };
    });

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.backgroundBar,
                    {
                        backgroundColor: colors.outlineBackgroundColor,
                        height: height,
                        borderRadius: radius
                    }
                ]}
            >
                <Animated.View style={[styles.progressBar, animatedBarStyle, { borderRadius: radius }]} />
            </View>
            <View >
                <Footnote
                    style={{
                        fontWeight: FONT_WEIGHTS.REGULAR,
                        marginTop: 6
                    }}
                >
                    {strength.level !== 'None' ? strength.level : ''}
                </Footnote>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 4,
    },
    backgroundBar: {
        width: '100%',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});

export default PasswordStrengthBar;
