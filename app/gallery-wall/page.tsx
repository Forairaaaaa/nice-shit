"use client";

import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

interface GalleryWallConfig {
  backgroudImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

export default function PageGalleryWall() {
  const [config, setConfig] = useState<GalleryWallConfig>({
    backgroudImage: "",
    randomOrder: false,
    picturePropsList: [],
  });

  // Fetch config
  function getGalleryWallConfig() {
    fetch("/gallery-wall/gallery-wall-config.json")
      .then((response) => response.json())
      .then((data) => {
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

          // console.log(result);
          setConfig(result);
        });
      });
  }
  useEffect(() => {
    getGalleryWallConfig();
  }, []);

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
