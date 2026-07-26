import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    SharedValue,
} from "react-native-reanimated";

type AnimatedIconToggleProps = {
    active: SharedValue<number>;
    onPress: () => void;
    outlineIcon: React.ReactNode;
    filledIcon: React.ReactNode;
    className?: string;
    id: string;
};

export default function AnimatedIconToggle({
    active,
    onPress,
    outlineIcon,
    filledIcon,
    className,
    id
}: AnimatedIconToggleProps) {
    const outlineStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(active.value, [0, 1], [1, 0], Extrapolate.CLAMP),
                },
            ],
        };
    });

    const fillStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: active.value }],
            opacity: active.value,
        };
    });

    return (
        <Pressable onPress={onPress} className={className} nativeID={"like-" + id}>
            <Animated.View style={[StyleSheet.absoluteFill, outlineStyle]}>
                {outlineIcon}
            </Animated.View>
            <Animated.View style={fillStyle}>{filledIcon}</Animated.View>
        </Pressable>
    );
}