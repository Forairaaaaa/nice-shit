import ImageCard, { ImageCardProps } from "./components/image-card";

const imageCardList: ImageCardProps[] = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1700943872245-569730a1714b?q=80&w=2670",
    nameTag: "Nice Shit",
    timeTag: "2023.12.2",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1701182811522-aa9a5eb07248",
    nameTag: "Skate!",
    timeTag: "2023.12.3",
  },
];

export default function PageProjectWall() {
  return (
    <div className="background-project-wall">
      <div className="background-noise-filter">
        <div className="flex items-center p-20 gap-20">
          {imageCardList.map((props) => (
            <ImageCard
              imageSrc={props.imageSrc}
              nameTag={props.nameTag}
              timeTag={props.timeTag}
            ></ImageCard>
          ))}
        </div>
      </div>
    </div>
  );
}
