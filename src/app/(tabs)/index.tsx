import { ActivityIndicator, FlatList, View } from "react-native";
import posts from "~/assets/data/posts.json"
import PostListItem from "../components/PostListItem";
import { useEffect, useState } from "react";
import { initTracking, startExperiment, finishSubsceneTracking } from "~/assets/tracker/tracker-agent";
import { registerID } from "~/assets/tracker/tracker-agent";

import { v4 as uuidva4 } from "uuid";
import { trackingActive } from "../utils/contants";

type FeedScreenProps = {
    onTasksCompleted: () => void;
}

export default function FeedScreen({ onTasksCompleted }: FeedScreenProps) {

    const [likedPost, setLikedPost] = useState(false);
    const [commentedPost, setCommentedPost] = useState(false);
    const [scrolled, setScrolled] = useState(false); // TODO

    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const start = Date.now();

        const interval = setInterval(() => {
            setElapsed(Date.now() - start);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const [ready, setReady] = useState(false);

    useEffect(() => {

        let alive = true;

        (async () => {
            try {
                if (trackingActive) {
                    await startExperiment();
                    await initTracking(0);
                }
                // await registerID(uuidva4());
            } catch (error) {
                // handle or ignore
                console.error("Tracking init failed on index tab:", error);
            } finally {
                if (alive) setReady(true);
            }
        })();

        return () => {
            alive = false;
        };
    }, [])

    useEffect(() => {
        console.log(elapsed);
        if (Math.floor(elapsed / 1000) <= (3 * 60)) return;

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
        <FlatList
            onScroll={(event) => {
                const scrollY = event.nativeEvent.contentOffset.y;

                if (!scrolled && scrollY > 300) {
                    setScrolled(true);
                }
            }}
            className="bg-white"
            data={posts}
            renderItem={({ item }) => <PostListItem post={item} setLikedPost={setLikedPost} setCommentedPost={setCommentedPost} />}
            contentContainerStyle={{
                gap: 10,
                maxWidth: 512,
                alignSelf: 'center',
                width: '100%',
            }}
            showsVerticalScrollIndicator={false}
        />
    );
}