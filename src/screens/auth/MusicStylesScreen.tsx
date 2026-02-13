import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { BORDERS, FONT_WEIGHTS, RADIUS, SPACING } from "@src/utils/constants";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import AppButton from "@src/components/buttons/AppButton";
import Row from "@src/components/layout/Row";
import { MusicStylesScreenProps } from "@src/navigation/auth/auth.params";
import { useState } from "react";
import Footnote from "@src/components/typography/Footnote";
import { callUpdateMusicStyles } from "../../../lib/firebase/functions";


const ALL_MUSIC_STYLES = [
    "Afrobeat",
    "Alternative",
    "Blues",
    "Classical",
    "Dance",
    "Disco",
    "Electro",
    "EDM",
    "Ethnic",
    "Folk",
    "Funk",
    "Greek Pop",
    "Greek Traditional",
    "Hip Hop",
    "House",
    "Indie",
    "Jazz",
    "Latin",
    "Metal",
    "Pop",
    "Psychedelic",
    "Punk",
    "R&B",
    "Rap",
    "Reggae",
    "Reggaeton",
    "Reggaetón",
    "Rock",
    "Rock & Roll",
    "Soul",
    "Techno",
    "Trap",
    "World Music",
    "Electronica",
    "Electronice", // Note: This appears to be a typo (should be "Electronica")
    "Funk Rock"
];

const INITIAL_VISIBLE_COUNT = 15;

const MusicStylesScreen = ({ navigation }: MusicStylesScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const toggleStyle = (style: string) => {
        if (selectedStyles.includes(style)) {
            setSelectedStyles(selectedStyles.filter(s => s !== style));
        } else if (selectedStyles.length < 10) {
            setSelectedStyles([...selectedStyles, style]);
        }
    };

    const visibleStyles = isExpanded ? ALL_MUSIC_STYLES : ALL_MUSIC_STYLES.slice(0, INITIAL_VISIBLE_COUNT);
    const isLimitReached = selectedStyles.length >= 10;

    const handleContinue = async () => {
        try {
            setIsLoading(true)
            await callUpdateMusicStyles(selectedStyles)
            Alert.alert("Music Styles", "Music styles updated successfully", [
                {
                    text: "OK",
                    onPress: () => navigation.replace('MainNavigator', { screen: 'HomeScreen' })
                }
            ])
        } catch (error: any) {
            Alert.alert("Music Styles", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Title style={styles.title}>Muzive</Title>
                <Gap height={SPACING.MEDIUM_PLUS} />
                <Subtitle style={styles.subtitle}>Choose Your Favorite Music Styles</Subtitle>
                <Gap height={SPACING.TINY} />
                <Caption style={styles.subtitle}>You can select up to 10 music styles</Caption>

                <Gap height={SPACING.MEDIUM} />

                {isLimitReached && (
                    <Caption tone="critical" style={styles.limitWarning}>
                        You cannot select more styles.
                    </Caption>
                )}

                <View style={styles.chipContainer}>
                    {visibleStyles.map((style) => {
                        const isSelected = selectedStyles.includes(style);
                        return (
                            <TouchableOpacity
                                key={style}
                                activeOpacity={0.7}
                                onPress={() => toggleStyle(style)}
                                style={[
                                    styles.chip,
                                    isSelected && styles.chipSelected
                                ]}
                            >
                                <Footnote fontWeight="regular">
                                    {style}
                                </Footnote>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    onPress={() => setIsExpanded(!isExpanded)}
                    style={styles.viewMoreButton}
                >
                    <Caption style={styles.viewMoreText}>
                        {isExpanded ? 'View Less' : 'View More'}
                    </Caption>
                </TouchableOpacity>

                <Gap height={SPACING.LARGE} />

                <Row style={styles.buttonRow}>
                    <AppButton
                        title="Skip for Now"
                        onPress={() => { }}
                        buttonType="outline"
                        style={styles.skipButton}
                    />
                    <AppButton
                        title="Continue"
                        onPress={handleContinue}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.continueButton}
                    />
                </Row>
            </ScrollView>
        </Page>
    )
}

export default MusicStylesScreen;

const createStyles = (colors: ThemeColor) =>
    StyleSheet.create({
        scrollContent: {
            paddingBottom: SPACING.LARGE
        },
        title: {
            color: colors.primaryColor,
            textAlign: 'center'
        },
        subtitle: {
            textAlign: 'center'
        },
        limitWarning: {
            marginBottom: SPACING.SMALL
        },
        chipContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.EXTRA_SMALL
        },
        chip: {
            paddingHorizontal: SPACING.EXTRA_SMALL,
            paddingVertical: SPACING.TINY,
            borderRadius: RADIUS.FULL,
            borderWidth: 1,
            borderColor: '#ED5D1650',
            backgroundColor: '#ED5D1610'
        },
        chipSelected: {
            backgroundColor: colors.primaryColor,
            borderColor: colors.primaryColor
        },
        viewMoreButton: {
            alignSelf: 'flex-start',
            marginTop: SPACING.MEDIUM,
            marginLeft: SPACING.SMALL
        },
        viewMoreText: {
            color: colors.primaryColor,
            fontWeight: FONT_WEIGHTS.BOLD
        },
        buttonRow: {
            gap: SPACING.SMALL,
            justifyContent: 'space-between'
        },
        skipButton: {
            flex: 1,
            borderColor: colors.primaryColor,
            borderWidth: BORDERS.DEFAULT_BORDER
        },
        continueButton: {
            flex: 1
        }
    })