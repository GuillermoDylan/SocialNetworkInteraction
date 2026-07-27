import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";

import { isEmittingData } from "~/assets/tracker/tracker-agent";
import { useEffect, useState } from "react";

type InstructionScreenProps = {
  title: string;
  body: string;
  buttonLabel?: string;
  onContinue: () => void;
  isFinish?: boolean;
};

export default function InstructionScreen({
  title,
  body,
  buttonLabel,
  onContinue,
  isFinish,
}: InstructionScreenProps) {
  const { t, i18n } = useTranslation();

  let [state, setState] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ch" : "en");
  };

  useEffect(() => {
    state = !isEmittingData();
    console.log(state);
  }, [state])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-center mb-4">{t(title)}</Text>
        <Text className="text-base text-gray-700 text-center leading-6">{t(body)}</Text>
        <Pressable onPress={toggleLanguage} className="bg-gray-200 rounded-full py-4 items-center mb-3 w-36 mt-4 self-center">
          <Text className="text-black font-bold text-base">{i18n.language === "en" ? "Switch to CH" : "Switch to EN"}</Text>
        </Pressable>
        {isFinish && state &&
          <><Text className="text-center font-bold text-black text-base pt-2 pb-2">Do not close the page. Please wait.</Text><ActivityIndicator size="large" /></>}
      </View>

      {buttonLabel ? (
        <View className="px-6 pb-10">
          <Pressable onPress={onContinue} className="bg-black rounded-full py-4 items-center">
            <Text className="text-white font-bold text-base">{t(buttonLabel)}</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}