import Image from "next/image";
import { Oswald } from "next/font/google";
import styles from "./styles.module.css";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const nameTagFont = Oswald({ subsets: ["latin"] });

interface ImageCardProps {
  onClick?: () => void;
  imageSrc: string | StaticImport;
  nameTag: string;
  timeTag: string;
}

export default function ImageCard(props: ImageCardProps) {
  return (
    <div className={styles.imageCard}>
      <Image
        src={props.imageSrc}
        alt={"image about " + props.nameTag}
        width={500}
        height={450}
      ></Image>
      <h1 className={nameTagFont.className + " " + styles.imageCardNameTag}>
        {props.nameTag}
      </h1>
      <p className={nameTagFont.className + " " + styles.imageCardTimeTag}>
        {props.timeTag}
      </p>
    </div>
  );
}
