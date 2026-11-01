import { View, Text, Pressable, ActivityIndicator, Platform, Modal, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";

// import { isEmittingData } from "~/assets/tracker/tracker-agent";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";


import qr from "~/assets/images/qr_personalizado.png"
import { isExperimentReachable } from "~/assets/tracker/tracker-agent";

type InstructionScreenProps = {
  title: string;
  body: string;
  boldBody?: string;
  buttonLabel?: string;
  onContinue: () => void;
  isFinish?: boolean;
  isFirst?: boolean;
};

function detectMobileDevice() {
  if (Platform.OS !== "web" || typeof navigator === "undefined") {
    return Platform.OS !== "web";
  }

  const userAgent = navigator.userAgent;
  const isTouchMac = navigator.maxTouchPoints > 1 && /Macintosh/i.test(userAgent);

  return /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent) || isTouchMac;
}

export default function InstructionScreen({
  title,
  body,
  boldBody,
  buttonLabel,
  onContinue,
  isFinish,
  isFirst
}: InstructionScreenProps) {
  const { t, i18n } = useTranslation();
  const isMobileDevice = detectMobileDevice();

  let [state, setState] = useState(false);
  const [gender, setGender] = useState<string | null>('male');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(!isFirst || (birthDate !== null));
  const [isTrackingAvailable, setTrackingAvailable] = useState<boolean>(true);

  const formatBirthDate = (date: Date | null) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const minBirthDate = formatBirthDate(new Date(today.getFullYear() - 45, today.getMonth(), today.getDate()));
  const maxBirthDate = formatBirthDate(new Date(today.getFullYear() - 12, today.getMonth(), today.getDate()));

  const handleBirthDateChange = (selectedDate: Date) => {
    setBirthDate(selectedDate);
    localStorage.setItem("edad", (today.getFullYear() - selectedDate.getFullYear()).toString())
    setCanContinue(!isFirst || (gender !== null))
  };

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

  const checkNextScreen = async () => {
    var status = await isExperimentReachable();
    if (status) {
      setTrackingAvailable(true);
      onContinue();
    } else {
      setCanContinue(false);
      setTrackingAvailable(false);
    }
  }

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "zh", label: "官話" },
  ];


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-center mb-4">{t(title)}</Text>
        <Text className="text-base text-gray-700 text-center leading-6">{t(body)}</Text>
        {boldBody && <Text className="text-base text-gray-700 text-center leading-6 font-bold">{t(boldBody)}</Text>}
        {
          !isFinish && <View className="flex flex-row justify-center gap-2 flex-wrap mb-8">
            {languages.map(({ code, label }) => (
              <Pressable
                key={code}
                onPress={() => toggleLanguage(code)}
                className={`rounded-full py-4 items-center w-36 mt-4 self-center ${i18n.language === code ? "bg-blue-300" : "bg-gray-200"
                  }`}
              >
                <Text className="text-black font-bold text-base">{label}</Text>
              </Pressable>
            ))}
          </View>
        }

        {
          isFirst &&
          <View className="gap-4">
            <View className="flex items-center my-4">
              <Text className="mb-2 text-lg font-bold text-gray-700">{t("gender")}</Text>
              <View className="flex-row justify-center gap-4">
                {["male", "female", "other"].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setGender(option);
                      localStorage.setItem("gender", option)
                      setCanContinue(!isFirst || (gender !== null && birthDate !== null))
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: gender === option }}
                    className="flex-row items-center gap-2"
                  >
                    <View className={`h-5 w-5 rounded-full border-2 ${gender === option ? "border-black bg-black" : "border-gray-400"}`} />
                    <Text className="text-base text-gray-700">{t(option)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex items-center my-4">
              <Text className="mb-2 text-lg font-bold text-gray-700">{t("age")}</Text>
              <input
                type="date"
                value={formatBirthDate(birthDate)}
                min={minBirthDate}
                max={maxBirthDate}
                onChange={(event) => {
                  const [year, month, day] = event.target.value.split("-").map(Number);
                  if (year && month && day) {
                    handleBirthDateChange(new Date(year, month - 1, day));
                  }
                }}
                aria-label="Birthday"
                className="h-10 w-40 rounded border border-gray-300 px-3 text-center"
              />
            </View>
          </View>
        }

        <Modal
          visible={!isMobileDevice}
          transparent
          animationType="fade"
          onRequestClose={() => undefined}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="rounded-lg bg-white px-6 py-4">
              <Text className="text-center text-lg font-bold">{t("notMobile")}</Text>
              <Image source={qr} className="self-center" />
            </View>
          </View>
        </Modal>
        
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

      </ScrollView>

      <Modal
        visible={!isTrackingAvailable}
        transparent
        animationType="fade"
        onRequestClose={() => undefined}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="rounded-lg bg-white px-6 py-4">
            <Text className="text-center text-lg font-bold">{t("trackingOff")}</Text>
          </View>
        </View>
      </Modal>

      {buttonLabel ? (
        <View className="px-6 pb-10">
          <Pressable
            disabled={!isMobileDevice || !canContinue}
            onPress={isMobileDevice && canContinue ? checkNextScreen : undefined}
            className={isMobileDevice && canContinue ? "bg-black rounded-full py-4 items-center" : "bg-gray-400 rounded-full py-4 items-center"}
            accessibilityState={{ disabled: !isMobileDevice || !canContinue }}
          >
            <Text className="text-white font-bold text-base">{t(buttonLabel)}</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}