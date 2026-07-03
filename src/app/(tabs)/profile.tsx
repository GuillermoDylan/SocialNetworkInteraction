import { StyleSheet, Text, View } from "react-native";


const fakeProfile = {
  "posts": [
    {
      "id": 1,
      "image": "1.jpg",
      "description": "description text"
    }
  ]
}

export default function Page() {

  return (
    <View className="flex">
      <View className="bg-white flex">
        <Text>Profile top</Text>
      </View>
      <View className="bg-slate-600 flex">
        <Text>Profile bottom</Text>
        {
          fakeProfile.posts.map((element) => {
            return <>
              <Text>{element.description}</Text>
              <Text>{element.image}</Text>
            </>
          })
        }
      </View>
    </View>
  );
}
