import React, { useRef, useEffect, useCallback } from "react";

export interface HoloCardProps {
  /** Card front image URL */
  imageUrl: string;
  /** Card name (for alt text) */
  name?: string;
  /** Pokémon TCG API rarity string */
  rarity?: string;
  /** Pokémon TCG API subtypes array */
  subtypes?: string[];
  /** Pokémon TCG API supertype */
  supertype?: string;
  /** Set ID (e.g. "swsh4") — used to build CDN foil URLs */
  setId?: string;
  /** Card number within set (e.g. "025") */
  cardNumber?: string;
  /** Called when card is clicked */
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

class Spring {
  stiffness: number;
  damping: number;
  value: number;
  velocity: number;
  target: number;

  constructor(stiffness: number, damping: number, initial = 0) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.value = initial;
    this.velocity = 0;
    this.target = initial;
  }

  update() {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity = (this.velocity + force) * (1 - this.damping);
    this.value += this.velocity;
    return this.value;
  }

  set(v: number) { this.target = v; }
  snap(v: number) { this.target = v; this.value = v; this.velocity = 0; }
}

const RARITY_MAP: Record<string, string> = {
  "rare holo": "rare holo",
  "rare holo v": "rare holo v",
  "rare holo vmax": "rare holo vmax",
  "rare holo vstar": "rare holo vstar",
  "rare ultra": "rare ultra",
  "rare rainbow": "rare rainbow",
  "rare secret": "rare secret",
  "amazing rare": "amazing rare",
  "radiant rare": "radiant rare",
  "rare holo ex": "rare holo v",
  "double rare": "rare holo v",
  "ultra rare": "rare ultra",
  "special illustration rare": "rare rainbow",
  "hyper rare": "rare secret",
  "illustration rare": "rare holo",
};

function getCssRarity(rarity?: string): string | null {
  if (!rarity) return null;
  return RARITY_MAP[rarity.toLowerCase()] ?? null;
}

function isTrainerGallery(cardNumber?: string, subtypes?: string[]): boolean {
  if (subtypes?.some(s => s.toLowerCase().includes("trainer gallery"))) return true;
  if (!cardNumber) return false;
  const n = parseInt(cardNumber.replace(/\D/g, ""), 10);
  return n >= 180 && n <= 230;
}

function buildFoilUrls(
  setId: string,
  cardNumber: string,
  cssRarity: string,
  tg: boolean
): { foilUrl: string; maskUrl: string } | null {
  if (!setId.startsWith("swsh") && !setId.startsWith("sv")) return null;
  const CDN = "https://poke-holo.b-cdn.net";
  const num = cardNumber.padStart(3, "0");

  let etch = "reverse";
  let style = "holo";

  if (tg && cssRarity === "rare holo vmax") { etch = "etched"; style = "rainbow-alt"; }
  else if (cssRarity === "rare holo vstar") { etch = "etched"; style = "cosmos"; }
  else if (cssRarity === "rare holo vmax") { etch = "etched"; style = "sunpillar"; }
  else if (cssRarity === "rare holo v") { etch = "holo"; style = "sunpillar"; }
  else if (cssRarity === "rare rainbow") { etch = "etched"; style = "rainbow"; }
  else if (cssRarity === "rare secret") { etch = "etched"; style = "rainbow"; }
  else if (cssRarity === "rare ultra") { etch = "holo"; style = "sunpillar"; }

  const foilUrl = `${CDN}/foils/${setId}/foils/upscaled/${num}_foil_${etch}_${style}_2x.webp`;
  const maskUrl = `${CDN}/foils/${setId}/masks/upscaled/${num}_foil_${etch}_${style}_2x.webp`;
  return { foilUrl, maskUrl };
}

