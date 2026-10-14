import { useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import { VideoPlayer, VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import DoubleTapHeart from "~/src/app/components/buttons/DoubleTapHeart";
import { resolveLocalVideoSource } from "~/src/app/utils/localImages";
import { SharedValue } from "react-native-reanimated";

type FeedVideoProps = {
    videoUrl: string;
    isActive: boolean;
    isPaused: boolean;
    onTogglePause: () => void;
    onDoubleTapLike: (x: number, y: number) => void;
    doubleTapProgress: SharedValue<number>;
    tapPos: { x: number; y: number };
    width: number;
    height: number;
};

export default function FeedVideo({
    videoUrl,
    isActive,
    isPaused,
    onTogglePause,
    onDoubleTapLike,
    doubleTapProgress,
    tapPos,
    width,
    height,
}: FeedVideoProps) {
    const lastTapRef = useRef<number>(0);
    const source = videoUrl.startsWith("http")
        ? videoUrl
        : resolveLocalVideoSource(videoUrl);

    const player = useVideoPlayer(source, (videoPlayer) => {
        videoPlayer.loop = true;
    });

    // Single, unambiguous rule: this player only ever plays when it is BOTH
    // the active item AND not manually paused. Any other state -> hard stop.
    // Runs on every relevant change, so switching `isActive` off always wins,
    // regardless of prior isPaused state or effect ordering elsewhere.
    useEffect(() => {
        if (!isActive) {
            player.pause();
            player.muted = true;
            // Reset playback position so re-entering this item later doesn't
            // resume mid-clip with leftover audio state.
            player.currentTime = 0;
            return;
        }

        player.muted = false;

        if (isPaused) {
            player.pause();
        } else {
            player.play();
        }
    }, [isActive, isPaused, player]);

    const handlePress = (evt: any) => {
        const now = Date.now();
        const { locationX, locationY } = evt.nativeEvent;
        const isDoubleTap = now - lastTapRef.current < 300;
        lastTapRef.current = now;

        if (isDoubleTap) {
            onDoubleTapLike(locationX, locationY);
            return;
        }

        onTogglePause();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={{ width, height, backgroundColor: "black" }}
        >
            <VideoView
                player={player}
                style={{ width, height, backgroundColor: "black" }}
                contentFit="contain"
                nativeControls={false}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                playsInline={true}

            />
            {isPaused && isActive && (
                <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
                    <View className="rounded-full bg-black/35 p-3">
                        <Ionicons name="stop-circle" size={72} color="white" />
                    </View>
                </View>
            )}
            <DoubleTapHeart progress={doubleTapProgress} x={tapPos.x} y={tapPos.y} />
        </Pressable>
    );
}