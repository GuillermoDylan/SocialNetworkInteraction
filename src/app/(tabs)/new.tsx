import { Image, View, Text} from "react-native";

export default function CreatePost() {
  return (
    <View className="p-3 items-center">

      <Image source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/2.jpg' }} className="w-52 aspect-[3/4] rounded-lg shadow-md" />


      <Text onPress={() => {}} className="text-blue-500 font-semibold m-5">Change</Text>
    </View>
  );
}

