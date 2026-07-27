import { useRef, useState } from "react";
import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import AnimatedIconToggle from "~/src/app/components/buttons/AnimatedIconToggle";
import DoubleTapHeart from "~/src/app/components/buttons/DoubleTapHeart";
import { resolveLocalImageSource } from "~/src/app/utils/localImages";
import FacebookPost from "~/src/app/model/FacebookPost";

const { width: screenWidth } = Dimensions.get("window");

type FacebookPostCardProps = {
    post: FacebookPost;
    liked: boolean;
    likeCount: number;
    commentCount: number;
    onToggleLike: () => void;
    onOpenComments: () => void;
};

export default function FacebookPostCard({
    post,
    liked,
    likeCount,
    commentCount,
    onToggleLike,
    onOpenComments,
}: FacebookPostCardProps) {
    const heartActive = useSharedValue(liked ? 1 : 0);

    const triggerLike = (fromDoubleTap = false) => {
        if (!liked) {
            heartActive.value = withSpring(1);
            onToggleLike();
        } else if (!fromDoubleTap) {
            heartActive.value = withSpring(0);
            onToggleLike();
        }
    };

    const hasImage = !!post.image_url;
    const imageSource = resolveLocalImageSource(post.image_url ?? undefined);

    const profileSource = { uri: `https://thispersondoesnotexist.com/random-person.jpeg?cb=${post.user.id}` };

    return (
        <View className="bg-white mb-2 border-b border-gray-200 pb-2">
            {/* Header: avatar + username */}
            <View className="flex-row items-center px-3 py-3">
                <Image
                    source={{ uri: post.user?.image_url + '?u=' + (post.user?.id ?? post.id), cache: "reload" }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View className="ml-3 flex-1">
                    <Text className="font-bold text-[15px]">{post.user?.username}</Text>
                    <Text className="text-gray-500 text-xs">Just now · 🌐</Text>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color="#65676b" />
            </View>

            {/* Caption */}
            {!!post.caption && (
                <Text className="px-3 pb-2 text-[15px] leading-5">{post.caption}</Text>
            )}

            {/* Image (optional) */}
            {hasImage && (
                <Image source={imageSource} style={{ width: screenWidth, height: screenWidth * 0.75 }} resizeMode="cover" />
            )}

            {/* Like / comment counts row */}
            {(likeCount > 0 || commentCount > 0) && (
                <View className="flex-row items-center justify-between px-3 pt-2">
                    {likeCount > 0 ? (
                        <View className="flex-row items-center gap-1">
                            <View className="bg-blue-500 rounded-full w-4 h-4 items-center justify-center">
                                <Ionicons name="thumbs-up" size={10} color="white" />
                            </View>
                            <Text className="text-gray-500 text-xs">{likeCount}</Text>
                        </View>
                    ) : (
                        <View />
                    )}
                    {commentCount > 0 && (
                        <Text className="text-gray-500 text-xs">{commentCount} comments</Text>
                    )}
                </View>
            )}

            {/* Divider */}
            <View className="h-px bg-gray-200 mx-3 mt-2" />

            {/* Action row: Like / Comment only, per request */}
            <View className="flex-row px-2 pt-1">
                <Pressable
                    onPress={() => triggerLike(false)}
                    className="flex-1 flex-row items-center justify-center gap-2 py-2"
                >
                    <AnimatedIconToggle
                        active={heartActive}
                        onPress={() => triggerLike(false)}
                        outlineIcon={<Ionicons name="thumbs-up-outline" size={20} color="#65676b" />}
                        filledIcon={<Ionicons name="thumbs-up" size={20} color="#1877f2" />} id={post.id} />
                    <Text
                        className="font-semibold text-[15px]"
                        style={{ color: liked ? "#1877f2" : "#65676b" }}
                    >
                        Like
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onOpenComments}
                    className="flex-1 flex-row items-center justify-center gap-2 py-2"
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#65676b" />
                    <Text className="font-semibold text-[15px] text-gray-600">Comment</Text>
                </Pressable>
            </View>
        </View>
    );
}
