import { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, ViewToken, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from "react-native";
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
    const [scrolled, setScrolled] = useState(false);

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

    // Drives activeIndex (used for video playback), which needs to react
    // quickly/smoothly to whatever is currently on screen. Kept separate
    // from "has the user actually navigated away from page 0" logic below,
    // since that needs a settled, unambiguous signal instead.
    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            const firstVisible = viewableItems.find((v) => v.isViewable);
            if (firstVisible?.index != null) {
                setActiveIndex(firstVisible.index);
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 60,
        minimumViewTime: 100,
    }).current;

    // Scroll-offset-based detection: only counts as "scrolled" once the
    // FlatList has settled (momentum finished) on a page other than the
    // first. This avoids relying on the viewability threshold, which can
    // report transient/ambiguous states mid-swipe.
    const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const page = Math.round(e.nativeEvent.contentOffset.y / screenHeight);
            if (page >= 1) {
                setScrolled(true);
            }
        },
        []
    );

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
        if (activeIndex >= 2) {
            setScrolled(true);
        }
    }, [activeIndex]);

    useEffect(() => {
        if (!likedPost || !commentedPost || !scrolled) return;

        console.log("Finished tracking for this scene");
        finishSubsceneTracking();
        onTasksCompleted();
    }, [likedPost, commentedPost, scrolled, onTasksCompleted]);

    if (!ready) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
                onMomentumScrollEnd={onMomentumScrollEnd}
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
                    key={activePost.id}
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
