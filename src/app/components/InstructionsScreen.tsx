import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next";

type InstructionScreenProps = {
  title: string;
  body: string;
  buttonLabel?: string;
  onContinue: () => void;
};

export default function InstructionScreen({
  title,
  body,
  buttonLabel,
  onContinue,
}: InstructionScreenProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-center mb-4">{t(title)}</Text>
        <Text className="text-base text-gray-700 text-center leading-6">{t(body)}</Text>
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