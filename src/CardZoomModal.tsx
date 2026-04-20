import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface ZoomDetail {
  imageUrl: string;
  name: string;
  rarity: string | null;
  rect: DOMRect;
}

type Phase = "idle" | "flipping" | "open";

const CARD_BACK = "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg";

export const CardZoomModal: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [card, setCard] = useState<ZoomDetail | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setPhase("idle");
    setCard(null);
  }, []);

  const runFlip = useCallback((detail: ZoomDetail) => {
    setCard(detail);
    setPhase("flipping");

    requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (!stage) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = Math.min(vw * 0.72, 420);
      const targetH = targetW * 1.396;
      const scale = targetW / detail.rect.width;

      const fromCx = detail.rect.left + detail.rect.width / 2;
      const fromCy = detail.rect.top + detail.rect.height / 2;
      const toCx = vw / 2;
      const toCy = vh / 2;
      const dx = toCx - fromCx;
      const dy = toCy - fromCy;
      const arc = Math.min(vh * 0.18, 120);

      stage.style.left = `${fromCx}px`;
      stage.style.top = `${fromCy}px`;
      stage.style.width = `${detail.rect.width}px`;
      stage.style.height = `${detail.rect.height}px`;

      const anim = stage.animate(
        [
          { transform: `perspective(1400px) translate(0px,0px) scale(1) rotateY(0deg)` },
          {
            transform: `perspective(1400px) translate(${dx * 0.25}px,${dy * 0.2 - arc}px) scale(${scale * 0.58}) rotateY(90deg)`,
            offset: 0.25,
          },
          {
            transform: `perspective(1400px) translate(${dx * 0.5}px,${dy * 0.5 - arc * 0.6}px) scale(${scale * 0.76}) rotateY(180deg)`,
            offset: 0.5,
          },
          {
            transform: `perspective(1400px) translate(${dx * 0.75}px,${dy * 0.77 - arc * 0.2}px) scale(${scale * 0.93}) rotateY(270deg)`,
            offset: 0.75,
          },
          {
            transform: `perspective(1400px) translate(${dx}px,${dy}px) scale(${scale}) rotateY(360deg)`,
          },
        ],
        { duration: 1200, easing: "linear", fill: "forwards" }
      );

      anim.onfinish = () => {
        stage.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
        stage.getAnimations().forEach(a => a.cancel());
        setPhase("open");
      };
    });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ZoomDetail>).detail;
      if (phase !== "idle") return;
      runFlip(detail);
    };
    document.addEventListener("holo-card-zoom", handler);
    return () => document.removeEventListener("holo-card-zoom", handler);
  }, [phase, runFlip]);

  useEffect(() => {
    if (phase === "idle") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, close]);

  if (phase === "idle" || !card) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="holo-zoom-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: phase === "open" ? "rgba(0,0,0,0.75)" : "transparent",
        transition: "background 0.3s ease",
        cursor: phase === "open" ? "zoom-out" : "default",
      }}
      onClick={phase === "open" ? close : undefined}
    >
      <div
        ref={stageRef}
        className="holo-zoom-stage"
        style={{
          position: "absolute",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "4.5% / 3.2%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              draggable: false,
            }}
            draggable={false}
          />
          <img
            src={CARD_BACK}
            alt="card back"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "4.5% / 3.2%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              draggable: false,
            }}
            draggable={false}
          />
        </div>
      </div>

      {phase === "open" && (
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>,
    document.body
  );
};

export default CardZoomModal;
