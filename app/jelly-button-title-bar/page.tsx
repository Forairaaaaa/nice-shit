"use client";

import TitleBar from "./components/title-bar";
import styles from "./styles.module.css";

export default function PageGalleryWall() {
  return (
    <div
      className={
        styles.backgroundNoiseFilter + " flex items-center justify-center"
      }
    >
      <div className="w-[60vw] h-[75vh] rounded-xl bg-white shadow-2xl flex flex-col">
        <TitleBar />
        <div className="mb-[8vh] grow flex items-center justify-center font-bold text-[#ebebeb] text-4xl select-none">
          {":)"}
        </div>
      </div>
    </div>
  );
}
