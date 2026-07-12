import { Pressable, ScrollView, View, Text, TextInput, KeyboardAvoidingView, Platform, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useState } from "react";
import Comment from "~/src/app/model/Comment";
import Post from "../model/post";
import Video from "../model/Video";
import FacebookPost from "../model/FacebookPost";

type CommentsSectionProps = {
    showComments: boolean;
    setShowComments: Dispatch<SetStateAction<boolean>>;
    selectedPost: Post | Video | FacebookPost;
    username: string;
    onComment?: Function | null;
    setCommentedPost?: (value: boolean) => void | null;
}

export default function CommentsSection({ showComments, setShowComments, selectedPost, username, onComment, setCommentedPost }: CommentsSectionProps) {

    const screenHeight = Dimensions.get("window").height;

    const [comments, setComments] = useState<Comment[]>(selectedPost.comments ?? []);
    const [commentText, setCommentText] = useState("");

    const submitComment = () => {
        const trimmed = commentText.trim();
        if (!trimmed) return;

        const newComment = new Comment({
            id: String(Date.now()),
            username: username,
            text: trimmed,
            likes: 0,
        });

        setComments((prev) => [...prev, newComment]);
        setCommentText("");

        if (onComment) {
            onComment();
        }

        // NOTE: this only updates local state. If comments need to persist
        // back to the post in the parent's list, lift this up via a prop
        // like `onAddComment(postId, newComment)`, similar to `toggleLike`.
        if (setCommentedPost) {
            setCommentedPost(true);
        }
    };

    return (
        <Modal
            visible={showComments}
            transparent
            animationType="slide"
            onRequestClose={() => setShowComments(false)}
        >
            {/* Backdrop */}
            <Pressable
                className="flex-1 bg-black/40"
                onPress={() => setShowComments(false)}
            >
                {/* Sheet - stop propagation so taps inside don't close it */}
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    style={{ height: screenHeight * 0.6, marginTop: "auto" }}
                    className="bg-white rounded-t-2xl overflow-hidden"
                >
                    {/* Drag handle */}
                    <View className="items-center pt-2 pb-1">
                        <View className="w-10 h-1 rounded-full bg-gray-300" />
                    </View>

                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                        <Text className="font-bold text-base">Comments</Text>
                        <Pressable onPress={() => setShowComments(false)}>
                            <Ionicons name="close" size={22} color="black" />
                        </Pressable>
                    </View>

                    {/* Comments list */}
                    <ScrollView className="flex-1 px-4 pt-3">
                        {comments.length === 0 && (
                            <Text className="text-gray-400 mb-3">No comments yet.</Text>
                        )}

                        {comments.map((comment) => (
                            <View key={comment.id} className="mb-3">
                                <Text>
                                    <Text className="font-bold">{comment.username} </Text>
                                    {comment.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        className="flex-row items-center gap-2 px-4 py-3 border-t border-gray-200 bottom-5"
                    >
                        <TextInput
                            value={commentText}
                            onChangeText={setCommentText}
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-300 rounded-full px-3 py-2"
                            onSubmitEditing={submitComment}
                            returnKeyType="send"
                            style={{ fontSize: 16 }}
                        />
                        <Pressable onPress={submitComment}>
                            <Text className="font-bold text-blue-500">Post</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}