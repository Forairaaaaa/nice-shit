import React from "react";
import styles from "./styles.module.css";
import Blob from "./blob/blob";
import Starfield from "./starfield/starfield";

interface BackgroundProps {
  children?: React.ReactNode;
}

export default function Background(props: BackgroundProps) {
  return (
    <div className={styles.background}>
      {/* Stars */}
      <Starfield
        starCount={3000}
        starColor={[255, 255, 255]}
        speedFactor={0.002}
        backgroundColor="black"
      />

      {/* Fake Earth */}
      <Blob></Blob>

      {/* Children */}
      {props.children}

      {/* Noise filter */}
      <div className={styles["noise"]}></div>
    </div>
  );
}
