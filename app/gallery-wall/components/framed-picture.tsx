"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface FramedPictureProps {
  onClick?: () => void;
  onEditCaption?: () => void;
  imageSrc: string;
  nameTag?: string;
  timeTag?: string;
  rotate?: number;
  href?: string;
  isDraggable?: boolean;
  isRotatable?: boolean;
  isNameVisible?: boolean;
  isTimeVisible?: boolean;
}

export default function FramedPicture(props: FramedPictureProps) {
  const CLICK_DISTANCE_THRESHOLD = 8;
  const pictureRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const animationStateRef = useRef({ scale: 0.7, rotation: 0 });
  const animationControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const dragStateRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    didMove: false,
  });
  const rotateStateRef = useRef({
    startAngle: 0,
    originRotation: 0,
  });
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(() => props.rotate ?? getRandom(-5, 5));
  const rotationRef = useRef(rotation);
  const isDraggable = props.isDraggable ?? true;
  const isRotatable = props.isRotatable ?? true;
  const isNameVisible = props.isNameVisible ?? true;
  const isTimeVisible = props.isTimeVisible ?? true;

  function getRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  function applyTransform() {
    const element = pictureRef.current;

    if (!element) {
      return;
    }

    element.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) rotate(${animationStateRef.current.rotation}deg) scale(${animationStateRef.current.scale})`;
  }

  function stopAnimations() {
    animationControlsRef.current.forEach((control) => control.stop());
    animationControlsRef.current = [];
  }

  useEffect(() => {
    const element = pictureRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.intersectionRatio >= 0.2);
      },
      {
        threshold: [0, 0.2],
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    positionRef.current = position;
    applyTransform();
  }, [position]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if (isRotating) {
      return;
    }

    const targetScale = isInView ? (isHovered ? 1.05 : 1) : 0.7;
    const targetRotation = isInView ? rotation : 0;

    stopAnimations();

    animationControlsRef.current = [
      animate(animationStateRef.current.scale, targetScale, {
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 1,
        onUpdate(latest) {
          animationStateRef.current.scale = latest;
          applyTransform();
        },
      }),
      animate(animationStateRef.current.rotation, targetRotation, {
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 1,
        onUpdate(latest) {
          animationStateRef.current.rotation = latest;
          applyTransform();
        },
      }),
    ];

    return () => {
      stopAnimations();
    };
  }, [isHovered, isInView, isRotating, rotation]);

  function getAngleFromCenter(clientX: number, clientY: number) {
    const element = pictureRef.current;

    if (!element) {
      return 0;
    }

    const bounds = element.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggable || isRotating) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      didMove: false,
    };
    setIsDragging(true);
    setIsHovered(false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggable || !isDragging || isRotating) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    if (
      !dragStateRef.current.didMove &&
      Math.hypot(deltaX, deltaY) >= CLICK_DISTANCE_THRESHOLD
    ) {
      dragStateRef.current.didMove = true;
    }

    setPosition({
      x: dragStateRef.current.originX + deltaX,
      y: dragStateRef.current.originY + deltaY,
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggable || isRotating) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const isPointerInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
    setIsHovered(isPointerInside);

    if (isPointerInside && !dragStateRef.current.didMove) {
      props.onClick?.();
    }
  }

  function handleRotatePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!isRotatable) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    stopAnimations();

    rotateStateRef.current = {
      startAngle: getAngleFromCenter(event.clientX, event.clientY),
      originRotation: rotationRef.current,
    };

    setIsRotating(true);
    setIsHovered(false);
  }

  function handleRotatePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!isRotatable || !isRotating) {
      return;
    }

    event.stopPropagation();

    const nextRotation =
      rotateStateRef.current.originRotation +
      (getAngleFromCenter(event.clientX, event.clientY) -
        rotateStateRef.current.startAngle);

    rotationRef.current = nextRotation;
    animationStateRef.current.rotation = nextRotation;
    applyTransform();
  }

  function handleRotatePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!isRotatable) {
      return;
    }

    event.stopPropagation();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setRotation(rotationRef.current);
    setIsRotating(false);
    setIsHovered(true);
  }

  return (
    <div
      ref={pictureRef}
      className={
        styles.framedPicture +
        " shadow-xl " +
        (isDraggable ? "" : styles.framedPictureStatic)
      }
      style={{ transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.7)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {isRotatable && (
        <button
          type="button"
          aria-label="Rotate photo from bottom right corner"
          className={
            styles.framedPictureRotateHandle +
            " " +
            styles.framedPictureRotateHandleBottomRight +
            " " +
            (isRotating ? styles.framedPictureRotateHandleActive : "")
          }
          onPointerDown={handleRotatePointerDown}
          onPointerMove={handleRotatePointerMove}
          onPointerUp={handleRotatePointerUp}
          onPointerCancel={handleRotatePointerUp}
        ></button>
      )}

      <div className={styles.framedPictureImageFrame}>
        <img
          src={props.imageSrc}
          alt={"image about " + props.nameTag}
          className={styles.framedPictureImage}
        ></img>
      </div>

      <div className={styles.framedPictureCaption}>
        {props.onEditCaption && (
          <button
            type="button"
            aria-label="Edit photo caption"
            className={styles.framedPictureCaptionEditHotspot}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              props.onEditCaption?.();
            }}
          ></button>
        )}

        {isNameVisible && props.nameTag && (
          <h1 className={styles.framedPictureNameTag}>{props.nameTag}</h1>
        )}

        {isTimeVisible && props.timeTag && (
          <p className={styles.framedPictureTimeTag}>{props.timeTag}</p>
        )}
      </div>
    </div>
  );
}
