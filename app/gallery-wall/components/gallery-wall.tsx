import FramedPicture, { FramedPictureProps } from "./framed-picture";

export default function GalleryWall(picturePropsList: FramedPictureProps[]) {
  return (
    <div className="flex flex-wrap justify-between items-center p-40 gap-x-10 gap-y-20">
      {picturePropsList.map((props) => (
        <FramedPicture
          imageSrc={props.imageSrc}
          nameTag={props.nameTag}
          timeTag={props.timeTag}
          rotate={props.rotate}
        ></FramedPicture>
      ))}
    </div>
  );
}
