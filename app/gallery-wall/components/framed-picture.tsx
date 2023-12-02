"use client";

import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import styles from "./styles.module.css";

const nameTagFont = Oswald({ subsets: ["latin"] });

export interface FramedPictureProps {
  onClick?: () => void;
  imageSrc: string;
  nameTag: string;
  timeTag: string;
  rotate?: number;
  herf?: string;
}

export default function FramedPicture(props: FramedPictureProps) {
  function getRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  return (
    <motion.div
      className={styles.framedPicture + " shadow-xl"}
      initial={{ scale: 0.7, rotate: 0 }}
      whileInView={{ scale: 1, rotate: props.rotate ?? getRandom(-5, 5) }}
      transition={{ type: "spring", stiffness: 400, damping: 20, mass: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      drag
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <motion.img
        src={props.imageSrc}
        alt={"image about " + props.nameTag}
        className={styles.framedPictureImage}
        onClick={props.onClick}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1 }}
      ></motion.img>

      {props.nameTag != "" && (
        <h1
          className={nameTagFont.className + " " + styles.framedPictureNameTag}
        >
          {props.nameTag}
        </h1>
      )}

      {props.timeTag != "" && (
        <p
          className={nameTagFont.className + " " + styles.framedPictureTimeTag}
        >
          {props.timeTag}
        </p>
      )}
    </motion.div>
  );
}
