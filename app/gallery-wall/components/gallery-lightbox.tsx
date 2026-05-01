"use client";

import { useEffect, useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import styles from "./styles.module.css";

interface GalleryLightboxProps {
  picturePropsList: FramedPictureProps[];
  initialPictureIndex: number;
  onClose: () => void;
}

export default function GalleryLightbox(props: GalleryLightboxProps) {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(
    props.initialPictureIndex
  );

  useEffect(() => {
    setCurrentPictureIndex(props.initialPictureIndex);
  }, [props.initialPictureIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        props.onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        setCurrentPictureIndex((previousIndex) =>
          previousIndex > 0
            ? previousIndex - 1
            : props.picturePropsList.length - 1
        );
      }

      if (event.key === "ArrowRight") {
        setCurrentPictureIndex((previousIndex) =>
          previousIndex < props.picturePropsList.length - 1
            ? previousIndex + 1
            : 0
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props, props.picturePropsList.length]);

  function showPreviousPicture() {
    setCurrentPictureIndex((previousIndex) =>
      previousIndex > 0 ? previousIndex - 1 : props.picturePropsList.length - 1
    );
  }

  function showNextPicture() {
    setCurrentPictureIndex((previousIndex) =>
      previousIndex < props.picturePropsList.length - 1 ? previousIndex + 1 : 0
    );
  }

  return (
    <div className={styles.lightbox} aria-modal="true" role="dialog">
      <button
        type="button"
        aria-label="Previous photo"
        className={styles.lightboxHotspot + " " + styles.lightboxHotspotLeft}
        onClick={showPreviousPicture}
      ></button>

      <div
        className={styles.lightboxTrack}
        style={{ transform: `translateX(-${currentPictureIndex * 100}%)` }}
      >
        {props.picturePropsList.map((pictureProps, index) => (
          <div
            key={pictureProps.imageSrc + index.toString()}
            className={
              styles.lightboxSlide +
              " " +
              (index === currentPictureIndex
                ? styles.lightboxSlideActive
                : styles.lightboxSlideInactive)
            }
          >
            <FramedPicture
              imageSrc={pictureProps.imageSrc}
              nameTag={pictureProps.nameTag}
              timeTag={pictureProps.timeTag}
              rotate={pictureProps.rotate}
              isDraggable={false}
            ></FramedPicture>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next photo"
        className={styles.lightboxHotspot + " " + styles.lightboxHotspotRight}
        onClick={showNextPicture}
      ></button>

      <button
        type="button"
        aria-label="Close lightbox"
        className={styles.lightboxClose}
        onClick={props.onClose}
      >
        <span className={styles.lightboxCloseIcon} aria-hidden="true">
          close
        </span>
      </button>
    </div>
  );
}