import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import StudyFlow from "~/src/app/controllers/StudyFlow";

export default function RootLayout() {
    return <StudyFlow />;
}