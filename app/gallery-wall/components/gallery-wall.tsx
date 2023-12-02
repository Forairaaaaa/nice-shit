import FramedPicture, { FramedPictureProps } from "./framed-picture";

export default function GalleryWall(picturePropsList: FramedPictureProps[]) {
  return (
    <div className="flex flex-wrap justify-between items-center py-20 p-40 gap-x-10 gap-y-20">
      {picturePropsList.map((props) => (
        <FramedPicture
          key={props.imageSrc}
          imageSrc={props.imageSrc}
          nameTag={props.nameTag}
          timeTag={props.timeTag}
          rotate={props.rotate}
        ></FramedPicture>
      ))}
    </div>
  );
}
