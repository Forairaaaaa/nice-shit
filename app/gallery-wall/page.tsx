import { promises as fs } from "fs";
import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";
import styles from "./styles.module.css";

interface GalleryWallConfig {
  backgroudImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

async function getGalleryWallConfigFromFs() {
  const file = await fs.readFile(
    process.cwd() + "/public/gallery-wall/gallery-wall-config.json",
    "utf-8"
  );
  const data = JSON.parse(file);

  let result: GalleryWallConfig = {
    backgroudImage: "",
    randomOrder: false,
    picturePropsList: [],
  };

  // Background image
  if (data.backgroudImage != "" && data.backgroudImage) {
    result.backgroudImage = data.backgroudImage;
  }

  // Random order
  if (data.randomOrder) {
    result.randomOrder = data.randomOrder;
  }

  // Picture props list
  (data.pictureList as FramedPictureProps[]).forEach((props) => {
    result.picturePropsList.push({
      imageSrc: props.imageSrc,
      nameTag: props.nameTag,
      timeTag: props.timeTag,
      herf: props.herf,
    });
  });

  // console.log(result);
  return result;
}

export default async function PageGalleryWall() {
  const config = await getGalleryWallConfigFromFs();

  // Shuffle for random order
  const shuffle = (array: FramedPictureProps[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  if (config.randomOrder) {
    config.picturePropsList = shuffle(config.picturePropsList);
  }

  return (
    <div
      className={
        styles.background + " bg-[url('" + config.backgroudImage + "')]"
      }
    >
      <div className={styles.backgroundNoiseFilter}>
        <GalleryWall picturePropsList={config.picturePropsList}></GalleryWall>
      </div>
    </div>
  );
}
