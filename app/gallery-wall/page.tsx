import { promises as fs } from "fs";
import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";

async function getPictureListFromFs() {
  const file = await fs.readFile(
    process.cwd() + "/public/gallery-wall/gallery-wall-props.json",
    "utf-8"
  );
  const data = JSON.parse(file);

  let pictureList: FramedPictureProps[] = [];
  (data.pictureProps as FramedPictureProps[]).forEach((props) => {
    pictureList.push({
      imageSrc: props.imageSrc,
      nameTag: props.nameTag,
      timeTag: props.timeTag,
    });
  });

  // console.log(pictureList);
  return pictureList;
}

export default async function PageGalleryWall() {
  return (
    <div className="background-project-wall">
      <div className="background-noise-filter">
        {GalleryWall(await getPictureListFromFs())}
      </div>
    </div>
  );
}
