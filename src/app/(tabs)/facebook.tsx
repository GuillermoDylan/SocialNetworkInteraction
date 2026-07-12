

// NOTE: same pattern as ForYouFeed/Profile — kept only for the current
// logged-in user's identity, used as the `username` passed into
// CommentsSection when posting a new comment. Each post carries its own

import { useEffect, useState } from "react";

import facebookPosts from "~/assets/data/facebook.json";
import FacebookPost from "../model/FacebookPost";
import { FlatList, View } from "react-native";
import FacebookPostCard from "../components/facebook/FacebookPostCard";
import CommentsSection from "../components/CommentsSection";
import { finishExperiment, finishSubsceneTracking, finishTracking, initTracking } from "~/assets/tracker/tracker-agent";

const fakeProfile = {
    username: "GDylan",
};

type FacebookFeedProps = {
    onTasksCompleted: () => void;
};

export default function FacebookFeed({ onTasksCompleted }: FacebookFeedProps) {
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
        Object.fromEntries(facebookPosts.map((p) => [p.id, p.likes]))
    );
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
        Object.fromEntries(facebookPosts.map((p) => [p.id, p.comments?.length ?? 0]))
    );
    const [activePost, setActivePost] = useState<FacebookPost | null>(null);
    const [showComments, setShowComments] = useState(false);


    const [likedPost, setLikedPost] = useState(false);
    const [commentedPost, setCommentedPost] = useState(false);
    const [scrolled, setScrolled] = useState(false); // TODO

    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                await initTracking(2);
            } catch (error) {
                // handle or ignore
            } finally {
                if (alive) setReady(true);
            }
        })();

        return () => {
            alive = false;
        };
    }, [])

    useEffect(() => {
        if (!likedPost || !commentedPost) return;

        console.log("Finished tracking for this scene");
        finishTracking(null);
        finishExperiment();
        onTasksCompleted();
    }, [likedPost, commentedPost, onTasksCompleted]);


    const toggleLike = (id: string) => {
        setLikedPosts((prev) => {
            const nowLiked = !prev[id];
            setLikeCounts((counts) => ({
                ...counts,
                [id]: counts[id] + (nowLiked ? 1 : -1),
            }));
            return { ...prev, [id]: nowLiked };
        });
        setLikedPost(true);
    };

    const openComments = (post: FacebookPost) => {
        setActivePost(post);
        setShowComments(true);
    };

    return (
        <View className="flex-1 bg-gray-100">
            <FlatList
                data={facebookPosts}
                keyExtractor={(post) => post.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4 }}
                renderItem={({ item }) => (
                    <FacebookPostCard
                        post={item}
                        liked={!!likedPosts[item.id]}
                        likeCount={likeCounts[item.id]}
                        commentCount={commentCounts[item.id]}
                        onToggleLike={() => toggleLike(item.id)}
                        onOpenComments={() => openComments(item)}
                    />
                )}
            />

            {activePost && (
                <CommentsSection
                    showComments={showComments}
                    setShowComments={setShowComments}
                    selectedPost={activePost}
                    username={fakeProfile.username}
                    onComment={() => {
                        setCommentCounts((prev) => ({
                            ...prev,
                            [activePost.id]: (prev[activePost.id] ?? 0) + 1,
                        }));
                    }}
                    setCommentedPost={setCommentedPost}
                />
            )}
        </View>
    );
}
