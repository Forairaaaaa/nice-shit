import ImageCard from "./components/image-card";
import image111 from "../../public/images/111.png"
import image222 from "../../public/images/222.jpg"


export default function PageProjectWall() {
  return (
    <div className="background-project-wall">
      <div className="background-noise-filter">
        <div className="grow flex flex-col items-center p-10 gap-10">
          <ImageCard
            imageSrc="https://images.unsplash.com/photo-1700943872245-569730a1714b?q=80&w=2670"
            nameTag="Nice Shit"
            timeTag="2023.12.2"
          ></ImageCard>
          <ImageCard
            imageSrc={image111}
            nameTag="??????"
            timeTag="2023.12.2"
          ></ImageCard>
          <ImageCard
            imageSrc={image222}
            nameTag="Ahhhhaaaaa!!"
            timeTag="2023.12.2"
          ></ImageCard>
        </div>
      </div>
    </div>
  );
}