export const HoloCard: React.FC<HoloCardProps> = ({
  imageUrl,
  name = "Pokémon Card",
  rarity,
  subtypes,
  supertype,
  setId,
  cardNumber,
  onClick,
  className = "",
  style: styleProp,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const activeRef = useRef(false);

  const springs = useRef({
    rotX: new Spring(0.066, 0.25, 0),
    rotY: new Spring(0.066, 0.25, 0),
    bgX: new Spring(0.066, 0.25, 50),
    bgY: new Spring(0.066, 0.25, 50),
    glareX: new Spring(0.066, 0.25, 50),
    glareY: new Spring(0.066, 0.25, 50),
  });

  const cssRarity = getCssRarity(rarity);
  const tg = isTrainerGallery(cardNumber, subtypes);
  const foilUrls = cssRarity && setId && cardNumber
    ? buildFoilUrls(setId, cardNumber, cssRarity, tg)
    : null;

  const applyVars = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const s = springs.current;
    const rx = s.rotX.update();
    const ry = s.rotY.update();
    const bx = s.bgX.update();
    const by = s.bgY.update();
    const gx = s.glareX.update();
    const gy = s.glareY.update();

    const dx = gx / 100 - 0.5;
    const dy = gy / 100 - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);

    el.style.setProperty("--rotate-x", `${rx}deg`);
    el.style.setProperty("--rotate-y", `${ry}deg`);
    el.style.setProperty("--background-x", `${bx}%`);
    el.style.setProperty("--background-y", `${by}%`);
    el.style.setProperty("--pointer-x", `${gx}%`);
    el.style.setProperty("--pointer-y", `${gy}%`);
    el.style.setProperty("--pointer-from-center", `${Math.min(dist * 2, 1)}`);
    el.style.setProperty("--pointer-from-top", `${gy / 100}`);
    el.style.setProperty("--pointer-from-left", `${gx / 100}`);

    const moving = [s.rotX, s.rotY, s.bgX, s.bgY, s.glareX, s.glareY].some(
      sp => Math.abs(sp.velocity) > 0.001
    );
    if (moving || activeRef.current) {
      frameRef.current = requestAnimationFrame(applyVars);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const s = springs.current;
    s.rotX.set((py - 0.5) * -24);
    s.rotY.set((px - 0.5) * 24);
    s.bgX.set(40 + px * 20);
    s.bgY.set(40 + py * 20);
    s.glareX.set(px * 100);
    s.glareY.set(py * 100);
    el.style.setProperty("--card-opacity", "1");

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(applyVars);
  }, [applyVars]);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    activeRef.current = false;
    const s = springs.current;
    s.rotX.set(0); s.rotY.set(0);
    s.bgX.set(50); s.bgY.set(50);
    s.glareX.set(50); s.glareY.set(50);
    el.style.setProperty("--card-opacity", "0");
    frameRef.current = requestAnimationFrame(applyVars);
  }, [applyVars]);

  const handleMouseEnter = useCallback(() => {
    activeRef.current = true;
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !cssRarity) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(frameRef.current);
    };
  }, [cssRarity, handleMouseMove, handleMouseLeave, handleMouseEnter]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (el) {
      el.dispatchEvent(new CustomEvent("holo-card-zoom", {
        bubbles: true,
        detail: {
          imageUrl,
          name,
          rarity: cssRarity,
          rect: el.getBoundingClientRect(),
        },
      }));
    }
    onClick?.(e);
  }, [imageUrl, name, cssRarity, onClick]);

  if (!cssRarity) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={className}
        style={styleProp}
        onClick={onClick}
      />
    );
  }

  const dataAttrs: Record<string, string> = {
    "data-rarity": cssRarity,
  };
  if (supertype) dataAttrs["data-supertype"] = supertype.toLowerCase();
  if (tg) dataAttrs["data-trainer-gallery"] = "true";

  const foilStyle = foilUrls
    ? {
        "--foil-image": `url('${foilUrls.foilUrl}')`,
        "--mask-image-url": `url('${foilUrls.maskUrl}')`,
      } as React.CSSProperties
    : {};

  const seedX = Math.floor(Math.random() * 100);
  const seedY = Math.floor(Math.random() * 100);

  return (
    <div
      ref={cardRef}
      className={`holo-card ${className}`}
      style={{
        "--card-opacity": "0",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--background-x": "50%",
        "--background-y": "50%",
        "--pointer-x": "50%",
        "--pointer-y": "50%",
        "--pointer-from-center": "0",
        "--pointer-from-top": "0.5",
        "--pointer-from-left": "0.5",
        "--seedx": `${seedX}`,
        "--seedy": `${seedY}`,
        ...foilStyle,
        ...styleProp,
      } as React.CSSProperties}
      {...dataAttrs}
      onClick={handleClick}
    >
      <img
        className="holo-card__img"
        src={imageUrl}
        alt={name}
        draggable={false}
      />
      <div className="holo-card__shine" />
      <div className="holo-card__glare" />
    </div>
  );
};

export default HoloCard;
