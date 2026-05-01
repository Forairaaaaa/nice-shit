"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FramedPicture, { FramedPictureProps } from "./framed-picture";
import styles from "./styles.module.css";

interface GalleryLightboxProps {
  picturePropsList: FramedPictureProps[];
  initialPictureIndex: number;
  isNameVisible: boolean;
  isTimeVisible: boolean;
  onEditCaption: (pictureProps: FramedPictureProps) => void;
  onClose: () => void;
}

export default function GalleryLightbox(props: GalleryLightboxProps) {
  const lightboxViewportRef = useRef<HTMLDivElement>(null);
  const lightboxTrackRef = useRef<HTMLDivElement>(null);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(
    props.initialPictureIndex
  );
  const [lightboxScaleCompensation, setLightboxScaleCompensation] = useState(1);
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState(false);
  const [isLightboxHovered, setIsLightboxHovered] = useState(false);
  const [isCloseHoverZoneHovered, setIsCloseHoverZoneHovered] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHotspotHintVisible, setIsHotspotHintVisible] = useState(false);
  const [isHotspotHintDismissed, setIsHotspotHintDismissed] = useState(false);

  const currentPictureIndexRef = useRef(props.initialPictureIndex);
  const trackPositionRef = useRef(0);
  const hasInitializedTrackPositionRef = useRef(false);
  const closeButtonAnimationRef = useRef<AnimationPlaybackControls | null>(
    null
  );
  const trackAnimationRef = useRef<AnimationPlaybackControls | null>(null);
  const closeHintTimeoutRef = useRef<number | null>(null);
  const hotspotHintTimeoutRef = useRef<number | null>(null);

  function applyTrackTransform() {
    const trackElement = lightboxTrackRef.current;

    if (!trackElement) {
      return;
    }

    trackElement.style.transform = `translateX(${trackPositionRef.current}px) translateZ(0px)`;
  }

  useEffect(() => {
    setCurrentPictureIndex(props.initialPictureIndex);
  }, [props.initialPictureIndex]);

  useEffect(() => {
    currentPictureIndexRef.current = currentPictureIndex;
  }, [currentPictureIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");

    function updateInputMode() {
      setIsPointerFine(mediaQuery.matches);
      setIsTouchDevice(
        window.matchMedia("(hover: none), (pointer: coarse)").matches
      );
    }

    updateInputMode();
    mediaQuery.addEventListener("change", updateInputMode);

    return () => {
      mediaQuery.removeEventListener("change", updateInputMode);
    };
  }, []);

  useEffect(() => {
    setIsCloseButtonVisible(true);
    setIsHotspotHintVisible(true);
    setIsHotspotHintDismissed(false);

    if (closeHintTimeoutRef.current !== null) {
      window.clearTimeout(closeHintTimeoutRef.current);
    }

    if (hotspotHintTimeoutRef.current !== null) {
      window.clearTimeout(hotspotHintTimeoutRef.current);
    }

    closeHintTimeoutRef.current = window.setTimeout(() => {
      setIsCloseButtonVisible(false);
    }, 1800);

    hotspotHintTimeoutRef.current = window.setTimeout(() => {
      setIsHotspotHintVisible(false);
    }, 1600);

    return () => {
      if (closeHintTimeoutRef.current !== null) {
        window.clearTimeout(closeHintTimeoutRef.current);
      }

      if (hotspotHintTimeoutRef.current !== null) {
        window.clearTimeout(hotspotHintTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function updateLightboxScaleCompensation() {
      const viewportScale = window.visualViewport?.scale ?? 1;

      setLightboxScaleCompensation(viewportScale > 0 ? 1 / viewportScale : 1);
    }

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

    updateLightboxScaleCompensation();

    window.addEventListener("keydown", handleKeyDown);
    window.visualViewport?.addEventListener(
      "resize",
      updateLightboxScaleCompensation
    );
    window.visualViewport?.addEventListener(
      "scroll",
      updateLightboxScaleCompensation
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.visualViewport?.removeEventListener(
        "resize",
        updateLightboxScaleCompensation
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateLightboxScaleCompensation
      );
    };
  }, [props, props.picturePropsList.length]);

  useEffect(() => {
    const closeElement = document.getElementById("gallery-lightbox-close-button");

    if (!closeElement) {
      return;
    }

    closeButtonAnimationRef.current?.stop();
    const shouldShowCloseButton =
      isCloseButtonVisible || isLightboxHovered || isCloseHoverZoneHovered;

    const controls = animate(
      closeElement,
      {
        y: shouldShowCloseButton ? 0 : -22,
        opacity: shouldShowCloseButton ? 1 : 0,
      },
      {
        type: "spring",
        stiffness: 340,
        damping: 28,
        mass: 0.9,
      }
    );

    closeButtonAnimationRef.current = controls;

    return () => {
      controls.stop();
    };
  }, [isCloseButtonVisible, isCloseHoverZoneHovered, isLightboxHovered]);

  useEffect(() => {
    if (!isPointerFine || isHotspotHintDismissed) {
      return;
    }

    if (isLightboxHovered) {
      setIsHotspotHintVisible(true);
      return;
    }

    setIsHotspotHintVisible(false);
  }, [isHotspotHintDismissed, isLightboxHovered, isPointerFine]);

  useEffect(() => {
    const viewportElement = lightboxViewportRef.current;

    if (!viewportElement) {
      return;
    }

    const targetX = -viewportElement.clientWidth * currentPictureIndex;

    if (!hasInitializedTrackPositionRef.current) {
      trackAnimationRef.current?.stop();
      trackPositionRef.current = targetX;
      applyTrackTransform();
      hasInitializedTrackPositionRef.current = true;
      return;
    }

    trackAnimationRef.current?.stop();
    trackAnimationRef.current = animate(trackPositionRef.current, targetX, {
      type: "spring",
      stiffness: 170,
      damping: 24,
      mass: 0.9,
      onUpdate(latest) {
        trackPositionRef.current = latest;
        applyTrackTransform();
      },
    });

    return () => {
      trackAnimationRef.current?.stop();
    };
  }, [currentPictureIndex]);

  useEffect(() => {
    function syncTrackPosition() {
      const viewportElement = lightboxViewportRef.current;
      const trackElement = lightboxTrackRef.current;

      if (!viewportElement || !trackElement) {
        return;
      }

      const targetX =
        -viewportElement.clientWidth * currentPictureIndexRef.current;

      trackAnimationRef.current?.stop();
      trackPositionRef.current = targetX;
      applyTrackTransform();
      hasInitializedTrackPositionRef.current = true;
    }

    syncTrackPosition();
    window.addEventListener("resize", syncTrackPosition);
    window.visualViewport?.addEventListener("resize", syncTrackPosition);

    return () => {
      window.removeEventListener("resize", syncTrackPosition);
      window.visualViewport?.removeEventListener("resize", syncTrackPosition);
    };
  }, []);

  function showPreviousPicture() {
    setIsHotspotHintVisible(false);
    setIsHotspotHintDismissed(true);
    setCurrentPictureIndex((previousIndex) =>
      previousIndex > 0 ? previousIndex - 1 : props.picturePropsList.length - 1
    );
  }

  function showNextPicture() {
    setIsHotspotHintVisible(false);
    setIsHotspotHintDismissed(true);
    setCurrentPictureIndex((previousIndex) =>
      previousIndex < props.picturePropsList.length - 1 ? previousIndex + 1 : 0
    );
  }

  return (
    <div
      className={styles.lightbox}
      aria-modal="true"
      role="dialog"
      onMouseEnter={() => {
        if (isPointerFine) {
          setIsLightboxHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsLightboxHovered(false);
      }}
    >
      <div
        ref={lightboxViewportRef}
        className={styles.lightboxViewport}
        style={{ transform: `scale(${lightboxScaleCompensation})` }}
      >
        <button
          type="button"
          aria-label="Previous photo"
          className={styles.lightboxHotspot + " " + styles.lightboxHotspotLeft}
          onClick={showPreviousPicture}
        >
          <span
            className={
              styles.lightboxHotspotIcon +
              " " +
              (isHotspotHintVisible || isTouchDevice
                ? styles.lightboxHotspotIconVisible
                : "")
            }
            aria-hidden="true"
          >
            chevron_left
          </span>
        </button>

        <div
          ref={lightboxTrackRef}
          className={styles.lightboxTrack}
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
                isNameVisible={props.isNameVisible}
                isTimeVisible={props.isTimeVisible}
                onEditCaption={() => props.onEditCaption(pictureProps)}
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
        >
          <span
            className={
              styles.lightboxHotspotIcon +
              " " +
              (isHotspotHintVisible || isTouchDevice
                ? styles.lightboxHotspotIconVisible
                : "")
            }
            aria-hidden="true"
          >
            chevron_right
          </span>
        </button>

        <div
          className={styles.lightboxCloseHoverZone}
          onMouseEnter={() => {
            if (isPointerFine) {
              setIsCloseHoverZoneHovered(true);
            }
          }}
          onMouseLeave={() => {
            setIsCloseHoverZoneHovered(false);
          }}
        ></div>

        <button
          id="gallery-lightbox-close-button"
          type="button"
          aria-label="Close lightbox"
          className={
            styles.lightboxClose +
            " " +
            ((isCloseButtonVisible || isLightboxHovered || isCloseHoverZoneHovered)
              ? styles.lightboxCloseInteractive
              : "")
          }
          onClick={props.onClose}
          onMouseEnter={() => {
            if (isPointerFine) {
              setIsCloseHoverZoneHovered(true);
            }
          }}
          onMouseLeave={() => {
            setIsCloseHoverZoneHovered(false);
          }}
        >
          <span className={styles.lightboxCloseIcon} aria-hidden="true">
            close
          </span>
        </button>
      </div>
    </div>
  );
}