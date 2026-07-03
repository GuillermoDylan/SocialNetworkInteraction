import { useState } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import {
    useSharedValue,
    withSpring,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Post } from "../model/post";
import AnimatedIconToggle from "./buttons/AnimatedIconToggle";
import DoubleTapHeart from "./buttons/DoubleTapHeart";

type PostListItemProps = {
    post: Post;
};

export default function PostListItem({ post }: PostListItemProps) {
    const liked = useSharedValue(0);
    const reposted = useSharedValue(0);
    const saved = useSharedValue(0);
    const [lastTap, setLastTap] = useState<number | null>(null);

    const heartProgress = useSharedValue(0);
    const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
    const [showHeart, setShowHeart] = useState(false);

    const triggerDoubleTapHeart = (x: number, y: number) => {
        setHeartPosition({ x, y });
        setShowHeart(true);
        heartProgress.value = 0;
        heartProgress.value = withSequence(
            withTiming(1, { duration: 250 }),
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 250 }, (finished) => {
                if (finished) {
                    runOnJSSetShowHeart(false);
                }
            })
        );
    };

    // Reanimated callbacks must hop back to JS via runOnJS
    const runOnJSSetShowHeart = (value: boolean) => {
        setShowHeart(value);
    };

    const handleImagePress = (event: any) => {
        const now = Date.now();
        const { locationX, locationY } = event.nativeEvent;

        if (lastTap && now - lastTap < 300) {
            liked.value = withSpring(1);
            console.log(event.nativeEvent)
            triggerDoubleTapHeart(locationX, locationY);
            setLastTap(null);
        } else {
            setLastTap(now);
        }
    };

    const toggleLike = () => {
        liked.value = withSpring(liked.value ? 0 : 1);
    };

    const toggleRepost = () => {
        reposted.value = withSpring(reposted.value ? 0 : 1);
    };

    const toggleSave = () => {
        saved.value = withSpring(saved.value ? 0 : 1);
    };

    return (
        <View className='bg-white'>
            {
                post.type == "video" &&
                <View className="relative">
                    <View className="absolute top-0 left-0 z-10 p-3 flex-row items-center gap-2">
                        <Image source={{ uri: post.user.image_url }} className="w-12 aspect-square rounded-full" />
                        <Text className="font-semibold underline">{post.user.username}</Text>
                    </View>
                    <Pressable onPress={handleImagePress}>
                        <Image source={{ uri: post.image_url }} className="w-full aspect-[4/3]" />
                        {showHeart && (
                            <DoubleTapHeart
                                progress={heartProgress}
                                x={heartPosition.x}
                                y={heartPosition.y}
                            />
                        )}
                    </Pressable>
                </View>
            }
            {
                post.type == "pic" &&
                <>
                    <View className="flex-row justify-between items-center">
                        <View className="p-3 flex-row items-center gap-2">
                            <Image source={{ uri: post.user.image_url }} className="w-6 aspect-square rounded-full" />
                            <Text className="font-semibold">
                                {post.user.username || 'New user'}
                            </Text>
                            <Text className="text-gray-400">• 6h</Text>
                        </View>
                        <Entypo name="dots-three-horizontal" className="p-3" size={20} />
                    </View>
                    <Pressable onPress={handleImagePress}>
                        <Image source={{ uri: post.image_url }} className="w-full aspect-[4/3]" />
                        {showHeart && (
                            <DoubleTapHeart
                                progress={heartProgress}
                                x={heartPosition.x}
                                y={heartPosition.y}
                            />
                        )}
                    </Pressable>
                </>
            }
            <View className="flex-row gap-3 p-3 items-center">

                <AnimatedIconToggle
                    active={liked}
                    onPress={toggleLike}
                    outlineIcon={<Ionicons name="heart-outline" size={20} color="black" />}
                    filledIcon={<Ionicons name="heart" size={20} color="red" />}
                />

                <Ionicons name="chatbubble-outline" size={20} />

                <AnimatedIconToggle
                    active={reposted}
                    onPress={toggleRepost}
                    outlineIcon={<Feather name="repeat" size={20} color="black" />}
                    filledIcon={<Feather name="repeat" size={20} color="green" />}
                />

                <Feather name="send" size={20} />

                <AnimatedIconToggle
                    active={saved}
                    onPress={toggleSave}
                    outlineIcon={<Ionicons name="bookmark-outline" size={20} color="black" />}
                    filledIcon={<Ionicons name="bookmark" size={20} color="black" />}
                    className="ml-auto"
                />
            </View>
            <View className="px-3">
                <Text><Text className="font-bold">{post.user.username}</Text> {post.caption}</Text>
            </View>
        </View >
    )
}