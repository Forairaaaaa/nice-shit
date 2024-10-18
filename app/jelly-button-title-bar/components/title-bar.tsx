"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import IconClose from "./icons/close";
import IconMaximize from "./icons/maximize";
import IconMinimize from "./icons/minimize";

interface JellyButtonProps {
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function JellyButton({ color, onClick, children }: JellyButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: "22px",
    height: "22px",
    borderRadius: "24px",
  });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    const maxOffset = 5;

    const x = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
    const y = Math.max(Math.min(offsetY, maxOffset), -maxOffset);

    setPosition({ x, y });
    setSize({ width: "32px", height: "32px", borderRadius: "12px" });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setSize({ width: "22px", height: "22px", borderRadius: "24px" });
    setOpacity(0);
  };

  return (
    <div
      className="w-[32px] h-[32px] flex items-center justify-center"
      style={
        {
          WebkitAppRegion: "no-drag",
          // cursor: "none",
          // cursor: "pointer",
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={
        onClick
          ? () => {
              onClick();
              // 如果是Electron用，下面这里取消注释，可以确保点击后按钮复原回小圆点
              // handleMouseLeave();
            }
          : undefined
      }
    >
      <motion.div
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        initial={{
          width: "22px",
          height: "22px",
          borderRadius: "24px",
          background: color,
        }}
        animate={{
          x: position.x,
          y: position.y,
          width: size.width,
          height: size.height,
          borderRadius: size.borderRadius,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 30,
          mass: 1,
        }}
        whileTap={{ scale: 0.6 }}
      >
        <center
          style={{
            opacity: opacity,
            transition: "opacity 0.2s ease-out",
          }}
        >
          {children}
        </center>
      </motion.div>
    </div>
  );
}

export default function TitleBar() {
  return (
    <div
      className="w-full h-11 flex gap-x-1 pt-3 justify-end items-center z-[99]"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="font-bold text-[#D8D8D8] select-none">NiceShit</div>
      <div className="bg-[#D8D8D8] w-[2px] h-[16px] rounded-[10px] mx-2"></div>

      <JellyButton
        color="#ACCCEF"
        onClick={async () => {
          console.log("minimize clicked");
        }}
      >
        <IconMinimize />
      </JellyButton>

      <JellyButton
        color="#F8D08E"
        onClick={async () => {
          console.log("maximize clicked");
        }}
      >
        <IconMaximize />
      </JellyButton>

      <JellyButton
        color="#EE7D7D"
        onClick={async () => {
          console.log("close clicked");
        }}
      >
        <IconClose />
      </JellyButton>

      <div className="w-2"></div>
    </div>
  );
}
