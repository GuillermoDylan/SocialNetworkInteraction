import { FlatList, ScrollView, View } from "react-native";
import posts from "~/assets/data/posts.json"
import PostListItem from "../components/PostListItem";
import StoryListItem from "../components/StoryListItem";

const users = [posts[0].user, posts[1].user]

export default function FeedScreen() {
    return (
        <ScrollView className="bg-white">
            <FlatList
                data={users}
                renderItem={({ item }) => <StoryListItem user={item} />}
                contentContainerStyle={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%"
                }}
                />
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostListItem post={item} />}
                contentContainerStyle={{
                    gap: 10,
                    maxWidth: 512,
                    alignSelf: 'center',
                    width: '100%',
                }}
                showsVerticalScrollIndicator={false}
            />
        </ScrollView>
    );
}