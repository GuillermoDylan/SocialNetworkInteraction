import { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, ViewToken } from "react-native";
import FeedItem from "~/src/app/components/tiktok/FeedItem";
import CommentsSection from "../components/CommentsSection";
import Video from "../model/Video";

import videos from "~/assets/data/videos.json";
import { finishSubsceneTracking, initTracking } from "~/assets/tracker/tracker-agent";

const fakeProfile = {
    id: "1",
    image_url: "https://dylan.carvajal.es/wp-content/uploads/2023/07/IMG_4237-1024x967.jpg",
    username: "GDylan",
    description: "University of Oviedo, Asturias - Spain",
    avatar_url: "https://dylan.carvajal.es/wp-content/uploads/2023/07/IMG_4237-1024x967.jpg",
    followers: 1284,
    following: 312,
};

const { height: screenHeight } = Dimensions.get("window");

type FeedScreenProps = {
    onTasksCompleted: () => void;
}

export default function ForYouFeed({ onTasksCompleted }: FeedScreenProps) {

    const [likedPost, setLikedPost] = useState(false);
    const [commentedPost, setCommentedPost] = useState(false);
    const [scrolled, setScrolled] = useState(false); // TODO

    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
        Object.fromEntries(videos.map((p) => [p.id, p.likes]))
    );
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
        Object.fromEntries(videos.map((p) => [p.id, p.comments?.length ?? 0]))
    );
    const [activePost, setActivePost] = useState<Video | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

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

    const openComments = (post: Video) => {
        setActivePost(post);
        setShowComments(true);
    };

    // Ref so the identity never changes across renders — FlatList requires
    // this to be stable or it throws/ignores updates. This is the reliable
    // way to know which single item is actually on-screen, unlike scroll-end
    // math which can miss short flicks or fire late.
    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            const firstVisible = viewableItems.find((v) => v.isViewable);
            if (firstVisible?.index != null) {
                setActiveIndex(firstVisible.index);
                if (firstVisible.index >= 1) {
                    setScrolled(true);
                }
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 60,
        minimumViewTime: 100,
    }).current;

    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                await initTracking(1);
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
        if (!likedPost || !commentedPost || !scrolled) return;

        console.log("Finished tracking for this scene");
        finishSubsceneTracking();
        onTasksCompleted();
    }, [likedPost, commentedPost, onTasksCompleted]);


    return (
        <View className="flex-1 bg-black">
            <FlatList
                data={videos}
                keyExtractor={(post) => post.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={screenHeight}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(_, index) => ({
                    length: screenHeight,
                    offset: screenHeight * index,
                    index,
                })}
                renderItem={({ item, index }) => (
                    <FeedItem
                        video={item}
                        liked={!!likedPosts[item.id]}
                        likeCount={likeCounts[item.id]}
                        commentCount={commentCounts[item.id]}
                        onToggleLike={() => toggleLike(item.id)}
                        onOpenComments={() => openComments(item)}
                        isActive={index === activeIndex}
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