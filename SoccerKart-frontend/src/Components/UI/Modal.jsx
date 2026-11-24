import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import "./Modal.css";

/** Dependency-free modal (replaces antd Modal). Closes on Esc and backdrop click. */
export default function Modal({ open, onClose, title, children, width = 440 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="sk-modal-backdrop" onMouseDown={onClose}>
      <div
        className="sk-modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sk-modal-head">
          <h3>{title}</h3>
          <button className="sk-modal-x" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className="sk-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
