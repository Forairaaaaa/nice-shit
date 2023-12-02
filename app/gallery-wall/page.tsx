import { FramedPictureProps } from "./components/framed-picture";
import GalleryWall from "./components/gallery-wall";

const pictureList: FramedPictureProps[] = [
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
  {
    imageSrc:
      "https://images.unsplash.com/photo-1700943872245-569730a1714b?q=80&w=2670",
    nameTag: "Nice Shit",
    timeTag: "2023.12.2",
  },
];

export default function PageGalleryWall() {

  return (
    <div className="background-project-wall">
      <div className="background-noise-filter">
        {GalleryWall(pictureList)}
      </div>
    </div>
  );
}
