"use client";

import { useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import GalleryLightbox from "./gallery-lightbox";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
  isNameVisible: boolean;
  isTimeVisible: boolean;
  onEditCaption: (pictureProps: FramedPictureProps) => void;
}

export default function GalleryWall(props: GalleryWallProps) {
  const [selectedPictureIndex, setSelectedPictureIndex] = useState<number | null>(
    null
  );

  if (selectedPictureIndex !== null) {
    return (
      <GalleryLightbox
        picturePropsList={props.picturePropsList}
        initialPictureIndex={selectedPictureIndex}
        isNameVisible={props.isNameVisible}
        isTimeVisible={props.isTimeVisible}
        onEditCaption={props.onEditCaption}
        onClose={() => {
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
          rotate={pictureProps.rotate}
          isNameVisible={props.isNameVisible}
          isTimeVisible={props.isTimeVisible}
          onEditCaption={() => props.onEditCaption(pictureProps)}
          onClick={() => {
            setSelectedPictureIndex(index);
          }}
        ></FramedPicture>
      ))}
    </div>
  );
}
