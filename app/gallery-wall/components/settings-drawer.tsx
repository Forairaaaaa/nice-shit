"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "../styles.module.css";

interface SettingsDrawerProps {
  photoCount: number;
  isRandomOrderEnabled: boolean;
  isReverseOrderEnabled: boolean;
  isNameVisible: boolean;
  isTimeVisible: boolean;
  onRandomOrderChange: (value: boolean) => void;
  onReverseOrderChange: (value: boolean) => void;
  onNameVisibleChange: (value: boolean) => void;
  onTimeVisibleChange: (value: boolean) => void;
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
  const settingsHoverZoneRef = useRef<HTMLDivElement>(null);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const settingsTriggerAnimationRef = useRef<AnimationPlaybackControls | null>(
    null
  );
  const settingsHintTimeoutRef = useRef<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsTriggerVisible, setIsSettingsTriggerVisible] =
    useState(false);

  useEffect(() => {
    setIsSettingsTriggerVisible(true);

    settingsHintTimeoutRef.current = window.setTimeout(() => {
      setIsSettingsTriggerVisible(false);
    }, 1800);

    return () => {
      if (settingsHintTimeoutRef.current !== null) {
        window.clearTimeout(settingsHintTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const triggerElement = settingsTriggerRef.current;

    if (!triggerElement) {
      return;
    }

    settingsTriggerAnimationRef.current?.stop();
    settingsTriggerAnimationRef.current = animate(
      triggerElement,
      {
        y: isSettingsTriggerVisible ? 0 : -22,
        opacity: isSettingsTriggerVisible ? 1 : 0,
      },
      {
        type: "spring",
        stiffness: 340,
        damping: 28,
        mass: 0.9,
      }
    );

    return () => {
      settingsTriggerAnimationRef.current?.stop();
    };
  }, [isSettingsTriggerVisible]);

  function openSettingsPanel() {
    if (settingsHintTimeoutRef.current !== null) {
      window.clearTimeout(settingsHintTimeoutRef.current);
      settingsHintTimeoutRef.current = null;
    }

    setIsSettingsOpen(true);
    setIsSettingsTriggerVisible(false);
  }

  function closeSettingsPanel() {
    setIsSettingsOpen(false);
    setIsSettingsTriggerVisible(false);
  }

  function isWithinSettingsEntryArea(nextTarget: EventTarget | null) {
    if (!(nextTarget instanceof Node)) {
      return false;
    }

    return Boolean(
      settingsHoverZoneRef.current?.contains(nextTarget) ||
        settingsTriggerRef.current?.contains(nextTarget)
    );
  }

  return (
    <>
      <div
        className={styles.settingsDock}
      >
        <div
          ref={settingsHoverZoneRef}
          className={styles.settingsHoverZone}
          onMouseEnter={() => {
            if (!isSettingsOpen) {
              setIsSettingsTriggerVisible(true);
            }
          }}
          onMouseLeave={(event) => {
            if (!isSettingsOpen && !isWithinSettingsEntryArea(event.relatedTarget)) {
              setIsSettingsTriggerVisible(false);
            }
          }}
        ></div>
        <div className={styles.settingsTriggerRail}>
          <button
            ref={settingsTriggerRef}
            type="button"
            aria-label={isSettingsOpen ? "Close settings panel" : "Open settings panel"}
            aria-expanded={isSettingsOpen}
            className={
              styles.settingsTrigger +
              " " +
              (isSettingsTriggerVisible ? styles.settingsTriggerInteractive : "")
            }
            onMouseEnter={() => {
              if (!isSettingsOpen) {
                setIsSettingsTriggerVisible(true);
              }
            }}
            onMouseLeave={(event) => {
              if (!isSettingsOpen && !isWithinSettingsEntryArea(event.relatedTarget)) {
                setIsSettingsTriggerVisible(false);
              }
            }}
            onClick={() => {
              if (isSettingsOpen) {
                closeSettingsPanel();
                return;
              }

              openSettingsPanel();
            }}
          >
            <span className={styles.settingsTriggerIcon} aria-hidden="true">
              menu
            </span>
          </button>
        </div>

        <section
          className={
            styles.settingsPanel +
            " " +
            (isSettingsOpen ? styles.settingsPanelOpen : "")
          }
          aria-hidden={!isSettingsOpen}
        >
          <div className={styles.settingsPanelHandle}></div>
          <div className={styles.settingsPanelHeader}>
            <p className={styles.settingsEyebrow}>Wall Controls</p>
          </div>

          <div className={styles.settingsGrid}>
            <label className={styles.settingsCard}>
              <span className={styles.settingsCardLabel}>Random order</span>
              <button
                type="button"
                role="switch"
                aria-checked={props.isRandomOrderEnabled}
                className={
                  styles.settingsSwitch +
                  " " +
                  (props.isRandomOrderEnabled ? styles.settingsSwitchActive : "")
                }
                onClick={() =>
                  props.onRandomOrderChange(!props.isRandomOrderEnabled)
                }
              >
                <span className={styles.settingsSwitchThumb}></span>
              </button>
            </label>

            {!props.isRandomOrderEnabled && (
              <label className={styles.settingsCard}>
                <span className={styles.settingsCardLabel}>Reverse order</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={props.isReverseOrderEnabled}
                  className={
                    styles.settingsSwitch +
                    " " +
                    (props.isReverseOrderEnabled ? styles.settingsSwitchActive : "")
                  }
                  onClick={() =>
                    props.onReverseOrderChange(!props.isReverseOrderEnabled)
                  }
                >
                  <span className={styles.settingsSwitchThumb}></span>
                </button>
              </label>
            )}

            <label className={styles.settingsCard}>
              <span className={styles.settingsCardLabel}>Show name</span>
              <button
                type="button"
                role="switch"
                aria-checked={props.isNameVisible}
                className={
                  styles.settingsSwitch +
                  " " +
                  (props.isNameVisible ? styles.settingsSwitchActive : "")
                }
                onClick={() => props.onNameVisibleChange(!props.isNameVisible)}
              >
                <span className={styles.settingsSwitchThumb}></span>
              </button>
            </label>

            <label className={styles.settingsCard}>
              <span className={styles.settingsCardLabel}>Show time</span>
              <button
                type="button"
                role="switch"
                aria-checked={props.isTimeVisible}
                className={
                  styles.settingsSwitch +
                  " " +
                  (props.isTimeVisible ? styles.settingsSwitchActive : "")
                }
                onClick={() => props.onTimeVisibleChange(!props.isTimeVisible)}
              >
                <span className={styles.settingsSwitchThumb}></span>
              </button>
            </label>

            <div className={styles.settingsCard}>
              <span className={styles.settingsCardLabel}>Photos loaded</span>
              <strong className={styles.settingsCardValue}>
                {props.photoCount}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {isSettingsOpen && (
        <button
          type="button"
          aria-label="Close settings panel"
          className={styles.settingsBackdrop}
          onClick={closeSettingsPanel}
        ></button>
      )}
    </>
  );
}