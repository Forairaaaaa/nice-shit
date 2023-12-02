"use client";

import FramedPicture, { FramedPictureProps } from "./framed-picture";

interface GalleryWallProps {
  picturePropsList: FramedPictureProps[];
}

export default function GalleryWall(props: GalleryWallProps) {
  return (
    <div className="flex flex-wrap justify-between items-center xl:py-20 xl:p-40 gap-x-10 gap-y-20">
      {props.picturePropsList.map((props) => (
        <FramedPicture
          key={props.imageSrc}
          imageSrc={props.imageSrc}
          nameTag={props.nameTag}
          timeTag={props.timeTag}
          rotate={props.rotate}
          onClick={() => {
            // Redirect
            if (props.herf != "" && props.herf) {
              location.href = props.herf;
            }
          }}
        ></FramedPicture>
      ))}
    </div>
  );
}
