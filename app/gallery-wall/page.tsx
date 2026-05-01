"use client";

import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

interface GalleryWallConfig {
  backgroundImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

interface GalleryWallConfigResponse {
  backgroundImage?: string;
  randomOrder?: boolean;
  pictureList?: Array<{
    imageSrc?: string;
    nameTag?: string;
    timeTag?: string;
    href?: string;
    rotate?: number;
  }>;
}

const EMPTY_CONFIG: GalleryWallConfig = {
  backgroundImage: "",
  randomOrder: false,
  picturePropsList: [],
};

function shufflePictureList(list: FramedPictureProps[]) {
  const shuffledList = [...list];

  for (let index = shuffledList.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledList[index], shuffledList[swapIndex]] = [
      shuffledList[swapIndex],
      shuffledList[index],
    ];
  }

  return shuffledList;
}

function normalizeGalleryWallConfig(
  data: GalleryWallConfigResponse
): GalleryWallConfig {
  const picturePropsList = (data.pictureList ?? [])
    .filter((picture) => picture.imageSrc)
    .map((picture) => ({
      imageSrc: picture.imageSrc as string,
      nameTag: picture.nameTag ?? "",
      timeTag: picture.timeTag ?? "",
      href: picture.href ?? "",
      rotate: picture.rotate,
    }));

  return {
    backgroundImage: data.backgroundImage ?? "",
    randomOrder: Boolean(data.randomOrder),
    picturePropsList: data.randomOrder
      ? shufflePictureList(picturePropsList)
      : picturePropsList,
  };
}

export default function PageGalleryWall() {
  const [config, setConfig] = useState<GalleryWallConfig>(EMPTY_CONFIG);

  useEffect(() => {
    let isMounted = true;

    async function getGalleryWallConfig() {
      try {
        const response = await fetch("/gallery-wall/gallery-wall-config.json");
        const data = (await response.json()) as GalleryWallConfigResponse;

        if (isMounted) {
          setConfig(normalizeGalleryWallConfig(data));
        }
      } catch (error) {
        console.error("Failed to load gallery wall config", error);

        if (isMounted) {
          setConfig(EMPTY_CONFIG);
        }
      }
    }

    getGalleryWallConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={styles.background}
      style={
        config.backgroundImage
          ? { backgroundImage: `url(${config.backgroundImage})` }
          : undefined
      }
    >
      <div className={styles.backgroundNoiseFilter}>
        <GalleryWall picturePropsList={config.picturePropsList}></GalleryWall>
      </div>
    </div>
  );
}
