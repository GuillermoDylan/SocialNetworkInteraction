import { useEffect, useRef, useState } from "react";
import { Animated, Button, Modal, StyleSheet, View } from "react-native";
import { Audio } from "expo-av";
import InstructionScreen from "~/src/app/components/InstructionsScreen";
import FeedScreen from "../(tabs)/index"; // your existing Profile/feed component
import ForYouFeed from "../(tabs)/tiktok"; // your TikTok feed component
import FacebookFeed from "../(tabs)/facebook";

import { useTranslation } from "react-i18next";

type Step = "intro1" | "instagram" | "intro2" | "tiktok" | "intro3" | "facebook" | "done";

let completionSoundPlaybackInProgress = false;

async function playCompletionSound() {
    if (completionSoundPlaybackInProgress) return;

    completionSoundPlaybackInProgress = true;

    try {
        const { sound } = await Audio.Sound.createAsync(
            require("~/assets/sounds/notification.mp3"),
            { shouldPlay: true },
        );

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                completionSoundPlaybackInProgress = false;
                void sound.unloadAsync();
            }
        });
    } catch {
        completionSoundPlaybackInProgress = false;
        // Sound feedback should not block the study flow.
    }
}

const FIREWORK_PARTICLES = [
    { angle: 0, distance: 78, color: "#ff4d6d" },
    { angle: 45, distance: 64, color: "#ffd166" },
    { angle: 90, distance: 78, color: "#06d6a0" },
    { angle: 135, distance: 64, color: "#4cc9f0" },
    { angle: 180, distance: 78, color: "#f72585" },
    { angle: 225, distance: 64, color: "#ffd166" },
    { angle: 270, distance: 78, color: "#06d6a0" },
    { angle: 315, distance: 64, color: "#4cc9f0" },
];

function CompletionOverlay({
    visible,
    title,
    onPress,
}: {
    visible: boolean;
    title: string;
    onPress: () => void;
}) {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) {
            progress.stopAnimation();
            progress.setValue(0);
            return;
        }

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(progress, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();
        return () => animation.stop();
    }, [progress, visible]);

    if (!visible) return null;

    return (
        <Modal visible transparent animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.buttonContainer}>
                    {FIREWORK_PARTICLES.map((particle) => {
                        const radians = (particle.angle * Math.PI) / 180;
                        const translateX = progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, Math.cos(radians) * particle.distance],
                        });
                        const translateY = progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, Math.sin(radians) * particle.distance],
                        });

                        return (
                            <Animated.View
                                key={`${particle.angle}-${particle.color}`}
                                style={[
                                    styles.particle,
                                    { backgroundColor: particle.color },
                                    {
                                        opacity: progress.interpolate({
                                            inputRange: [0, 0.15, 0.8, 1],
                                            outputRange: [0, 1, 1, 0],
                                        }),
                                        transform: [{ translateX }, { translateY }],
                                    },
                                ]}
                            />
                        );
                    })}
                    <View style={styles.button}>
                        <Button title={title} onPress={onPress} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        zIndex: 1,
    },
    particle: {
        position: "absolute",
        zIndex: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});


export default function StudyFlow() {
    const [step, setStep] = useState<Step>("intro1");
    const [showButton, setShowButton] = useState(false);
    const completionHandledForStep = useRef<Step | null>(null);
    const { t } = useTranslation();

    function handleTasksCompleted(completedStep: Step) {
        if (completionHandledForStep.current === completedStep) return;

        completionHandledForStep.current = completedStep;
        void playCompletionSound();
        setShowButton(true);
    }

    function useBeforeUnload(shouldWarn: boolean) {
        useEffect(() => {
            if (!shouldWarn) return;

            const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ""; // required by some browsers
            };

            window.addEventListener("beforeunload", handler);
            return () => window.removeEventListener("beforeunload", handler);
        }, [shouldWarn]);
    }

    useBeforeUnload(true);

    switch (step) {
        case "intro1":
            return (
                <InstructionScreen
                    title="instruction.1.title"
                    body="instruction.1.text"
                    boldBody="instruction.1.text.bold"
                    buttonLabel="btn.continue"
                    onContinue={() => setStep("instagram")}
                    isFirst={true}
                />
            );

        case "instagram":
            return (
                <View className="flex-1">
                    <FeedScreen
                        // Placeholder hook — call this when your task-completion
                        // logic decides the user is done with this screen.
                        onTasksCompleted={() => {
                            handleTasksCompleted("instagram");
                        }}
                    />
                    <CompletionOverlay
                        visible={showButton}
                        title={t("btn.continue")}
                        onPress={() => {
                            setStep("intro2");
                            setShowButton(false);
                        }}
                    />
                </View>
            );

        case "intro2":
            return (
                <InstructionScreen
                    title="instruction.2.title"
                    body="instruction.2.text"
                    boldBody="instruction.2.text.bold"
                    buttonLabel="btn.continue"
                    onContinue={() => {
                        setStep("tiktok");
                        setShowButton(false);
                    }}
                />
            );

        case "tiktok":
            return (
                <View className="flex-1">
                    <ForYouFeed
                        onTasksCompleted={() => {
                            handleTasksCompleted("tiktok");
                        }}
                    />
                    <CompletionOverlay
                        visible={showButton}
                        title={t("btn.continue")}
                        onPress={() => {
                            setStep("intro3");
                            setShowButton(false);
                        }}
                    />
                </View>
            );

        case "intro3":
            return (
                <InstructionScreen
                    title="instruction.3.title"
                    body="instruction.3.text"
                    boldBody="instruction.3.text.bold"
                    buttonLabel="btn.continue"
                    onContinue={() => {
                        setStep("facebook");
                        setShowButton(false);
                    }}
                />
            );

        case "facebook":
            return (
                <View className="flex-1">
                    <FacebookFeed
                        onTasksCompleted={() => {
                            handleTasksCompleted("facebook");
                        }}
                    />
                    <CompletionOverlay
                        visible={showButton}
                        title={t("btn.continue")}
                        onPress={() => {
                            setStep("done");
                            setShowButton(false);
                        }}
                    />
                </View>
            );

        case "done":
            return (
                <InstructionScreen
                    title="end.title"
                    body="end.text"
                    isFinish={true}
                    onContinue={() => { }}
                />
            );
    }
}