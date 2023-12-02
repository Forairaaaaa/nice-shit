import { promises as fs } from "fs";
import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";
import styles from "./styles.module.css";

interface GalleryWallConfig {
  backgroudImage: string;
  randomOrder: boolean;
  pictureList: FramedPictureProps[];
}

async function getGalleryWallConfigFromFs() {
  const file = await fs.readFile(
    process.cwd() + "/public/gallery-wall/gallery-wall-props.json",
    "utf-8"
  );
  const data = JSON.parse(file);

  let result: GalleryWallConfig = {
    backgroudImage: "",
    randomOrder: false,
    pictureList: [],
  };

  // Background image
  if (data.backgroudImage != "") {
    result.backgroudImage = data.backgroudImage;
  }

  // Random order
  if (data.randomOrder) {
    result.randomOrder = data.randomOrder;
  }

  // Picture list
  (data.pictureList as FramedPictureProps[]).forEach((props) => {
    result.pictureList.push({
      imageSrc: props.imageSrc,
      nameTag: props.nameTag,
      timeTag: props.timeTag,
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
    config.pictureList = shuffle(config.pictureList);
  }

  return (
    <div
      className={
        styles.background + " bg-[url('" + config.backgroudImage + "')]"
      }
    >
      <div className={styles.backgroundNoiseFilter}>
        <GalleryWall picturePropsList={config.pictureList}></GalleryWall>
      </div>
    </div>
  );
}
