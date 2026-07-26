const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../assets/images');
const VIDEO_DIR = path.join(__dirname, '../assets/videos');
const OUTPUT_FILE = path.join(__dirname, '../src/app/utils/localImages.ts');

function getAssetFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return extensions.includes(ext) && !file.startsWith('.');
  });
}

function generateImageMap() {
  const imageFiles = getAssetFiles(IMAGE_DIR, ['.jpeg', '.jpg', '.png', '.gif']);
  const videoFiles = getAssetFiles(VIDEO_DIR, ['.mp4', '.mov', '.mkv']);

  // Generate imports
  let imports = 'import { ImageSourcePropType } from "react-native";\nimport type { VideoSource } from "expo-video";\n\n';
  
  imageFiles.forEach((file, idx) => {
    imports += `import img${idx + 1} from "~/assets/images/${file}";\n`;
  });

  if (videoFiles.length > 0) {
    imports += '\n';
    videoFiles.forEach(file => {
      const varName = path.basename(file, path.extname(file));
      imports += `import ${varName} from "~/assets/videos/${file}";\n`;
    });
  }

  // Generate image map
  let imageMap = '\nconst localImageMap: Record<string, ImageSourcePropType> = {\n';
  imageFiles.forEach((file, idx) => {
    const key = path.basename(file, path.extname(file));
    imageMap += `  ${key}: img${idx + 1},\n`;
  });
  imageMap += '};\n';

  // Generate video map
  let videoMap = '\nconst localVideoMap: Record<string, number> = {\n';
  videoFiles.forEach(file => {
    const varName = path.basename(file, path.extname(file));
    videoMap += `  ${varName}: ${varName},\n`;
  });
  videoMap += '}\n';

  // Generate exports
  const exports = `
export function resolveLocalImageSource(value?: string): ImageSourcePropType {
  const source = value ? localImageMap[value] : undefined;
  return source ?? { uri: value ?? "" };
}

export function resolveLocalVideoSource(value?: string): VideoSource {
  const source = value ? localVideoMap[value] : undefined;
  return source ?? {uri: value ?? ""};
}
`;

  const content = imports + imageMap + videoMap + exports;
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   - ${imageFiles.length} images`);
  console.log(`   - ${videoFiles.length} videos`);
}

generateImageMap();