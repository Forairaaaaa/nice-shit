"use client";

import TitleBar from "./components/title-bar";
import styles from "./styles.module.css";
import { motion } from "framer-motion";

export default function PageGalleryWall() {
  return (
    <div
      className={
        styles.backgroundNoiseFilter + " flex items-center justify-center"
      }
    >
      <div className="w-[60vw] h-[75vh] rounded-xl bg-white shadow-2xl">
        <TitleBar />
      </div>
    </div>
  );
}
