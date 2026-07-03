import { Image, Text, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { PostUser } from "../model/post";
import "~/assets/styles/stories.css"

type StoryListItemProps = {
    user: PostUser;
};

export default function StoryListItem({ user }: StoryListItemProps) {
    return (
        <View className="p-1 flex gap-2 items-center" key={user.id}>
            <View className="story">
                <Image source={{ uri: user.image_url }} className="w-16 aspect-square rounded-full" />
            </View>
            <Text className="text-xs">{user.username}</Text>
        </View>
    )
}