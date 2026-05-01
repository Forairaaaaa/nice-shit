"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import GalleryLightbox from "./gallery-lightbox";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
  canonicalPicturePropsList: FramedPictureProps[];
  isNameVisible: boolean;
  isTimeVisible: boolean;
  initialPictureId: string | null;
  onEditCaption: (pictureProps: FramedPictureProps) => void;
}

export default function GalleryWall(props: GalleryWallProps) {
  const router = useRouter();
  const [selectedPictureIndex, setSelectedPictureIndex] = useState<number | null>(
    null
  );
  const activeLightboxPicturePropsList = props.initialPictureId
    ? props.canonicalPicturePropsList
    : props.picturePropsList;

  useEffect(() => {
    if (!props.initialPictureId) {
      setSelectedPictureIndex(null);
      return;
    }

    const matchedPictureIndex = props.canonicalPicturePropsList.findIndex(
      (pictureProps) => pictureProps.id === props.initialPictureId
    );

    if (matchedPictureIndex !== -1) {
      setSelectedPictureIndex(matchedPictureIndex);
    }
  }, [props.canonicalPicturePropsList, props.initialPictureId]);

  if (selectedPictureIndex !== null) {
    return (
      <GalleryLightbox
        picturePropsList={activeLightboxPicturePropsList}
        initialPictureIndex={selectedPictureIndex}
        isNameVisible={props.isNameVisible}
        isTimeVisible={props.isTimeVisible}
        onEditCaption={props.onEditCaption}
        onPictureIndexChange={setSelectedPictureIndex}
        onClose={() => {
          if (props.initialPictureId) {
            router.push("/gallery");
            return;
          }

          setSelectedPictureIndex(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-wrap justify-between items-center xl:py-20 xl:p-40 gap-x-10 gap-y-20">
      {props.picturePropsList.map((pictureProps, index) => (
        <FramedPicture
          key={pictureProps.nameTag + index.toString()}
          imageSrc={pictureProps.imageSrc}
          nameTag={pictureProps.nameTag}
          timeTag={pictureProps.timeTag}
          id={pictureProps.id}
          rotate={pictureProps.rotate}
          isNameVisible={props.isNameVisible}
          isTimeVisible={props.isTimeVisible}
          onEditCaption={() => props.onEditCaption(pictureProps)}
          onClick={() => {
            if (pictureProps.id) {
              router.push(`/gallery/${encodeURIComponent(pictureProps.id)}`);
              return;
            }

            setSelectedPictureIndex(index);
          }}
        ></FramedPicture>
      ))}
    </div>
  );
}
