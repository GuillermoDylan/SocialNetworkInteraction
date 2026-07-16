import { useState } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import {
    useSharedValue,
    withSpring,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Post from "../model/post";
import AnimatedIconToggle from "./buttons/AnimatedIconToggle";
import DoubleTapHeart from "./buttons/DoubleTapHeart";
import CommentsSection from "./CommentsSection";
import { resolveLocalImageSource } from "../utils/localImages";

type PostListItemProps = {
    post: Post;
    setLikedPost: (value: boolean) => void;
    setCommentedPost: (value: boolean) => void;
};

export default function PostListItem({ post, setCommentedPost, setLikedPost }: PostListItemProps) {
    const liked = useSharedValue(0);
    const [lastTap, setLastTap] = useState<number | null>(null);

    const [showComments, setShowComments] = useState(false);


    const heartProgress = useSharedValue(0);
    const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
    const [showHeart, setShowHeart] = useState(false);
    const avatarSize = 32;
    const postImageHeight = 420;

    const triggerDoubleTapHeart = (x: number, y: number) => {
        setHeartPosition({ x, y });
        setShowHeart(true);
        heartProgress.value = 0;
        heartProgress.value = withSequence(
            withTiming(1, { duration: 600 }),
        );
        setLikedPost(true);
    };

    // Reanimated callbacks must hop back to JS via runOnJS
    const runOnJSSetShowHeart = (value: boolean) => {
        setShowHeart(value);
    };

    const handleImagePress = (event: any) => {
        const now = Date.now();
        const { x, y, offsetX, offsetY } = event.nativeEvent;

        if (lastTap && now - lastTap < 300) {
            liked.value = withSpring(1);
            console.log(event.nativeEvent)
            triggerDoubleTapHeart(offsetX, offsetY);
            setLastTap(null);
        } else {
            setLastTap(now);
        }
    };

    const toggleLike = () => {
        liked.value = withSpring(liked.value ? 0 : 1);
        setLikedPost(true);
    };

    return (
        <View className='bg-white'>
            {
                post.type == "video" &&
                <View className="relative">
                    <View className="absolute top-0 left-0 z-10 p-3 flex-row items-center gap-2">
                        <Image
                            source={resolveLocalImageSource(post.user?.image_url)}
                            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
                        />
                        <Text className="font-semibold underline">{post.user?.username}</Text>
                    </View>
                    <Pressable onPress={handleImagePress}>
                        <Image
                            source={resolveLocalImageSource(post.image_url)}
                            style={{ width: "100%", height: postImageHeight }}
                            resizeMode="cover"
                        />
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
                            <Image
                                source={resolveLocalImageSource(post.user?.image_url)}
                                style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
                            />
                            <Text className="font-semibold">
                                {post.user?.username || 'New user'}
                            </Text>
                            <Text className="text-gray-400">• 6h</Text>
                        </View>
                    </View>
                    <Pressable onPress={handleImagePress}>
                        <Image
                            source={resolveLocalImageSource(post.image_url)}
                            style={{ width: "100%", height: postImageHeight }}
                            resizeMode="cover"
                        />
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
                    outlineIcon={<Ionicons name="heart-outline" size={30} color="black" />}
                    filledIcon={<Ionicons name="heart" size={30} color="red" />}
                />

                <Pressable onPress={() => setShowComments(true)}>
                    <Ionicons name="chatbubble-outline" size={30} />
                </Pressable>

            </View>
            <View className="px-3">
                <Text><Text className="font-bold">{post.user?.username}</Text> {post.caption}</Text>
            </View>

            <CommentsSection selectedPost={post} setShowComments={setShowComments} showComments={showComments}
                username={"FakeUserName"} setCommentedPost={setCommentedPost} />
        </View >
    )
}