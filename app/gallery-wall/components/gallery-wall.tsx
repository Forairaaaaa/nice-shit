import FramedPicture, { FramedPictureProps } from "./framed-picture";

export default function GalleryWall(
  picturePropsList: FramedPictureProps[],
  randomOrder: boolean = false
) {
  const shuffle = (array: FramedPictureProps[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  if (randomOrder) {
    picturePropsList = shuffle(picturePropsList);
  }

  return (
    <div className="flex flex-wrap justify-between items-center xl:py-20 xl:p-40 gap-x-10 gap-y-20">
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
