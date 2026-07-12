import { useState } from "react";
import Avatar from "react-avatar";
import { Pressable, ScrollView, View, Text, Image, Dimensions } from "react-native";
import AnimatedIconToggle from "./buttons/AnimatedIconToggle";
import { Feather, Ionicons } from "@expo/vector-icons";
import Post from "../model/post";
import Comment from "../model/Comment"
import PostUser from "../model/PostUser";
import { useSharedValue, withSpring } from "react-native-reanimated";
import CommentsSection from "./CommentsSection";

import img1483 from "~/assets/images/IMG_1483.jpeg";
import img1491 from "~/assets/images/IMG_1491.jpeg";
import img1498 from "~/assets/images/IMG_1498.jpeg";
import img1581 from "~/assets/images/IMG_1581.jpeg";
import img1597 from "~/assets/images/IMG_1597.jpeg";

const imageMap = {
  "1": img1483,
  "2": img1491,
  "3": img1498,
  "4": img1581,
  "5": img1597,
};

type PostItemProps = {
    profile: PostUser;
    selectedPost: Post;
    toggleLike: (id: number) => void;
    likedPosts: Record<number, boolean>;
    setSelectedPost: Function;
}

export default function PostItem({ setSelectedPost, likedPosts, toggleLike, selectedPost, profile }: PostItemProps) {

    const liked = useSharedValue(0);
    const screenWidth = Dimensions.get("window").width;

    const isLiked = !!likedPosts[parseInt(selectedPost.id)];
    const baseLikes = selectedPost.likes ? selectedPost.likes : 0;
    const totalLikes = baseLikes + (isLiked ? 1 : 0);

    const [showComments, setShowComments] = useState(false);


    const toggleLikeButton = () => {
        toggleLike(parseInt(selectedPost.id));
        liked.value = withSpring(liked.value ? 0 : 1);
    };



    return (
        <ScrollView className="flex-1 bg-white">
            {/* Modal header */}
            <View className="flex-row items-center gap-3 p-3 border-b border-gray-300">
                <Pressable onPress={() => setSelectedPost(null)}>
                    <Text className="text-3xl font-bold">‹</Text>
                </Pressable>
                <Avatar
                    alt={String(profile.username)}
                    src={profile.image_url}
                    size="32"
                    round
                />
                <Text className="font-bold">{profile.username}</Text>
            </View>

            {/* Full image */}
            <Image source={imageMap[selectedPost.id]}
                style={{ width: screenWidth, height: screenWidth }}
                resizeMode="cover"
            />

            {/* Actions */}
            <View className="flex-row items-center gap-4 px-3 pt-3">
                <View className="flex-row items-center">
                    <AnimatedIconToggle
                        active={liked}
                        onPress={toggleLikeButton}
                        outlineIcon={<Ionicons name="heart-outline" size={30} color="black" />}
                        filledIcon={<Ionicons name="heart" size={30} color="red" />}
                    />
                    <Text className="font-bold">
                        {totalLikes}
                    </Text>
                </View>
                <Pressable onPress={() => setShowComments(true)}>
                    <Ionicons name="chatbubble-outline" size={30} />
                </Pressable>
                <Feather name="send" size={30} />
            </View>

            {/* Caption */}
            <View className="px-3 mt-1 mb-6">
                <Text>
                    <Text className="font-bold">{profile.username} </Text>
                    {selectedPost.caption}
                </Text>
            </View>

            <CommentsSection selectedPost={selectedPost} setShowComments={setShowComments} showComments={showComments}
                username={profile.username} />

        </ScrollView>
    );
}