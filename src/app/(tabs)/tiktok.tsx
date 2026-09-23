import { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Dimensions, ViewToken, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from "react-native";
import FeedItem from "~/src/app/components/tiktok/FeedItem";
import CommentsSection from "../components/CommentsSection";
import Video from "../model/Video";

import localVideos from "~/assets/data/videos.json";
import { finishSubsceneTracking, initTracking } from "~/assets/tracker/tracker-agent";
import { trackingActive } from "../utils/contants";
import { fetchPixabayVideos } from "../utils/pixabay"; // adjust path to wherever you place pixabay.ts

const { height: screenHeight } = Dimensions.get("window");

const TARGET_VIDEO_COUNT = 50;

type FeedScreenProps = {
    onTasksCompleted: () => void;
}

export default function ForYouFeed({ onTasksCompleted }: FeedScreenProps) {

    const [likedPost, setLikedPost] = useState(false);
    const [commentedPost, setCommentedPost] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // videos now lives in state: starts as local JSON, then gets topped up
    // with Pixabay results once fetched, up to TARGET_VIDEO_COUNT total.
    const [videos, setVideos] = useState<Video[]>(localVideos as unknown as Video[]);
    const [videosReady, setVideosReady] = useState(false);

    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
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

    const [elapsed, setElapsed] = useState(0);

    // Fetch and merge Pixabay videos on mount, topping up to TARGET_VIDEO_COUNT.
    useEffect(() => {
        let alive = true;

        (async () => {
            const needed = TARGET_VIDEO_COUNT - localVideos.length;

            if (needed <= 0) {
                if (alive) setVideosReady(true);
                return;
            }

            try {
                const pixabayVideos = await fetchPixabayVideos(needed);
                if (!alive) return;
                setVideos([...(localVideos as unknown as Video[]), ...pixabayVideos]);
            } catch (err) {
                console.warn("Failed to fetch Pixabay videos, continuing with local set only:", err);
            } finally {
                if (alive) setVideosReady(true);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    // Derive like/comment count maps whenever the merged video list changes.
    useEffect(() => {
        setLikeCounts(Object.fromEntries(videos.map((p) => [p.id, p.likes ? p.likes : 0])));
        setCommentCounts(Object.fromEntries(videos.map((p) => [p.id, p.comments?.length ?? 0])));
    }, [videos]);

    useEffect(() => {
        const start = Date.now();

        const interval = setInterval(() => {
            setElapsed(Date.now() - start);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                if (trackingActive) {
                    await initTracking(1);
                }
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
        if (!likedPost || (Math.floor(elapsed / 1000) <= 60) || !scrolled || !commentedPost) return;

        console.log("Finished tracking for this scene");
        if (trackingActive) {
            finishSubsceneTracking();
        }
        onTasksCompleted();
    }, [likedPost, commentedPost, scrolled, elapsed, onTasksCompleted]);

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
                    username={"ExperimentUser"}
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
