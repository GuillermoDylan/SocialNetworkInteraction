import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from 'react-native';
import { red } from "react-native-reanimated/lib/typescript/Colors";

export default function TabsLayout() {

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "black",
            tabBarShowLabel: false,
        }}>
            <Tabs.Screen name="index" options={{
                headerTitle: (props) =>
                    <Text style={{
                        textDecorationLine: "underline",
                        fontSize: 18,
                        fontWeight: 600
                    }}>For you</Text>, headerTitleAlign: "center",
                headerShadowVisible: false,
                tabBarIcon: ({ color }) =>
                    <FontAwesome name="home" size={26} color={color} />
            }} />

            <Tabs.Screen name="new" options={{
                headerTitle: "Create post", headerTitleAlign: "center",
                tabBarIcon: ({ color }) =>
                    <FontAwesome name="plus-square-o" size={26} color={color} />
            }} />

            <Tabs.Screen name="profile" options={{
                headerTitle: "Profile", headerTitleAlign: "center",
                tabBarIcon: ({ color }) =>
                    <FontAwesome name="user" size={26} color={color} />
            }} />
        </Tabs>
    );
}