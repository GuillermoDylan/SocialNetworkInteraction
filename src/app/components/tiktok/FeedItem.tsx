import { useState } from "react";
import { View, Text, Image, Dimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import AnimatedIconToggle from "~/src/app/components/buttons/AnimatedIconToggle";
import FeedVideo from "./FeedVideo";
import Video from "~/src/app/model/Video";
import { resolveLocalImageSource } from "~/src/app/utils/localImages";
import DoubleTapHeart from "../buttons/DoubleTapHeart";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type FeedItemProps = {
    video: Video;
    liked: boolean;
    likeCount: number;
    onToggleLike: () => void;
    onOpenComments: () => void;
    commentCount: number;
    isActive: boolean;
};

export default function FeedItem({
    video,
    liked,
    likeCount,
    onToggleLike,
    onOpenComments,
    commentCount,
    isActive,
}: FeedItemProps) {

    const heartActive = useSharedValue(liked ? 1 : 0);
    const doubleTapProgress = useSharedValue(0);
    const [tapPos, setTapPos] = useState({ x: screenWidth / 2, y: screenHeight / 2 });
    const [isPaused, setIsPaused] = useState(false);

    const [showHeart, setShowHeart] = useState(false);
    const heartProgress = useSharedValue(0);
    const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
    const [lastTap, setLastTap] = useState<number | null>(null);


    const triggerLike = (fromDoubleTap = false) => {
        if (!liked) {
            heartActive.value = withSpring(1);
            onToggleLike();
        } else if (!fromDoubleTap) {
            heartActive.value = withSpring(0);
            onToggleLike();
        }
    };

    const handleDoubleTapLike = (x: number, y: number) => {
        setTapPos({ x, y });
        doubleTapProgress.value = 0;
        doubleTapProgress.value = withTiming(1, { duration: 600 });
        triggerLike(true);
    };

    const handleImagePress = (event: any) => {
        const now = Date.now();
        const { x, y, offsetX, offsetY } = event.nativeEvent;

        if (lastTap && now - lastTap < 300) {
            liked = true;
            console.log(event.nativeEvent)
            triggerDoubleTapHeart(offsetX, offsetY);
            setLastTap(null);
        } else {
            setLastTap(now);
        }
    };

    const triggerDoubleTapHeart = (x: number, y: number) => {
        setHeartPosition({ x, y });
        setShowHeart(true);
        heartProgress.value = 0;
        heartProgress.value = withSequence(
            withTiming(1, { duration: 600 }),
        );
        onToggleLike();
    };

    return (
        <View style={{ width: screenWidth, height: screenHeight }} className="bg-black">
            <Pressable onPress={handleImagePress}>
                <FeedVideo
                    videoUrl={video.video_url}
                    isActive={isActive}
                    isPaused={isPaused}
                    onTogglePause={() => setIsPaused((p) => !p)}
                    onDoubleTapLike={handleDoubleTapLike}
                    doubleTapProgress={doubleTapProgress}
                    tapPos={tapPos}
                    width={screenWidth}
                    height={screenHeight}
                />
                {showHeart && (
                    <DoubleTapHeart
                        progress={heartProgress}
                        x={heartPosition.x}
                        y={heartPosition.y}
                    />
                )}
            </Pressable>

            {/* Bottom-left: user info + caption */}
            <View className="absolute bottom-24 left-3 right-20">
                <View className="flex-row items-center gap-2 mb-2">
                    <Image
                        source={resolveLocalImageSource(video.user?.image_url)}
                        style={{ width: 36, height: 36, borderRadius: 18 }}
                    />
                    <Text className="text-white font-bold">@{video.user?.username}</Text>
                </View>
                <Text className="text-white">{video.caption}</Text>
            </View>

            {/* Right-side action rail */}
            <View className="absolute bottom-24 right-3 items-center gap-5">
                <View className="items-center">
                    <AnimatedIconToggle
                        active={heartActive}
                        onPress={() => triggerLike(false)}
                        outlineIcon={<Ionicons name="heart-outline" size={34} color="white" />}
                        filledIcon={<Ionicons name="heart" size={34} color="#ff2d55" />} id={video.id} />
                    <Text className="text-white text-xs mt-1">{likeCount}</Text>
                </View>

                <Pressable className="items-center" onPress={onOpenComments}>
                    <Ionicons name="chatbubble-ellipses-outline" size={32} color="white" />
                    <Text className="text-white text-xs mt-1">{commentCount}</Text>
                </Pressable>

                <Pressable className="items-center">
                    <Ionicons name="arrow-redo-outline" size={32} color="white" />
                    <Text className="text-white text-xs mt-1">Share</Text>
                </Pressable>
            </View>
        </View>
    );
}