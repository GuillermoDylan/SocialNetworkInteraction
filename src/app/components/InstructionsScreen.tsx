import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";

// import { isEmittingData } from "~/assets/tracker/tracker-agent";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type InstructionScreenProps = {
  title: string;
  body: string;
  boldBody?: string;
  buttonLabel?: string;
  onContinue: () => void;
  isFinish?: boolean;
};

export default function InstructionScreen({
  title,
  body,
  boldBody,
  buttonLabel,
  onContinue,
  isFinish,
}: InstructionScreenProps) {
  const { t, i18n } = useTranslation();

  let [state, setState] = useState(false);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const message = encodeURIComponent(t("shareMessage"));

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${message}`, "_blank");
  };

  const handleInstaShare = () => {
    window.open(`https://www.instagram.com/`, "_blank");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-center mb-4">{t(title)}</Text>
        <Text className="text-base text-gray-700 text-center leading-6">{t(body)}</Text>
        {boldBody && <Text className="text-base text-gray-700 text-center leading-6 font-bold">{t(boldBody)}</Text>}
        {
          !isFinish && <>
            <Pressable onPress={() => toggleLanguage("en")} className="bg-gray-200 rounded-full py-4 items-center mb-3 w-36 mt-4 self-center">
              <Text className="text-black font-bold text-base">English</Text>
            </Pressable>
            <Pressable onPress={() => toggleLanguage("es")} className="bg-gray-200 rounded-full py-4 items-center mb-3 w-36 mt-4 self-center">
              <Text className="text-black font-bold text-base">Español</Text>
            </Pressable>
            <Pressable onPress={() => toggleLanguage("ch")} className="bg-gray-200 rounded-full py-4 items-center mb-3 w-36 mt-4 self-center">
              <Text className="text-black font-bold text-base">官話</Text>
            </Pressable>
          </>
        }

        {isFinish &&

          <div className="mt-4">
            <p className="text-black text-center text-xl">{t("research")}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center w-16 h-16 p-2 bg-green-500 text-white hover:bg-green-600 mt-4 self-center"
              >
                <Ionicons name="logo-whatsapp" color={"white"} size={24} ></Ionicons>
              </button>
              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center w-16 h-16 p-2 bg-black hover:bg-gray-900 mt-4 self-center"
              >
                <Ionicons name="logo-x" color={"white"} size={24}></Ionicons>
              </button>

              <button
                onClick={handleInstaShare}
                className="flex items-center justify-center w-16 h-16 p-2 bg-[#E1306C] text-white hover:bg-[#C13584] mt-4 self-center"
              >
                <Ionicons name="logo-instagram" color={"white"} size={24}></Ionicons>
              </button>
            </div>
          </div>
        }

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