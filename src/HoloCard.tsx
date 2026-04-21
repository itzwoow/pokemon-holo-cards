import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { fetchPokemonCard, HoloCardData } from "./api";

export interface HoloCardProps {
  /** Card front image URL (required unless `id` is provided) */
  imageUrl?: string;
  /** Card name (also used for alt text) */
  name?: string;
  /** Pokémon TCG API rarity string */
  rarity?: string;
  /** Pokémon TCG API subtypes array */
  subtypes?: string[];
  /** Pokémon TCG API supertype */
  supertype?: string;
  /** Set ID (e.g. "swsh4") — used to build CDN foil URLs */
  setId?: string;
  /** Card number within set (e.g. "050") */
  cardNumber?: string;
  /**
   * Pokémon TCG API card id (e.g. "swsh4-50"). When provided, the card data
   * is fetched automatically — no other props required.
   */
  id?: string;
  /** Optional TCG API key for higher rate limits */
  apiKey?: string;
  /** Called when card is clicked (fires regardless of zoom) */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Called when API fetch fails (only when `id` is used) */
  onFetchError?: (err: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Disable click-to-zoom event dispatch (used internally by CardZoomModal) */
  disableZoom?: boolean;
  /** Rendered while card data is being fetched via `id` */
  loadingFallback?: React.ReactNode;
  /** Rendered if image/API fails to load */
  errorFallback?: React.ReactNode;
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

const CDN = "https://poke-holo.b-cdn.net";

const RARITY_MAP: Record<string, string> = {
  "rare holo": "rare holo",
  "rare holo v": "rare holo v",
  "rare holo vmax": "rare holo vmax",
  "rare holo vstar": "rare holo vstar",
  "rare holo vunion": "rare holo vunion",
  "rare holo cosmos": "rare holo cosmos",
  "rare ultra": "rare ultra",
  "rare rainbow": "rare rainbow",
  "rare secret": "rare secret",
  "amazing rare": "amazing rare",
  "radiant rare": "radiant rare",
  "rare rainbow alt": "rare rainbow alt",
  "rare shiny": "rare shiny",
  "rare shiny v": "rare shiny v",
  "rare shiny vmax": "rare shiny vmax",
  "trainer gallery rare holo": "trainer gallery rare holo",
  "common reverse holo": "common reverse holo",
  "uncommon reverse holo": "uncommon reverse holo",
  "rare reverse holo": "rare reverse holo",
  // ── Scarlet & Violet era ──────────────────────────────────────────────────
  // Double Rare = ex Pokémon (SV diagonal slanted sheen + sparkle)
  "double rare": "double rare",
  // Ultra Rare = ex full-art / trainer full-art (etched sunpillar)
  "ultra rare": "rare ultra",
  // Illustration Rare = full-bleed painted art (full-art sunpillar, NOT basic holo)
  "illustration rare": "rare holo v",
  // Special Illustration Rare = premium full-art (soft pearlescent shimmer, NOT harsh rainbow bars)
  "special illustration rare": "rare rainbow alt",
  // Hyper Rare = gold textured secret (etched swsecret)
  "hyper rare": "rare secret",
  // Shiny Rare = shiny pokemon in SV sets (etched sunpillar, no sv-prefix card numbers)
  "shiny rare": "rare shiny v",
  // Shiny Ultra Rare = shiny ex full-arts (etched swsecret)
  "shiny ultra rare": "rare shiny vmax",
  // ACE SPEC Rare = special item cards (etched sunpillar)
  "ace spec rare": "rare ultra",
  // ── SWSH era aliases ──────────────────────────────────────────────────────
  "rare holo ex": "rare holo v",
  "basic v": "rare holo v",
};

function getCssRarity(rarity?: string): string | null {
  if (!rarity) return null;
  return RARITY_MAP[rarity.toLowerCase()] ?? null;
}

interface FoilResult {
  foilUrl: string;
  maskUrl: string;
}

function buildFoilUrls(
  setId: string,
  cardNumber: string,
  cssRarity: string,
  subtypes?: string[],
): FoilResult | null {
  const rawSet = setId.toLowerCase();
  const fSet = rawSet.replace(/(tg|gg|sv)/, "");

  if (!fSet.startsWith("swsh") && !rawSet.startsWith("sv") && rawSet !== "pgo") return null;

  const fRarity = cssRarity.toLowerCase();
  const fNumber = cardNumber.toLowerCase().replace("swsh", "").padStart(3, "0");

  const isTg = !!cardNumber.match(/^[tg]g/i);
  const isShinyVault = cardNumber.toLowerCase().startsWith("sv");
  const hasVmax = !!subtypes?.some(s => s.toLowerCase() === "vmax");

  let etch = "holo";
  let style = "reverse";

  if (fRarity === "rare holo") { style = "swholo"; }
  if (fRarity === "double rare") { etch = "holo"; style = "sunpillar"; }
  if (fRarity === "rare holo cosmos") { style = "cosmos"; }
  if (fRarity === "radiant rare") { etch = "etched"; style = "radiantholo"; }
  if (fRarity === "rare holo v" || fRarity === "rare holo vunion" || fRarity === "basic v") {
    etch = "holo"; style = "sunpillar";
  }
  if (fRarity === "rare holo vmax" || fRarity === "rare ultra" || fRarity === "rare holo vstar") {
    etch = "etched"; style = "sunpillar";
  }
  if (fRarity === "amazing rare" || fRarity === "rare rainbow" || fRarity === "rare secret") {
    etch = "etched"; style = "swsecret";
  }
  // rare rainbow alt covers both SWSH alt-arts AND SV Special Illustration Rares
  if (fRarity === "rare rainbow alt") {
    etch = "etched"; style = hasVmax ? "swsecret" : "sunpillar";
  }
  if (fRarity === "trainer gallery rare holo") {
    etch = "holo"; style = "rainbow";
  }
  // SV-era shiny rares (card numbers are regular, not sv-prefixed)
  if (fRarity === "rare shiny v") { etch = "etched"; style = "sunpillar"; }
  if (fRarity === "rare shiny vmax") { etch = "etched"; style = "swsecret"; }

  // SWSH Shining Fates shiny vault (card numbers start with "sv")
  if (isShinyVault) {
    etch = "etched"; style = "sunpillar";
    if (fRarity === "rare shiny vmax" || fRarity === "rare holo vmax") {
      style = "swsecret";
    }
  }

  if (isTg) {
    etch = "holo"; style = "rainbow";
    if (fRarity.includes("rare holo v") || fRarity.includes("rare ultra")) {
      etch = "etched"; style = "sunpillar";
    }
    if (fRarity.includes("rare secret")) {
      etch = "etched"; style = "swsecret";
    }
  }

  const foilUrl = `${CDN}/foils/${fSet}/foils/upscaled/${fNumber}_foil_${etch}_${style}_2x.webp`;
  const maskUrl = `${CDN}/foils/${fSet}/masks/upscaled/${fNumber}_foil_${etch}_${style}_2x.webp`;
  return { foilUrl, maskUrl };
}

export const HoloCard: React.FC<HoloCardProps> = (props) => {
  const {
    id: cardId,
    apiKey,
    onClick,
    onFetchError,
    className = "",
    style: styleProp,
    disableZoom = false,
    loadingFallback,
    errorFallback,
  } = props;

  // If `id` prop is set, fetch from TCG API and merge the result over passed props.
  const [fetched, setFetched] = useState<HoloCardData | null>(null);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!cardId) { setFetched(null); setFetchError(null); return; }
    const controller = new AbortController();
    let cancelled = false;
    fetchPokemonCard(cardId, { apiKey, signal: controller.signal })
      .then(data => { if (!cancelled) setFetched(data); })
      .catch(err => {
        if (cancelled || err.name === "AbortError") return;
        setFetchError(err);
        onFetchError?.(err);
      });
    return () => { cancelled = true; controller.abort(); };
  }, [cardId, apiKey, onFetchError]);

  const imageUrl = fetched?.imageUrl ?? props.imageUrl ?? "";
  const name = fetched?.name ?? props.name ?? "Pokémon Card";
  const rarity = fetched?.rarity ?? props.rarity;
  const subtypes = fetched?.subtypes ?? props.subtypes;
  const supertype = fetched?.supertype ?? props.supertype;
  const setId = fetched?.setId ?? props.setId;
  const cardNumber = fetched?.cardNumber ?? props.cardNumber;

  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const activeRef = useRef(false);
  const [maskLoaded, setMaskLoaded] = useState(false);

  const springs = useRef({
    rotX: new Spring(0.066, 0.25, 0),
    rotY: new Spring(0.066, 0.25, 0),
    bgX: new Spring(0.066, 0.25, 50),
    bgY: new Spring(0.066, 0.25, 50),
    glareX: new Spring(0.066, 0.25, 50),
    glareY: new Spring(0.066, 0.25, 50),
  });

  const cssRarity = getCssRarity(rarity);
  const foilUrls = useMemo(
    () => (cssRarity && setId && cardNumber
      ? buildFoilUrls(setId, cardNumber, cssRarity, subtypes)
      : null),
    [cssRarity, setId, cardNumber, subtypes],
  );

  useEffect(() => {
    if (!foilUrls?.maskUrl || typeof window === "undefined") { setMaskLoaded(false); return; }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => { if (!cancelled) setMaskLoaded(true); };
    img.onerror = () => { if (!cancelled) setMaskLoaded(false); };
    img.src = foilUrls.maskUrl;
    return () => { cancelled = true; };
  }, [foilUrls?.maskUrl]);

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

  const updateFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const s = springs.current;
    s.rotX.set(-((px - 0.5) * 100) / 3.5);
    s.rotY.set(((py - 0.5) * 100) / 3.5);
    s.bgX.set(37 + px * 26);
    s.bgY.set(33 + py * 34);
    s.glareX.set(px * 100);
    s.glareY.set(py * 100);
    el.style.setProperty("--card-opacity", "1");

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(applyVars);
  }, [applyVars]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    updateFromPoint(e.clientX, e.clientY);
  }, [updateFromPoint]);

  const handlePointerLeave = useCallback(() => {
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

  const handlePointerEnter = useCallback(() => {
    activeRef.current = true;
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointercancel", handlePointerLeave);
    el.addEventListener("pointerenter", handlePointerEnter);
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointercancel", handlePointerLeave);
      el.removeEventListener("pointerenter", handlePointerEnter);
      cancelAnimationFrame(frameRef.current);
    };
  }, [handlePointerMove, handlePointerLeave, handlePointerEnter]);

  const triggerZoom = useCallback(() => {
    const el = cardRef.current;
    if (!el || disableZoom) return;
    el.dispatchEvent(new CustomEvent("holo-card-zoom", {
      bubbles: true,
      detail: {
        imageUrl, name, rarity, subtypes, supertype, setId, cardNumber,
        rect: el.getBoundingClientRect(),
      },
    }));
  }, [imageUrl, name, rarity, subtypes, supertype, setId, cardNumber, disableZoom]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    triggerZoom();
    onClick?.(e);
  }, [triggerZoom, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerZoom();
      onClick?.(e);
    }
  }, [triggerZoom, onClick]);

  // Stable per-mount random seeds (cosmos pattern offset)
  const { seedX, seedY, cosmosX, cosmosY } = useMemo(() => {
    const sx = Math.random();
    const sy = Math.random();
    return {
      seedX: sx, seedY: sy,
      cosmosX: Math.floor(sx * 734),
      cosmosY: Math.floor(sy * 1280),
    };
  }, []);

  // Loading state when fetching by id
  if (cardId && !fetched && !fetchError) {
    return <>{loadingFallback ?? <div className={`holo-card-loading ${className}`} style={styleProp} aria-busy="true" aria-label="Loading card" />}</>;
  }

  // Fetch error
  if (fetchError) {
    return <>{errorFallback ?? <div className={`holo-card-error ${className}`} style={styleProp} role="img" aria-label="Card unavailable" />}</>;
  }

  // No image URL at all — nothing we can render
  if (!imageUrl) {
    return <>{errorFallback ?? null}</>;
  }

  // Image failed to load
  if (imgError) {
    return <>{errorFallback ?? <div className={`holo-card-error ${className}`} style={styleProp} role="img" aria-label={`${name} failed to load`} />}</>;
  }

  // Unknown/common rarity — use "common" as fallback so all cards get tilt + glare
  const effectiveRarity = cssRarity ?? "common";

  const dataAttrs: Record<string, string> = {
    "data-rarity": effectiveRarity,
  };
  if (supertype) dataAttrs["data-supertype"] = supertype.toLowerCase();
  if (subtypes?.length) dataAttrs["data-subtypes"] = subtypes.join(" ").toLowerCase();
  if (cardNumber?.match(/^[tg]g/i)) dataAttrs["data-trainer-gallery"] = "true";

  const foilStyle = foilUrls && maskLoaded
    ? ({
        "--foil": `url('${foilUrls.foilUrl}')`,
        "--mask": `url('${foilUrls.maskUrl}')`,
      } as React.CSSProperties)
    : {};

  return (
    <div
      ref={cardRef}
      className={`holo-card${maskLoaded ? " masked" : ""} ${className}`.trim()}
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
        "--cosmosbg": `${cosmosX}px ${cosmosY}px`,
        cursor: disableZoom ? "default" : "pointer",
        touchAction: "none",
        ...foilStyle,
        ...styleProp,
      } as React.CSSProperties}
      {...dataAttrs}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={disableZoom ? undefined : "button"}
      tabIndex={disableZoom ? undefined : 0}
      aria-label={`${name}${rarity ? `, ${rarity}` : ""}`}
    >
      <img
        className="holo-card__img"
        src={imageUrl}
        alt={name}
        draggable={false}
        onLoad={e => (e.currentTarget as HTMLImageElement).classList.add("loaded")}
        onError={() => setImgError(true)}
      />
      <div className="holo-card__shine" />
      <div className="holo-card__glare" />
    </div>
  );
};

export default HoloCard;
