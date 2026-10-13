import { useEffect, useState } from "react";
import { Button, View } from "react-native";
import InstructionScreen from "~/src/app/components/InstructionsScreen";
import FeedScreen from "../(tabs)/index"; // your existing Profile/feed component
import ForYouFeed from "../(tabs)/tiktok"; // your TikTok feed component
import FacebookFeed from "../(tabs)/facebook";

import { useTranslation } from "react-i18next";

type Step = "intro1" | "instagram" | "intro2" | "tiktok" | "intro3" | "facebook" | "done";


export default function StudyFlow() {
    const [step, setStep] = useState<Step>("intro1");
    const [showButton, setShowButton] = useState(false);
    const { t } = useTranslation();

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
                />
            );

        case "instagram":
            return (
                <View className="flex-1">
                    <FeedScreen
                        // Placeholder hook — call this when your task-completion
                        // logic decides the user is done with this screen.
                        onTasksCompleted={() => setShowButton(true)}
                    />
                    {showButton && <Button title={t("btn.continue")} onPress={() => setStep("intro2")} />}
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
                        onTasksCompleted={() => setShowButton(true)}
                    />
                    {showButton && <Button title={t("btn.continue")} onPress={() => setStep("intro3")} />}
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
                        onTasksCompleted={() => setShowButton(true)}
                    />
                    {showButton && <Button title={t("btn.continue")} onPress={() => setStep("done")} />}
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