"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Oswald } from "next/font/google";
import styles from "./styles.module.css";

const nameTagFont = Oswald({ subsets: ["latin"] });

export interface FramedPictureProps {
  onClick?: () => void;
  imageSrc: string;
  nameTag?: string;
  timeTag?: string;
  rotate?: number;
  href?: string;
}

export default function FramedPicture(props: FramedPictureProps) {
  const pictureRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const animationStateRef = useRef({ scale: 0.7, rotation: 0 });
  const animationControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const dragStateRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation] = useState(() => props.rotate ?? getRandom(-5, 5));

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
  }, [isHovered, isInView, rotation]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setIsDragging(true);
    setIsHovered(false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    setPosition({
      x: dragStateRef.current.originX + deltaX,
      y: dragStateRef.current.originY + deltaY,
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
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
  }

  return (
    <div
      ref={pictureRef}
      className={styles.framedPicture + " shadow-xl"}
      style={{ transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.7)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={props.imageSrc}
        alt={"image about " + props.nameTag}
        className={styles.framedPictureImage}
        onClick={props.onClick}
      ></img>

      <div className={styles.framedPictureCaption}>
        {props.nameTag && (
          <h1
            className={
              nameTagFont.className + " " + styles.framedPictureNameTag
            }
          >
            {props.nameTag}
          </h1>
        )}

        {props.timeTag && (
          <p
            className={
              nameTagFont.className + " " + styles.framedPictureTimeTag
            }
          >
            {props.timeTag}
          </p>
        )}
      </div>
    </div>
  );
}
