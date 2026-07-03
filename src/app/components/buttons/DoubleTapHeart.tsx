import { Ionicons } from "@expo/vector-icons";
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

type DoubleTapHeartProps = {
    progress: SharedValue<number>;
    x: number;
    y: number;
};

export default function DoubleTapHeart({ progress, x, y }: DoubleTapHeartProps) {
    const style = useAnimatedStyle(() => {
        return {
            position: "absolute",
            left: x - 40,
            top: y - 40,
            transform: [
                {
                    scale: interpolate(
                        progress.value,
                        [0, 0.3, 1],
                        [0, 1.2, 1],
                        Extrapolate.CLAMP
                    ),
                },
            ],
            opacity: interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0], Extrapolate.CLAMP),
        };
    });

    return (
        <Animated.View style={style} pointerEvents="none">
            <Ionicons name="heart" size={20} color="white" />
        </Animated.View>
    );
}