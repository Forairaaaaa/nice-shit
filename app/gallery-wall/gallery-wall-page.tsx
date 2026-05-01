"use client";

import { useEffect, useState } from "react";
import CaptionEditorModal from "./components/caption-editor-modal";
import GalleryWall from "./components/gallery-wall";
import type { FramedPictureProps } from "./components/framed-picture";
import SettingsDrawer from "./components/settings-drawer";
import styles from "./styles.module.css";

const CAPTION_OVERRIDES_STORAGE_KEY = "gallery-wall-caption-overrides";

interface CaptionOverrides {
  [imageSrc: string]: {
    nameTag: string;
    timeTag: string;
  };
}

interface EditingPictureState {
  imageSrc: string;
  nameTag: string;
  timeTag: string;
}

interface GalleryWallConfig {
  backgroundImage: string;
  randomOrder: boolean;
  picturePropsList: FramedPictureProps[];
}

interface GalleryWallConfigResponse {
  backgroundImage?: string;
  randomOrder?: boolean;
  pictureList?: Array<{
    id?: string;
    imageSrc?: string;
    nameTag?: string;
    timeTag?: string;
    href?: string;
    rotate?: number;
  }>;
}

interface GalleryWallPageProps {
  initialPictureId?: string | null;
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
      id: picture.id,
      imageSrc: picture.imageSrc as string,
      nameTag: picture.nameTag ?? "",
      timeTag: picture.timeTag ?? "",
      href: picture.href ?? "",
      rotate: picture.rotate,
    }));

  return {
    backgroundImage: data.backgroundImage ?? "",
    randomOrder: Boolean(data.randomOrder),
    picturePropsList,
  };
}

function applyCaptionOverrides(
  list: FramedPictureProps[],
  captionOverrides: CaptionOverrides
) {
  return list.map((pictureProps) => {
    const override = captionOverrides[pictureProps.imageSrc];

    if (!override) {
      return pictureProps;
    }

    return {
      ...pictureProps,
      nameTag: override.nameTag,
      timeTag: override.timeTag,
    };
  });
}

export default function GalleryWallPage(props: GalleryWallPageProps) {
  const [config, setConfig] = useState<GalleryWallConfig>(EMPTY_CONFIG);
  const [displayedPictures, setDisplayedPictures] = useState<FramedPictureProps[]>(
    []
  );
  const [isRandomOrderEnabled, setIsRandomOrderEnabled] = useState(false);
  const [isReverseOrderEnabled, setIsReverseOrderEnabled] = useState(false);
  const [isNameVisible, setIsNameVisible] = useState(true);
  const [isTimeVisible, setIsTimeVisible] = useState(true);
  const [captionOverrides, setCaptionOverrides] = useState<CaptionOverrides>({});
  const [editingPicture, setEditingPicture] = useState<EditingPictureState | null>(
    null
  );

  useEffect(() => {
    try {
      const storedOverrides = window.localStorage.getItem(
        CAPTION_OVERRIDES_STORAGE_KEY
      );

      if (!storedOverrides) {
        return;
      }

      setCaptionOverrides(JSON.parse(storedOverrides) as CaptionOverrides);
    } catch (error) {
      console.error("Failed to read gallery wall caption overrides", error);
    }
  }, []);

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
          setDisplayedPictures(
            normalizedConfig.randomOrder
              ? shufflePictureList(normalizedConfig.picturePropsList)
              : normalizedConfig.picturePropsList
          );
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

  function openCaptionEditor(pictureProps: FramedPictureProps) {
    setEditingPicture({
      imageSrc: pictureProps.imageSrc,
      nameTag: pictureProps.nameTag ?? "",
      timeTag: pictureProps.timeTag ?? "",
    });
  }

  function handleCaptionSave(nameTag: string, timeTag: string) {
    if (!editingPicture) {
      return;
    }

    const nextOverrides = {
      ...captionOverrides,
      [editingPicture.imageSrc]: {
        nameTag,
        timeTag,
      },
    };

    setCaptionOverrides(nextOverrides);
    window.localStorage.setItem(
      CAPTION_OVERRIDES_STORAGE_KEY,
      JSON.stringify(nextOverrides)
    );
    setEditingPicture(null);
  }

  const resolvedPictures = applyCaptionOverrides(displayedPictures, captionOverrides);
  const resolvedCanonicalPictures = applyCaptionOverrides(
    config.picturePropsList,
    captionOverrides
  );

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
          picturePropsList={resolvedPictures}
          canonicalPicturePropsList={resolvedCanonicalPictures}
          isNameVisible={isNameVisible}
          isTimeVisible={isTimeVisible}
          initialPictureId={props.initialPictureId ?? null}
          onEditCaption={openCaptionEditor}
        ></GalleryWall>
      </div>

      {editingPicture && (
        <CaptionEditorModal
          initialName={editingPicture.nameTag}
          initialTime={editingPicture.timeTag}
          onCancel={() => setEditingPicture(null)}
          onConfirm={handleCaptionSave}
        />
      )}
    </div>
  );
}