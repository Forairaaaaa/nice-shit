import { Oswald } from "next/font/google";
import styles from "./styles.module.css";

const nameTagFont = Oswald({ subsets: ["latin"] });

export interface ImageCardProps {
  onClick?: () => void;
  imageSrc: string | undefined;
  nameTag: string;
  timeTag: string;
}

export default function ImageCard(props: ImageCardProps) {
  return (
    <div className={styles.imageCard}>
      <img src={props.imageSrc} alt={"image about " + props.nameTag} className={styles.imageCardImage}></img>

      <h1 className={nameTagFont.className + " " + styles.imageCardNameTag}>
        {props.nameTag}
      </h1>
      <p className={nameTagFont.className + " " + styles.imageCardTimeTag}>
        {props.timeTag}
      </p>
    </div>
  );
}
