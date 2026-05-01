"use client";

import { useEffect, useState } from "react";
import GalleryWall from "./components/gallery-wall";
import type { FramedPictureProps } from "./components/framed-picture";
import SettingsDrawer from "./components/settings-drawer";
import styles from "./styles.module.css";

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

function reversePictureList(list: FramedPictureProps[]) {
  return [...list].reverse();
}

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
  const [displayedPictures, setDisplayedPictures] = useState<FramedPictureProps[]>(
    []
  );
  const [isRandomOrderEnabled, setIsRandomOrderEnabled] = useState(false);
  const [isReverseOrderEnabled, setIsReverseOrderEnabled] = useState(false);
  const [isNameVisible, setIsNameVisible] = useState(true);
  const [isTimeVisible, setIsTimeVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getGalleryWallConfig() {
      try {
        const response = await fetch("/gallery-wall/gallery-wall-config.json");
        const data = (await response.json()) as GalleryWallConfigResponse;
        const normalizedConfig = normalizeGalleryWallConfig(data);

        if (isMounted) {
          setConfig(normalizedConfig);
          setIsRandomOrderEnabled(normalizedConfig.randomOrder);
          setIsReverseOrderEnabled(false);
          setDisplayedPictures(normalizedConfig.picturePropsList);
        }
      } catch (error) {
        console.error("Failed to load gallery wall config", error);

        if (isMounted) {
          setConfig(EMPTY_CONFIG);
          setIsRandomOrderEnabled(false);
          setIsReverseOrderEnabled(false);
          setDisplayedPictures([]);
        }
      }
    }

    getGalleryWallConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isRandomOrderEnabled) {
      setDisplayedPictures(shufflePictureList(config.picturePropsList));
      return;
    }

    setDisplayedPictures(
      isReverseOrderEnabled
        ? reversePictureList(config.picturePropsList)
        : config.picturePropsList
    );
  }, [config.picturePropsList, isRandomOrderEnabled, isReverseOrderEnabled]);

  return (
    <div
      className={styles.background}
      style={
        config.backgroundImage
          ? { backgroundImage: `url(${config.backgroundImage})` }
          : undefined
      }
    >
      <SettingsDrawer
        photoCount={config.picturePropsList.length}
        isRandomOrderEnabled={isRandomOrderEnabled}
        isReverseOrderEnabled={isReverseOrderEnabled}
        isNameVisible={isNameVisible}
        isTimeVisible={isTimeVisible}
        onRandomOrderChange={setIsRandomOrderEnabled}
        onReverseOrderChange={setIsReverseOrderEnabled}
        onNameVisibleChange={setIsNameVisible}
        onTimeVisibleChange={setIsTimeVisible}
      />

      <div className={styles.backgroundNoiseFilter}>
        <GalleryWall
          picturePropsList={displayedPictures}
          isNameVisible={isNameVisible}
          isTimeVisible={isTimeVisible}
        ></GalleryWall>
      </div>
    </div>
  );
}
