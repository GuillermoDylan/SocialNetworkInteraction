import { ImageSourcePropType } from "react-native";
import type { VideoSource } from "expo-video";

import img1483 from "~/assets/images/IMG_1483.jpeg";
import img1491 from "~/assets/images/IMG_1491.jpeg";
import img1498 from "~/assets/images/IMG_1498.jpeg";
import img1581 from "~/assets/images/IMG_1581.jpeg";
import img1597 from "~/assets/images/IMG_1597.jpeg";
import img1598 from "~/assets/images/IMG_1598.jpeg";

import cat from "~/assets/videos/cat.mp4";

const localImageMap: Record<string, ImageSourcePropType> = {
  IMG_1483: img1483,
  IMG_1491: img1491,
  IMG_1498: img1498,
  IMG_1581: img1581,
  IMG_1597: img1597,
  IMG_1598: img1598,
};

const localVideoMap: Record<string, number> = {
  cat: cat,
}

export function resolveLocalImageSource(value?: string): ImageSourcePropType {
  const source = value ? localImageMap[value] : undefined;
  return source ?? { uri: value ?? "" };
}

export function resolveLocalVideoSource(value?: string): VideoSource {
  const source = value ? localVideoMap[value] : undefined;
  return source ?? {uri: value ?? ""};
}