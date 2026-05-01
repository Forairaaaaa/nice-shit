import GalleryWallPage from "../../gallery-wall/gallery-wall-page";

interface PageGalleryPictureProps {
  params: {
    id: string;
  };
}

export default function PageGalleryPicture(props: PageGalleryPictureProps) {
  return <GalleryWallPage initialPictureId={props.params.id} />;
}