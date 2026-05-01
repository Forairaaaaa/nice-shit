"use client";

import { useEffect, useState } from "react";
import styles from "../styles.module.css";

interface CaptionEditorModalProps {
  initialName: string;
  initialTime: string;
  onCancel: () => void;
  onConfirm: (nameTag: string, timeTag: string) => void;
}

export default function CaptionEditorModal(props: CaptionEditorModalProps) {
  const [nameTag, setNameTag] = useState(props.initialName);
  const [timeTag, setTimeTag] = useState(props.initialTime);

  useEffect(() => {
    setNameTag(props.initialName);
    setTimeTag(props.initialTime);
  }, [props.initialName, props.initialTime]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onConfirm(nameTag, timeTag);
  }

  return (
    <div className={styles.captionEditorBackdrop}>
      <form className={styles.captionEditorModal} onSubmit={handleSubmit}>
        <div className={styles.captionEditorHeader}>
          <p className={styles.captionEditorEyebrow}>Edit Caption</p>
        </div>

        <label className={styles.captionEditorField}>
          <span className={styles.captionEditorLabel}>Name</span>
          <input
            type="text"
            value={nameTag}
            onChange={(event) => setNameTag(event.target.value)}
            className={styles.captionEditorInput}
            autoFocus
          />
        </label>

        <label className={styles.captionEditorField}>
          <span className={styles.captionEditorLabel}>Time</span>
          <input
            type="text"
            value={timeTag}
            onChange={(event) => setTimeTag(event.target.value)}
            className={styles.captionEditorInput}
          />
        </label>

        <div className={styles.captionEditorActions}>
          <button
            type="button"
            className={styles.captionEditorButtonSecondary}
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={styles.captionEditorButtonPrimary}>
            OK
          </button>
        </div>
      </form>
    </div>
  );
}