import { ImageSourcePropType } from "react-native";
import type { VideoSource } from "expo-video";

import img1 from "~/assets/images/IMG_1.jpeg";
import img2 from "~/assets/images/IMG_10.jpeg";
import img3 from "~/assets/images/IMG_11.jpeg";
import img4 from "~/assets/images/IMG_12.jpeg";
import img5 from "~/assets/images/IMG_13.jpeg";
import img6 from "~/assets/images/IMG_14.jpeg";
import img7 from "~/assets/images/IMG_15.jpeg";
import img8 from "~/assets/images/IMG_16.jpeg";
import img9 from "~/assets/images/IMG_17.jpeg";
import img10 from "~/assets/images/IMG_18.jpeg";
import img11 from "~/assets/images/IMG_19.jpeg";
import img12 from "~/assets/images/IMG_2.jpeg";
import img13 from "~/assets/images/IMG_20.jpeg";
import img14 from "~/assets/images/IMG_21.jpeg";
import img15 from "~/assets/images/IMG_22.jpeg";
import img16 from "~/assets/images/IMG_23.jpeg";
import img17 from "~/assets/images/IMG_24.jpeg";
import img18 from "~/assets/images/IMG_25.jpeg";
import img19 from "~/assets/images/IMG_26.jpeg";
import img20 from "~/assets/images/IMG_27.jpeg";
import img21 from "~/assets/images/IMG_28.jpeg";
import img22 from "~/assets/images/IMG_29.jpeg";
import img23 from "~/assets/images/IMG_3.jpeg";
import img24 from "~/assets/images/IMG_30.jpeg";
import img25 from "~/assets/images/IMG_31.jpeg";
import img26 from "~/assets/images/IMG_32.jpeg";
import img27 from "~/assets/images/IMG_33.jpeg";
import img28 from "~/assets/images/IMG_34.jpeg";
import img29 from "~/assets/images/IMG_35.jpeg";
import img30 from "~/assets/images/IMG_36.jpeg";
import img31 from "~/assets/images/IMG_37.jpeg";
import img32 from "~/assets/images/IMG_38.jpeg";
import img33 from "~/assets/images/IMG_39.jpeg";
import img34 from "~/assets/images/IMG_4.jpeg";
import img35 from "~/assets/images/IMG_40.jpeg";
import img36 from "~/assets/images/IMG_41.jpeg";
import img37 from "~/assets/images/IMG_42.jpeg";
import img38 from "~/assets/images/IMG_43.jpeg";
import img39 from "~/assets/images/IMG_44.jpeg";
import img40 from "~/assets/images/IMG_45.jpeg";
import img41 from "~/assets/images/IMG_46.jpeg";
import img42 from "~/assets/images/IMG_47.jpeg";
import img43 from "~/assets/images/IMG_48.jpeg";
import img44 from "~/assets/images/IMG_5.jpeg";
import img45 from "~/assets/images/IMG_6.jpeg";
import img46 from "~/assets/images/IMG_7.jpeg";
import img47 from "~/assets/images/IMG_8.jpeg";
import img48 from "~/assets/images/IMG_9.jpeg";

import cat from "~/assets/videos/cat.mp4";

const localImageMap: Record<string, ImageSourcePropType> = {
  IMG_1: img1,
  IMG_10: img2,
  IMG_11: img3,
  IMG_12: img4,
  IMG_13: img5,
  IMG_14: img6,
  IMG_15: img7,
  IMG_16: img8,
  IMG_17: img9,
  IMG_18: img10,
  IMG_19: img11,
  IMG_2: img12,
  IMG_20: img13,
  IMG_21: img14,
  IMG_22: img15,
  IMG_23: img16,
  IMG_24: img17,
  IMG_25: img18,
  IMG_26: img19,
  IMG_27: img20,
  IMG_28: img21,
  IMG_29: img22,
  IMG_3: img23,
  IMG_30: img24,
  IMG_31: img25,
  IMG_32: img26,
  IMG_33: img27,
  IMG_34: img28,
  IMG_35: img29,
  IMG_36: img30,
  IMG_37: img31,
  IMG_38: img32,
  IMG_39: img33,
  IMG_4: img34,
  IMG_40: img35,
  IMG_41: img36,
  IMG_42: img37,
  IMG_43: img38,
  IMG_44: img39,
  IMG_45: img40,
  IMG_46: img41,
  IMG_47: img42,
  IMG_48: img43,
  IMG_5: img44,
  IMG_6: img45,
  IMG_7: img46,
  IMG_8: img47,
  IMG_9: img48,
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
  return source ?? { uri: value ?? "" };
}