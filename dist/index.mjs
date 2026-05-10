import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

// src/HoloCard.tsx

// src/api.ts
var API_BASE = "https://api.pokemontcg.io/v2";
function buildHeaders(apiKey) {
  const headers = { Accept: "application/json" };
  if (apiKey) headers["X-Api-Key"] = apiKey;
  return headers;
}
function apiCardToProps(card) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: card.id,
    imageUrl: (_d = (_c = (_a = card.images) == null ? void 0 : _a.large) != null ? _c : (_b = card.images) == null ? void 0 : _b.small) != null ? _d : "",
    name: card.name,
    rarity: card.rarity,
    subtypes: card.subtypes,
    supertype: card.supertype,
    setId: (_f = (_e = card.set) == null ? void 0 : _e.id) != null ? _f : "",
    cardNumber: card.number
  };
}
async function fetchPokemonCard(id, options = {}) {
  const res = await fetch(`${API_BASE}/cards/${encodeURIComponent(id)}`, {
    headers: buildHeaders(options.apiKey),
    signal: options.signal
  });
  if (!res.ok) {
    throw new Error(`pokemon-holo-cards: card "${id}" not found (HTTP ${res.status})`);
  }
  const body = await res.json();
  return apiCardToProps(body.data);
}
async function searchPokemonCards(query, options = {}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.page) params.set("page", String(options.page));
  if (options.orderBy) params.set("orderBy", options.orderBy);
  const res = await fetch(`${API_BASE}/cards?${params.toString()}`, {
    headers: buildHeaders(options.apiKey),
    signal: options.signal
  });
  if (!res.ok) {
    throw new Error(`pokemon-holo-cards: search failed (HTTP ${res.status})`);
  }
  const body = await res.json();
  return body.data.map(apiCardToProps);
}

// src/custom-masks.json
var custom_masks_default = {
  "dp3-001": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/dp3-001.png",
  "dv1-001": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/dv1-001.png",
  "hgss1-105": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-105.png",
  "hgss1-106": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-106.png",
  "hgss1-107": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-107.png",
  "hgss1-108": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-108.png",
  "hgss1-109": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-109.png",
  "hgss1-110": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss1-110.png",
  "hgss2-084": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-084.png",
  "hgss2-085": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-085.png",
  "hgss2-086": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-086.png",
  "hgss2-087": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-087.png",
  "hgss2-088": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-088.png",
  "hgss2-089": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss2-089.png",
  "hgss3-081": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-081.png",
  "hgss3-082": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-082.png",
  "hgss3-083": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-083.png",
  "hgss3-084": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-084.png",
  "hgss3-085": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-085.png",
  "hgss3-086": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss3-086.png",
  "hgss4-091": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-091.png",
  "hgss4-092": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-092.png",
  "hgss4-093": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-093.png",
  "hgss4-094": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-094.png",
  "hgss4-095": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-095.png",
  "hgss4-096": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-096.png",
  "hgss4-097": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-097.png",
  "hgss4-098": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/hgss4-098.png",
  "neo3-065": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/neo3-065.png",
  "sm35-009": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-009.png",
  "sm35-027": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-027.png",
  "sm35-040": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-040.png",
  "sm35-042": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-042.png",
  "sm35-056": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-056.png",
  "sm35-057": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sm35-057.png",
  "sv1-223": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv1-223.png",
  "sv1-240": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv1-240.png",
  "sv4pt5-092": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-092.png",
  "sv4pt5-093": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-093.png",
  "sv4pt5-094": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-094.png",
  "sv4pt5-095": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-095.png",
  "sv4pt5-096": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-096.png",
  "sv4pt5-097": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-097.png",
  "sv4pt5-098": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-098.png",
  "sv4pt5-099": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-099.png",
  "sv4pt5-100": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-100.png",
  "sv4pt5-101": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-101.png",
  "sv4pt5-102": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-102.png",
  "sv4pt5-103": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-103.png",
  "sv4pt5-104": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-104.png",
  "sv4pt5-105": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-105.png",
  "sv4pt5-106": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-106.png",
  "sv4pt5-107": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-107.png",
  "sv4pt5-108": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-108.png",
  "sv4pt5-109": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-109.png",
  "sv4pt5-110": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-110.png",
  "sv4pt5-111": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-111.png",
  "sv4pt5-112": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-112.png",
  "sv4pt5-113": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-113.png",
  "sv4pt5-114": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-114.png",
  "sv4pt5-115": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-115.png",
  "sv4pt5-116": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-116.png",
  "sv4pt5-117": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-117.png",
  "sv4pt5-118": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-118.png",
  "sv4pt5-119": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-119.png",
  "sv4pt5-120": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-120.png",
  "sv4pt5-121": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-121.png",
  "sv4pt5-122": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-122.png",
  "sv4pt5-123": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-123.png",
  "sv4pt5-124": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-124.png",
  "sv4pt5-125": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-125.png",
  "sv4pt5-126": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-126.png",
  "sv4pt5-127": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-127.png",
  "sv4pt5-128": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-128.png",
  "sv4pt5-129": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-129.png",
  "sv4pt5-130": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-130.png",
  "sv4pt5-131": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-131.png",
  "sv4pt5-132": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-132.png",
  "sv4pt5-133": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-133.png",
  "sv4pt5-134": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-134.png",
  "sv4pt5-135": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-135.png",
  "sv4pt5-136": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-136.png",
  "sv4pt5-137": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-137.png",
  "sv4pt5-138": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-138.png",
  "sv4pt5-139": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-139.png",
  "sv4pt5-140": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-140.png",
  "sv4pt5-141": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-141.png",
  "sv4pt5-142": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-142.png",
  "sv4pt5-143": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-143.png",
  "sv4pt5-144": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-144.png",
  "sv4pt5-145": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-145.png",
  "sv4pt5-146": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-146.png",
  "sv4pt5-147": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-147.png",
  "sv4pt5-148": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-148.png",
  "sv4pt5-149": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-149.png",
  "sv4pt5-150": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-150.png",
  "sv4pt5-151": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-151.png",
  "sv4pt5-152": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-152.png",
  "sv4pt5-153": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-153.png",
  "sv4pt5-154": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-154.png",
  "sv4pt5-155": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-155.png",
  "sv4pt5-156": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-156.png",
  "sv4pt5-157": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-157.png",
  "sv4pt5-158": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-158.png",
  "sv4pt5-159": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-159.png",
  "sv4pt5-160": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-160.png",
  "sv4pt5-161": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-161.png",
  "sv4pt5-162": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-162.png",
  "sv4pt5-163": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-163.png",
  "sv4pt5-164": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-164.png",
  "sv4pt5-165": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-165.png",
  "sv4pt5-166": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-166.png",
  "sv4pt5-167": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-167.png",
  "sv4pt5-168": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-168.png",
  "sv4pt5-169": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-169.png",
  "sv4pt5-170": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-170.png",
  "sv4pt5-171": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-171.png",
  "sv4pt5-172": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-172.png",
  "sv4pt5-173": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-173.png",
  "sv4pt5-174": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-174.png",
  "sv4pt5-175": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-175.png",
  "sv4pt5-176": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-176.png",
  "sv4pt5-177": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-177.png",
  "sv4pt5-178": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-178.png",
  "sv4pt5-179": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-179.png",
  "sv4pt5-180": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-180.png",
  "sv4pt5-181": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-181.png",
  "sv4pt5-182": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-182.png",
  "sv4pt5-183": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-183.png",
  "sv4pt5-184": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-184.png",
  "sv4pt5-185": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-185.png",
  "sv4pt5-186": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-186.png",
  "sv4pt5-187": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-187.png",
  "sv4pt5-188": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-188.png",
  "sv4pt5-189": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-189.png",
  "sv4pt5-190": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-190.png",
  "sv4pt5-191": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-191.png",
  "sv4pt5-192": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-192.png",
  "sv4pt5-193": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-193.png",
  "sv4pt5-194": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-194.png",
  "sv4pt5-195": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-195.png",
  "sv4pt5-196": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-196.png",
  "sv4pt5-197": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-197.png",
  "sv4pt5-198": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-198.png",
  "sv4pt5-199": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-199.png",
  "sv4pt5-200": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-200.png",
  "sv4pt5-201": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-201.png",
  "sv4pt5-202": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-202.png",
  "sv4pt5-203": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-203.png",
  "sv4pt5-204": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-204.png",
  "sv4pt5-205": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-205.png",
  "sv4pt5-206": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-206.png",
  "sv4pt5-207": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-207.png",
  "sv4pt5-208": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-208.png",
  "sv4pt5-209": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-209.png",
  "sv4pt5-210": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-210.png",
  "sv4pt5-211": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/sv4pt5-211.png",
  "swsh4-044": "https://cdn.jsdelivr.net/npm/pokemon-holo-cards@1.3.0/public/masks/swsh4-044.png"
};
var Spring = class {
  constructor(stiffness, damping, initial = 0) {
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
  set(v) {
    this.target = v;
  }
  snap(v) {
    this.target = v;
    this.value = v;
    this.velocity = 0;
  }
};
var CDN = "https://poke-holo.b-cdn.net";
var customMasks = custom_masks_default;
function getCustomMaskUrl(setId, cardNumber) {
  var _a;
  if (!setId || !cardNumber) return null;
  const key = `${setId.toLowerCase()}-${cardNumber.toLowerCase().padStart(3, "0")}`;
  return (_a = customMasks[key]) != null ? _a : null;
}
var RARITY_MAP = {
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
  // Illustration Rare = full-bleed painted art (screen blend — gentler than color-dodge on full-art)
  "illustration rare": "illustration rare",
  // Special Illustration Rare = premium full-art (soft pearlescent shimmer, NOT harsh rainbow bars)
  "special illustration rare": "rare rainbow alt",
  // Hyper Rare = own CSS class (gold card, embossed UV texture)
  "hyper rare": "hyper rare",
  // Shiny Rare = shiny pokemon in SV sets (etched sunpillar, no sv-prefix card numbers)
  "shiny rare": "rare shiny v",
  // Shiny Ultra Rare = shiny ex full-arts (etched swsecret)
  "shiny ultra rare": "rare shiny vmax",
  // ACE SPEC Rare = special item cards (etched sunpillar)
  "ace spec rare": "rare ultra",
  // ── SWSH era aliases ──────────────────────────────────────────────────────
  "rare holo ex": "rare holo v",
  "basic v": "rare holo v",
  // ── SM era ────────────────────────────────────────────────────────────────
  "rare holo gx": "rare holo v",
  // GX Pokémon — same foil treatment as V
  "rare shiny gx": "rare shiny vmax",
  // Shiny GX (Hidden Fates shiny vault)
  "rare prism star": "rare ultra",
  // Prism Star full-arts
  // ── DP / Platinum era ─────────────────────────────────────────────────────
  "rare holo lv.x": "rare holo v",
  // LV.X special evolutions
  // ── HGSS era ──────────────────────────────────────────────────────────────
  "rare prime": "rare prime",
  // Prime cards — galaxy foil on artwork+border
  "legend": "rare holo",
  // LEGEND paired cards
  // ── XY era ────────────────────────────────────────────────────────────────
  "rare break": "rare holo",
  // BREAK evolution cards
  // ── B&W era ───────────────────────────────────────────────────────────────
  "rare ace": "rare ultra",
  // ACE SPEC items
  "black white rare": "rare holo",
  // Standard holo from B&W sets
  // ── EX / Neo era ──────────────────────────────────────────────────────────
  "rare holo star": "rare holo",
  // Star rares (★) from EX era
  "rare shining": "rare holo",
  // Shining Pokémon (Neo / SM shining)
  // ── Special / Modern ──────────────────────────────────────────────────────
  "mega hyper rare": "hyper rare",
  // Gold variant (newest sets)
  "classic collection": "rare ultra"
  // Classic Collection (Celebrations / 151)
};
function getCssRarity(rarity) {
  var _a;
  if (!rarity) return null;
  const lower = rarity.toLowerCase();
  if (lower.endsWith(" reverse holo")) return lower;
  return (_a = RARITY_MAP[lower]) != null ? _a : null;
}
function buildFoilUrls(setId, cardNumber, cssRarity, subtypes) {
  const rawSet = setId.toLowerCase();
  const fSet = rawSet.replace(/(tg|gg|sv)/, "");
  if (!fSet.startsWith("swsh") && !rawSet.startsWith("sv") && rawSet !== "pgo") return null;
  const fRarity = cssRarity.toLowerCase();
  const fNumber = cardNumber.toLowerCase().replace("swsh", "").padStart(3, "0");
  const isTg = !!cardNumber.match(/^[tg]g/i);
  const isShinyVault = cardNumber.toLowerCase().startsWith("sv");
  const hasVmax = !!(subtypes == null ? void 0 : subtypes.some((s) => s.toLowerCase() === "vmax"));
  let etch = "holo";
  let style = "reverse";
  if (fRarity === "rare holo") {
    style = "swholo";
  }
  if (fRarity === "double rare") {
    etch = "holo";
    style = "sunpillar";
  }
  if (fRarity === "rare holo cosmos") {
    style = "cosmos";
  }
  if (fRarity === "radiant rare") {
    etch = "etched";
    style = "radiantholo";
  }
  if (fRarity === "rare holo v" || fRarity === "rare holo vunion" || fRarity === "basic v") {
    etch = "holo";
    style = "sunpillar";
  }
  if (fRarity === "rare holo vmax" || fRarity === "rare ultra" || fRarity === "rare holo vstar") {
    etch = "etched";
    style = "sunpillar";
  }
  if (fRarity === "amazing rare" || fRarity === "rare rainbow" || fRarity === "rare secret") {
    etch = "etched";
    style = "swsecret";
  }
  if (fRarity === "hyper rare") {
    etch = "etched";
    style = "swsecret";
  }
  if (fRarity === "rare rainbow alt") {
    etch = "etched";
    style = hasVmax ? "swsecret" : "sunpillar";
  }
  if (fRarity === "trainer gallery rare holo") {
    etch = "holo";
    style = "rainbow";
  }
  if (fRarity === "rare shiny v") {
    etch = "etched";
    style = "sunpillar";
  }
  if (fRarity === "rare shiny vmax") {
    etch = "etched";
    style = "swsecret";
  }
  if (isShinyVault) {
    etch = "etched";
    style = "sunpillar";
    if (fRarity === "rare shiny vmax" || fRarity === "rare holo vmax") {
      style = "swsecret";
    }
  }
  if (isTg) {
    etch = "holo";
    style = "rainbow";
    if (fRarity.includes("rare holo v") || fRarity.includes("rare ultra")) {
      etch = "etched";
      style = "sunpillar";
    }
    if (fRarity.includes("rare secret")) {
      etch = "etched";
      style = "swsecret";
    }
  }
  const foilUrl = `${CDN}/foils/${fSet}/foils/upscaled/${fNumber}_foil_${etch}_${style}_2x.webp`;
  const maskUrl = `${CDN}/foils/${fSet}/masks/upscaled/${fNumber}_foil_${etch}_${style}_2x.webp`;
  return { foilUrl, maskUrl };
}
var HoloCard = (props) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const {
    id: cardId,
    apiKey,
    onClick,
    onFetchError,
    className = "",
    style: styleProp,
    disableZoom = false,
    loadingFallback,
    errorFallback
  } = props;
  const [fetched, setFetched] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    if (!cardId) {
      setFetched(null);
      setFetchError(null);
      return;
    }
    const controller = new AbortController();
    let cancelled = false;
    fetchPokemonCard(cardId, { apiKey, signal: controller.signal }).then((data) => {
      if (!cancelled) setFetched(data);
    }).catch((err) => {
      if (cancelled || err.name === "AbortError") return;
      setFetchError(err);
      onFetchError == null ? void 0 : onFetchError(err);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [cardId, apiKey, onFetchError]);
  const imageUrl = (_b = (_a = fetched == null ? void 0 : fetched.imageUrl) != null ? _a : props.imageUrl) != null ? _b : "";
  const name = (_d = (_c = fetched == null ? void 0 : fetched.name) != null ? _c : props.name) != null ? _d : "Pok\xE9mon Card";
  const rarity = (_e = fetched == null ? void 0 : fetched.rarity) != null ? _e : props.rarity;
  const subtypes = (_f = fetched == null ? void 0 : fetched.subtypes) != null ? _f : props.subtypes;
  const supertype = (_g = fetched == null ? void 0 : fetched.supertype) != null ? _g : props.supertype;
  const setId = (_h = fetched == null ? void 0 : fetched.setId) != null ? _h : props.setId;
  const cardNumber = (_i = fetched == null ? void 0 : fetched.cardNumber) != null ? _i : props.cardNumber;
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const activeRef = useRef(false);
  const [maskLoaded, setMaskLoaded] = useState(false);
  const springs = useRef({
    rotX: new Spring(0.066, 0.25, 0),
    rotY: new Spring(0.066, 0.25, 0),
    bgX: new Spring(0.066, 0.25, 50),
    bgY: new Spring(0.066, 0.25, 50),
    glareX: new Spring(0.066, 0.25, 50),
    glareY: new Spring(0.066, 0.25, 50)
  });
  const cssRarity = getCssRarity(rarity);
  const foilUrls = useMemo(
    () => cssRarity && setId && cardNumber ? buildFoilUrls(setId, cardNumber, cssRarity, subtypes) : null,
    [cssRarity, setId, cardNumber, subtypes]
  );
  const customMaskUrl = getCustomMaskUrl(setId, cardNumber);
  const activeMaskUrl = (_k = (_j = foilUrls == null ? void 0 : foilUrls.maskUrl) != null ? _j : customMaskUrl) != null ? _k : null;
  useEffect(() => {
    if (!activeMaskUrl || typeof window === "undefined") {
      setMaskLoaded(false);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setMaskLoaded(true);
    };
    img.onerror = () => {
      if (!cancelled) setMaskLoaded(false);
    };
    img.src = activeMaskUrl;
    return () => {
      cancelled = true;
    };
  }, [activeMaskUrl]);
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
      (sp) => Math.abs(sp.velocity) > 1e-3
    );
    if (moving || activeRef.current) {
      frameRef.current = requestAnimationFrame(applyVars);
    }
  }, []);
  const updateFromPoint = useCallback((clientX, clientY) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const s = springs.current;
    s.rotX.set(-((px - 0.5) * 100) / 3.5);
    s.rotY.set((py - 0.5) * 100 / 3.5);
    s.bgX.set(37 + px * 26);
    s.bgY.set(33 + py * 34);
    s.glareX.set(px * 100);
    s.glareY.set(py * 100);
    el.style.setProperty("--card-opacity", "1");
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(applyVars);
  }, [applyVars]);
  const handlePointerMove = useCallback((e) => {
    updateFromPoint(e.clientX, e.clientY);
  }, [updateFromPoint]);
  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    activeRef.current = false;
    const s = springs.current;
    s.rotX.set(0);
    s.rotY.set(0);
    s.bgX.set(50);
    s.bgY.set(50);
    s.glareX.set(50);
    s.glareY.set(50);
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
        imageUrl,
        name,
        rarity,
        subtypes,
        supertype,
        setId,
        cardNumber,
        rect: el.getBoundingClientRect()
      }
    }));
  }, [imageUrl, name, rarity, subtypes, supertype, setId, cardNumber, disableZoom]);
  const handleClick = useCallback((e) => {
    triggerZoom();
    onClick == null ? void 0 : onClick(e);
  }, [triggerZoom, onClick]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerZoom();
      onClick == null ? void 0 : onClick(e);
    }
  }, [triggerZoom, onClick]);
  const { seedX, seedY, cosmosX, cosmosY } = useMemo(() => {
    const sx = Math.random();
    const sy = Math.random();
    return {
      seedX: sx,
      seedY: sy,
      cosmosX: Math.floor(sx * 734),
      cosmosY: Math.floor(sy * 1280)
    };
  }, []);
  if (cardId && !fetched && !fetchError) {
    return /* @__PURE__ */ jsx(Fragment, { children: loadingFallback != null ? loadingFallback : /* @__PURE__ */ jsx("div", { className: `holo-card-loading ${className}`, style: styleProp, "aria-busy": "true", "aria-label": "Loading card" }) });
  }
  if (fetchError) {
    return /* @__PURE__ */ jsx(Fragment, { children: errorFallback != null ? errorFallback : /* @__PURE__ */ jsx("div", { className: `holo-card-error ${className}`, style: styleProp, role: "img", "aria-label": "Card unavailable" }) });
  }
  if (!imageUrl) {
    return /* @__PURE__ */ jsx(Fragment, { children: errorFallback != null ? errorFallback : null });
  }
  if (imgError) {
    return /* @__PURE__ */ jsx(Fragment, { children: errorFallback != null ? errorFallback : /* @__PURE__ */ jsx("div", { className: `holo-card-error ${className}`, style: styleProp, role: "img", "aria-label": `${name} failed to load` }) });
  }
  const effectiveRarity = cssRarity != null ? cssRarity : "common";
  const dataAttrs = {
    "data-rarity": effectiveRarity
  };
  if (supertype) dataAttrs["data-supertype"] = supertype.toLowerCase();
  if (subtypes == null ? void 0 : subtypes.length) dataAttrs["data-subtypes"] = subtypes.join(" ").toLowerCase();
  if (cardNumber == null ? void 0 : cardNumber.match(/^[tg]g/i)) dataAttrs["data-trainer-gallery"] = "true";
  const isRhRarity = (_l = cssRarity == null ? void 0 : cssRarity.endsWith("reverse holo")) != null ? _l : false;
  const hasCdnFoil = !!(foilUrls == null ? void 0 : foilUrls.foilUrl) && !isRhRarity && !customMaskUrl;
  const foilStyle = maskLoaded && activeMaskUrl ? {
    ...hasCdnFoil ? { "--foil": `url('${foilUrls.foilUrl}')` } : {},
    "--mask": `url('${activeMaskUrl}')`
  } : {};
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      className: `holo-card${maskLoaded ? " masked" : ""} ${className}`.trim(),
      style: {
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
        ...styleProp
      },
      ...dataAttrs,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: disableZoom ? void 0 : "button",
      tabIndex: disableZoom ? void 0 : 0,
      "aria-label": `${name}${rarity ? `, ${rarity}` : ""}`,
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "holo-card__img",
            src: imageUrl,
            alt: name,
            draggable: false,
            onLoad: (e) => e.currentTarget.classList.add("loaded"),
            onError: () => setImgError(true)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "holo-card__shine" }),
        /* @__PURE__ */ jsx("div", { className: "holo-card__glare" })
      ]
    }
  );
};
var CARD_BACK = "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg";
var CardZoomModal = () => {
  const [phase, setPhase] = useState("idle");
  const [card, setCard] = useState(null);
  const [targetBox, setTargetBox] = useState(null);
  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const close = useCallback(() => {
    setPhase("idle");
    setCard(null);
    setTargetBox(null);
  }, []);
  const runFlip = useCallback((detail) => {
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
      stage.style.marginLeft = `${-detail.rect.width / 2}px`;
      stage.style.marginTop = `${-detail.rect.height / 2}px`;
      const anim = stage.animate(
        [
          { transform: `perspective(1400px) translate(0px,0px) scale(1) rotateY(0deg)` },
          {
            transform: `perspective(1400px) translate(${dx * 0.25}px,${dy * 0.2 - arc}px) scale(${scale * 0.58}) rotateY(90deg)`,
            offset: 0.25
          },
          {
            transform: `perspective(1400px) translate(${dx * 0.5}px,${dy * 0.5 - arc * 0.6}px) scale(${scale * 0.76}) rotateY(180deg)`,
            offset: 0.5
          },
          {
            transform: `perspective(1400px) translate(${dx * 0.75}px,${dy * 0.77 - arc * 0.2}px) scale(${scale * 0.93}) rotateY(270deg)`,
            offset: 0.75
          },
          {
            transform: `perspective(1400px) translate(${dx}px,${dy}px) scale(${scale}) rotateY(360deg)`
          }
        ],
        { duration: 1200, easing: "linear", fill: "forwards" }
      );
      anim.onfinish = () => {
        stage.getAnimations().forEach((a) => a.cancel());
        setTargetBox({
          w: targetW,
          h: targetH,
          left: (vw - targetW) / 2,
          top: (vh - targetH) / 2
        });
        setPhase("open");
      };
    });
  }, []);
  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;
      if (phase !== "idle") return;
      runFlip(detail);
    };
    document.addEventListener("holo-card-zoom", handler);
    return () => document.removeEventListener("holo-card-zoom", handler);
  }, [phase, runFlip]);
  useEffect(() => {
    if (phase === "idle") return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, close]);
  if (phase === "idle" || !card) return null;
  if (typeof document === "undefined") return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: overlayRef,
        className: "holo-zoom-overlay",
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: phase === "open" ? "rgba(0,0,0,0.75)" : "transparent",
          transition: "background 0.3s ease",
          cursor: phase === "open" ? "zoom-out" : "default"
        },
        onClick: phase === "open" ? close : void 0,
        children: [
          phase === "flipping" && /* @__PURE__ */ jsx(
            "div",
            {
              ref: stageRef,
              className: "holo-zoom-stage",
              style: {
                position: "absolute",
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
                pointerEvents: "none"
              },
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: card.imageUrl,
                        alt: card.name,
                        style: {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "4.5% / 3.2%",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden"
                        },
                        draggable: false
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: CARD_BACK,
                        alt: "card back",
                        style: {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "4.5% / 3.2%",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)"
                        },
                        draggable: false
                      }
                    )
                  ]
                }
              )
            }
          ),
          phase === "open" && targetBox && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                left: targetBox.left,
                top: targetBox.top,
                width: targetBox.w,
                height: targetBox.h
              },
              onClick: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsx(
                HoloCard,
                {
                  imageUrl: card.imageUrl,
                  name: card.name,
                  rarity: card.rarity,
                  subtypes: card.subtypes,
                  supertype: card.supertype,
                  setId: card.setId,
                  cardNumber: card.cardNumber,
                  disableZoom: true,
                  style: { width: "100%", height: "100%", cursor: "default" }
                }
              )
            }
          ),
          phase === "open" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: close,
              style: {
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
                justifyContent: "center"
              },
              "aria-label": "Close",
              children: "\xD7"
            }
          )
        ]
      }
    ),
    document.body
  );
};

// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/styles.css
styleInject(':root {\n  --card-radius: 4.55% / 3.5%;\n  --card-edge: hsl(47, 100%, 78%);\n  --card-glow: hsl(175, 100%, 90%);\n  --sunpillar-1: hsl(2, 100%, 73%);\n  --sunpillar-2: hsl(53, 100%, 69%);\n  --sunpillar-3: hsl(93, 100%, 69%);\n  --sunpillar-4: hsl(176, 100%, 76%);\n  --sunpillar-5: hsl(228, 100%, 74%);\n  --sunpillar-6: hsl(283, 100%, 73%);\n}\n.holo-card {\n  --grain: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/grain.webp);\n  --glitter: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/glitter.png);\n  --glittersize: 17%;\n  --sparkle-stars: url(https://raw.githubusercontent.com/itzwoow/pokemon-holo-cards/master/public/sparkle-stars.png);\n  --sparkle-size: 20%;\n  --sunpillar-clr-1: var(--sunpillar-1);\n  --sunpillar-clr-2: var(--sunpillar-2);\n  --sunpillar-clr-3: var(--sunpillar-3);\n  --sunpillar-clr-4: var(--sunpillar-4);\n  --sunpillar-clr-5: var(--sunpillar-5);\n  --sunpillar-clr-6: var(--sunpillar-6);\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  --shift: 1px;\n  --red: #f80e35;\n  --yellow: #eedf10;\n  --green: #21e985;\n  --blue: #0dbde9;\n  --violet: #c929f1;\n  --clip: inset(9.85% 8% 52.85% 8%);\n  --clip-invert: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 47.15%, 91.5% 47.15%, 91.5% 9.85%, 8% 9.85%, 8% 47.15%, 0 50%);\n  --clip-stage: polygon(91.5% 9.85%, 57% 9.85%, 54% 12%, 17% 12%, 16% 14%, 12% 16%, 8% 16%, 8% 47.15%, 92% 47.15%);\n  --clip-borders: inset(2.8% 4% round 2.55% / 1.5%);\n  --clip-trainer: inset(14.5% 8.5% 48.2% 8.5%);\n  --foil-op: 0;\n  --glitter-op: 0;\n  --grain-op: 0;\n  --tex-grain-url: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/grain.webp);\n  --tex-glitter-url: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/glitter.png);\n  --pointer-x: 50%;\n  --pointer-y: 50%;\n  --background-x: 50%;\n  --background-y: 50%;\n  --card-opacity: 0;\n  --pointer-from-center: 0;\n  --pointer-from-top: 0.5;\n  --pointer-from-left: 0.5;\n  --rotate-x: 0deg;\n  --rotate-y: 0deg;\n  --card-scale: 1;\n  position: relative;\n  width: clamp(145px, 17vw, 195px);\n  aspect-ratio: 0.718;\n  border-radius: var(--card-radius);\n  cursor: crosshair;\n  transform-style: preserve-3d;\n  transform: perspective(900px) rotateY(var(--rotate-x)) rotateX(var(--rotate-y)) scale(var(--card-scale));\n  will-change: transform, box-shadow;\n  transition: box-shadow .4s ease;\n  z-index: calc(var(--card-scale) * 2);\n  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, .9), 0 0 0 1px rgba(255, 255, 255, .04);\n}\n.holo-card:hover,\n.holo-card.interacting {\n  box-shadow:\n    0 0 3px -1px white,\n    0 0 3px 1px var(--card-edge),\n    0 0 12px 2px var(--card-glow),\n    0 10px 20px -5px black,\n    0 0 40px -30px var(--card-glow),\n    0 0 50px -20px var(--card-glow);\n}\n.holo-card.water {\n  --card-glow: hsl(192,97%,60%);\n}\n.holo-card.fire {\n  --card-glow: hsl(9,81%,59%);\n}\n.holo-card.grass {\n  --card-glow: hsl(96,81%,65%);\n}\n.holo-card.lightning {\n  --card-glow: hsl(54,87%,63%);\n}\n.holo-card.psychic {\n  --card-glow: hsl(281,62%,58%);\n}\n.holo-card.fighting {\n  --card-glow: rgb(145,90,39);\n}\n.holo-card.darkness {\n  --card-glow: hsl(189,77%,27%);\n}\n.holo-card.metal {\n  --card-glow: hsl(184,20%,70%);\n}\n.holo-card.dragon {\n  --card-glow: hsl(51,60%,35%);\n}\n.holo-card.fairy {\n  --card-glow: hsl(323,100%,89%);\n}\n.holo-card.colorless {\n  --card-glow: hsl(45,30%,70%);\n}\n.holo-card__img {\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  display: block;\n  object-fit: cover;\n  user-select: none;\n  -webkit-user-drag: none;\n  opacity: 0;\n  transition: opacity .5s ease;\n}\n.holo-card__img.loaded {\n  opacity: 1;\n}\n.holo-card__shine,\n.holo-card__glare {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  overflow: hidden;\n  will-change:\n    opacity,\n    background-position,\n    filter;\n}\n.holo-card__shine {\n  filter: brightness(.7) contrast(1.5) saturate(.5);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n  z-index: 3;\n}\n.holo-card__shine::before,\n.holo-card__shine::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  --sunpillar-clr-1: var(--sunpillar-5);\n  --sunpillar-clr-2: var(--sunpillar-6);\n  --sunpillar-clr-3: var(--sunpillar-1);\n  --sunpillar-clr-4: var(--sunpillar-2);\n  --sunpillar-clr-5: var(--sunpillar-3);\n  --sunpillar-clr-6: var(--sunpillar-4);\n}\n.holo-card__shine::after {\n  --sunpillar-clr-1: var(--sunpillar-6);\n  --sunpillar-clr-2: var(--sunpillar-1);\n  --sunpillar-clr-3: var(--sunpillar-2);\n  --sunpillar-clr-4: var(--sunpillar-3);\n  --sunpillar-clr-5: var(--sunpillar-4);\n  --sunpillar-clr-6: var(--sunpillar-5);\n}\n.holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, .65) 10%,\n      hsla(0, 0%, 100%, .45) 20%,\n      hsla(0, 0%, 0%, .5) 90%);\n  opacity: calc(var(--card-opacity) * 0.65);\n  mix-blend-mode: overlay;\n  z-index: 4;\n}\n.holo-card__glare::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n}\n.holo-card__tex-foil,\n.holo-card__tex-glitter,\n.holo-card__tex-grain {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  z-index: 1;\n}\n.holo-card__tex-foil {\n  background-image: var(--foil, none);\n  background-size: var(--imgsize, cover);\n  background-position: var(--background-x, 50%) var(--background-y, 50%);\n  mix-blend-mode: screen;\n  opacity: var(--foil-op, 0);\n}\n.holo-card__tex-glitter {\n  background-image: var(--tex-glitter-url, url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/glitter.png));\n  background-size: var(--glittersize, 17%);\n  background-position: center;\n  mix-blend-mode: color-dodge;\n  opacity: var(--glitter-op, 0);\n}\n.holo-card__tex-grain {\n  background-image: var(--tex-grain-url, url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/grain.webp));\n  background-size: 180px 100%;\n  background-position: center;\n  mix-blend-mode: soft-light;\n  opacity: var(--grain-op, 0);\n}\n.holo-card.masked .holo-card__shine,\n.holo-card.masked .holo-card__shine::before,\n.holo-card.masked .holo-card__shine::after {\n  -webkit-mask-image: var(--mask);\n  mask-image: var(--mask);\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  -webkit-mask-position: center center;\n  mask-position: center center;\n  -webkit-mask-mode: luminance;\n  mask-mode: luminance;\n}\n.holo-card {\n  --foil-brightness: 0.55;\n}\n.holo-card.lightning {\n  --foil-brightness: 0.7;\n}\n.holo-card.darkness {\n  --foil-brightness: 0.8;\n}\n.holo-card.metal {\n  --foil-brightness: 0.6;\n}\n.holo-card {\n  --rh-border-strips:\n    linear-gradient(\n      to bottom,\n      #fff 9.85%,\n      transparent 9.85%),\n    linear-gradient(\n      to top,\n      #fff 52.85%,\n      transparent 52.85%),\n    linear-gradient(\n      to right,\n      #fff 8%,\n      transparent 8%),\n    linear-gradient(\n      to left,\n      #fff 8.5%,\n      transparent 8.5%);\n}\n[data-rarity$="reverse holo"]:not(.masked) .holo-card__shine {\n  -webkit-mask-image: var(--rh-border-strips);\n  -webkit-mask-composite: source-over;\n  mask-image: var(--rh-border-strips);\n  mask-composite: add;\n}\n[data-rarity$="reverse holo"] .holo-card__shine {\n  background-image:\n    radial-gradient(\n      circle at var(--pointer-x) var(--pointer-y),\n      #fff 5%,\n      #000 50%,\n      #fff 80%),\n    linear-gradient(\n      -45deg,\n      #000 15%,\n      #fff,\n      #000 85%),\n    var(--grain);\n  background-blend-mode: soft-light, difference;\n  background-size:\n    120% 120%,\n    200% 200%,\n    cover;\n  background-position:\n    center center,\n    calc(100% * var(--pointer-from-left)) calc(100% * var(--pointer-from-top)),\n    center center;\n  filter: brightness(var(--foil-brightness)) contrast(1.5) saturate(1);\n  mix-blend-mode: color-dodge;\n  opacity: calc((1.5 * var(--card-opacity)) - var(--pointer-from-center));\n}\n[data-rarity$="reverse holo"] .holo-card__glare {\n  opacity: var(--card-opacity);\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, .8) 10%,\n      hsla(0, 0%, 100%, .5) 20%,\n      hsla(0, 0%, 0%, .75) 90%);\n  filter: brightness(.7) contrast(1.5);\n}\n[data-rarity$="reverse holo"] .holo-card__glare::after {\n  content: "";\n  opacity: var(--card-opacity);\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 10%,\n      hsla(0, 0%, 100%, .5) 20%,\n      hsla(0, 0%, 0%, .5) 120%);\n  filter: brightness(1) contrast(1.5);\n}\n[data-rarity="rare holo"][data-subtypes*=stage] .holo-card__shine,\n[data-rarity="rare holo"][data-subtypes*=stage] .holo-card__glare::after {\n  clip-path: var(--clip-stage);\n}\n[data-rarity="rare holo"][data-supertype=trainer] .holo-card__shine,\n[data-rarity="rare holo"][data-supertype=trainer] .holo-card__glare::after {\n  clip-path: var(--clip-trainer);\n}\n[data-rarity="rare holo"] .holo-card__shine {\n  --scanlines: 1px;\n  --bars: 3%;\n  clip-path: var(--clip);\n  background-image:\n    repeating-linear-gradient(\n      110deg,\n      var(--violet),\n      var(--blue),\n      var(--green),\n      var(--yellow),\n      var(--red),\n      var(--violet),\n      var(--blue),\n      var(--green),\n      var(--yellow),\n      var(--red),\n      var(--violet),\n      var(--blue),\n      var(--green),\n      var(--yellow),\n      var(--red)),\n    repeating-linear-gradient(\n      90deg,\n      #000 calc(var(--scanlines)*0),\n      #000 calc(var(--scanlines)*2),\n      #666 calc(var(--scanlines)*2),\n      #666 calc(var(--scanlines)*4));\n  background-position: calc(((50% - var(--background-x)) * 2.6) + 50%) calc(((50% - var(--background-y)) * 3.5) + 50%), center center;\n  background-size: 400% 400%, cover;\n  background-blend-mode: overlay;\n  filter: brightness(1.1) contrast(1.1) saturate(1.2);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare holo"] .holo-card__shine::before {\n  background-image:\n    repeating-linear-gradient(\n      90deg,\n      #000 calc(var(--bars)*2),\n      rgba(180, 180, 180, 1) calc(var(--bars)*3),\n      #000 calc(var(--bars)*3.5),\n      rgba(180, 180, 180, 1) calc(var(--bars)*4),\n      #000 calc(var(--bars)*5),\n      #000 calc(var(--bars)*14)),\n    repeating-linear-gradient(\n      90deg,\n      #000 calc(var(--bars)*2),\n      rgba(180, 180, 180, 1) calc(var(--bars)*3),\n      #000 calc(var(--bars)*3.5),\n      rgba(180, 180, 180, 1) calc(var(--bars)*4),\n      #000 calc(var(--bars)*5),\n      #000 calc(var(--bars)*10));\n  background-position: calc((((50% - var(--background-x))*1.65) + 50%) + (var(--background-y)*0.5)) var(--background-x), calc((((50% - var(--background-x))*-.9) + 50%) - (var(--background-y)*.75)) var(--background-y);\n  background-size: 200% 200%, 200% 200%;\n  background-blend-mode: screen;\n  filter: brightness(1.15) contrast(1.1);\n  mix-blend-mode: hard-light;\n}\n[data-rarity="rare holo"] .holo-card__shine::after {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 90%, .8) 0%,\n      hsla(0, 0%, 78%, .1) 25%,\n      hsl(0, 0%, 0%) 90%);\n  mix-blend-mode: luminosity;\n  filter: brightness(0.6) contrast(4);\n}\n[data-rarity="rare holo"] .holo-card__glare {\n  opacity: calc(var(--card-opacity) * .8);\n  filter: brightness(0.8) contrast(1.5);\n  mix-blend-mode: overlay;\n}\n[data-rarity="rare holo"] .holo-card__glare::after {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(180, 100%, 95%) 5%,\n      hsla(0, 0%, 39%, .25) 55%,\n      hsla(0, 0%, 0%, .36) 110%);\n  mix-blend-mode: overlay;\n  filter: brightness(.6) contrast(3);\n}\n[data-rarity="rare holo cosmos"][data-subtypes*=stage] .holo-card__shine,\n[data-rarity="rare holo cosmos"][data-subtypes*=stage] .holo-card__glare::after {\n  clip-path: var(--clip-stage);\n}\n[data-rarity="rare holo cosmos"][data-supertype=trainer] .holo-card__shine,\n[data-rarity="rare holo cosmos"][data-supertype=trainer] .holo-card__glare::after {\n  clip-path: var(--clip-trainer);\n}\n[data-rarity="rare holo cosmos"] .holo-card__shine {\n  --space: 4%;\n  clip-path: var(--clip);\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-bottom.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(180, 100%, 89%, .5) 5%,\n      hsla(180, 14%, 57%, .3) 40%,\n      hsl(0, 0%, 0%) 130%);\n  background-blend-mode: color-burn, multiply;\n  background-position:\n    center center,\n    calc(10% + (var(--pointer-from-left) * 80%)) calc(10% + (var(--pointer-from-top) * 80%)),\n    center center;\n  background-size:\n    cover,\n    400% 900%,\n    cover;\n  filter: brightness(1) contrast(1) saturate(.8);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare holo cosmos"] .holo-card__shine::before {\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-middle-trans.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12));\n  background-blend-mode: lighten, multiply;\n  background-position: center center, calc(15% + (var(--pointer-from-left) * 70%)) calc(15% + (var(--pointer-from-top) * 70%));\n  background-size: cover, 400% 900%;\n  filter: brightness(1.25) contrast(1.75) saturate(.8);\n  mix-blend-mode: overlay;\n}\n[data-rarity="rare holo cosmos"] .holo-card__shine::after {\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-top-trans.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12));\n  background-blend-mode: multiply, multiply;\n  background-position: center center, calc(20% + (var(--pointer-from-left) * 60%)) calc(20% + (var(--pointer-from-top) * 60%));\n  background-size: cover, 400% 900%;\n  filter: brightness(1.25) contrast(1.75) saturate(.8);\n  mix-blend-mode: multiply;\n}\n[data-rarity="rare holo cosmos"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(204, 100%, 95%, .8) 5%,\n      hsla(250, 15%, 20%, 1) 150%);\n  filter: brightness(.75) contrast(2) saturate(2);\n  mix-blend-mode: overlay;\n  opacity: calc(var(--card-opacity) * (0.25 + var(--pointer-from-center)));\n}\n[data-rarity="rare holo cosmos"] .holo-card__glare::after {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(280, 100%, 96%) 5%,\n      hsl(0, 0%, 10%) 60%);\n  filter: brightness(.75) contrast(2.5) saturate(2);\n  mix-blend-mode: soft-light;\n  opacity: calc(1 - var(--pointer-from-top) * .75);\n}\n[data-rarity="rare prime"][data-subtypes*=stage] .holo-card__shine,\n[data-rarity="rare prime"][data-subtypes*=stage] .holo-card__glare::after {\n  clip-path: polygon(91.5% 10%, 57% 10%, 54% 12%, 17% 12%, 16% 14%, 12% 16%, 8% 16%, 8% 52%, 92% 52%);\n}\n[data-rarity="rare prime"][data-supertype=trainer] .holo-card__shine,\n[data-rarity="rare prime"][data-supertype=trainer] .holo-card__glare::after {\n  clip-path: var(--clip-trainer);\n}\n[data-rarity="rare prime"] .holo-card__shine {\n  --space: 4%;\n  clip-path: inset(10% 7% 48% 7%);\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-bottom.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(180, 100%, 89%, .5) 5%,\n      hsla(180, 14%, 57%, .3) 40%,\n      hsl(0, 0%, 0%) 130%);\n  background-blend-mode: color-burn, multiply;\n  background-position:\n    center center,\n    calc(10% + (var(--pointer-from-left) * 80%)) calc(10% + (var(--pointer-from-top) * 80%)),\n    center center;\n  background-size:\n    cover,\n    400% 900%,\n    cover;\n  filter: brightness(1.1) contrast(1.1) saturate(.8);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare prime"] .holo-card__shine::before {\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-middle-trans.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12));\n  background-blend-mode: lighten, multiply;\n  background-position: center center, calc(15% + (var(--pointer-from-left) * 70%)) calc(15% + (var(--pointer-from-top) * 70%));\n  background-size: cover, 400% 900%;\n  filter: brightness(1.25) contrast(1.75) saturate(.8);\n  mix-blend-mode: overlay;\n}\n[data-rarity="rare prime"] .holo-card__shine::after {\n  background-image:\n    url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/cosmos-top-trans.png),\n    repeating-linear-gradient(\n      82deg,\n      hsl(53, 65%, 60%) calc(var(--space)*1),\n      hsl(93, 56%, 50%) calc(var(--space)*2),\n      hsl(176, 54%, 49%) calc(var(--space)*3),\n      hsl(228, 59%, 55%) calc(var(--space)*4),\n      hsl(283, 60%, 55%) calc(var(--space)*5),\n      hsl(326, 59%, 51%) calc(var(--space)*6),\n      hsl(326, 59%, 51%) calc(var(--space)*7),\n      hsl(283, 60%, 55%) calc(var(--space)*8),\n      hsl(228, 59%, 55%) calc(var(--space)*9),\n      hsl(176, 54%, 49%) calc(var(--space)*10),\n      hsl(93, 56%, 50%) calc(var(--space)*11),\n      hsl(53, 65%, 60%) calc(var(--space)*12));\n  background-blend-mode: multiply, multiply;\n  background-position: center center, calc(20% + (var(--pointer-from-left) * 60%)) calc(20% + (var(--pointer-from-top) * 60%));\n  background-size: cover, 400% 900%;\n  filter: brightness(1.25) contrast(1.75) saturate(.8);\n  mix-blend-mode: multiply;\n}\n[data-rarity="rare prime"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(204, 100%, 95%, .6) 5%,\n      hsla(250, 15%, 20%, 1) 150%);\n  filter: brightness(.75) contrast(2) saturate(2);\n  mix-blend-mode: overlay;\n  opacity: calc(var(--card-opacity) * (0.3 + var(--pointer-from-center)));\n}\n[data-rarity="rare prime"] .holo-card__glare::after {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(280, 100%, 96%) 5%,\n      hsl(0, 0%, 10%) 60%);\n  filter: brightness(.75) contrast(2.5) saturate(2);\n  mix-blend-mode: soft-light;\n  opacity: calc(1 - var(--pointer-from-top) * .75);\n}\n[data-rarity="rare holo v"]:not(.masked) .holo-card__shine {\n  filter: brightness(.95) contrast(1.85) saturate(.9);\n}\n[data-rarity="rare holo v"] .holo-card__shine,\n[data-rarity="rare holo v"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: 500px;\n  background-image:\n    var(--grain),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-blend-mode:\n    screen,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize) 100%,\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  background-position:\n    center,\n    0% var(--background-y),\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y);\n  filter: brightness(.8) contrast(2.95) saturate(.65);\n}\n[data-rarity="rare holo v"] .holo-card__shine::after {\n  content: "";\n  background-position:\n    center,\n    0% var(--background-y),\n    calc(var(--background-x) * -1) calc(var(--background-y) * -1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize) 100%,\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(1) contrast(2.5) saturate(1.75);\n  mix-blend-mode: soft-light;\n}\n[data-rarity="rare holo v"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(210, 3%, 54%, .33) 45%,\n      hsla(0, 0%, 20%, .9) 130%);\n  opacity: calc(var(--card-opacity) * .5);\n  mix-blend-mode: hard-light;\n  filter: brightness(.9) contrast(1.75);\n}\n[data-rarity="rare holo vmax"]:not(.masked) .holo-card__shine,\n[data-rarity="rare holo vmax"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/vmaxbg.jpg);\n  --imgsize: 60% 30%;\n}\n[data-rarity="rare holo vmax"] .holo-card__shine {\n  --space: 6%;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      -33deg,\n      hsl(2, 70%, 47%) calc(var(--space)*1),\n      hsl(228, 60%, 64%) calc(var(--space)*2),\n      hsl(176, 55%, 39%) calc(var(--space)*3),\n      hsl(123, 68%, 35%) calc(var(--space)*4),\n      hsl(283, 75%, 57%) calc(var(--space)*5),\n      hsl(2, 70%, 47%) calc(var(--space)*6)),\n    repeating-linear-gradient(\n      133deg,\n      hsla(227, 53%, 12%, .5) 0%,\n      hsl(180, 10%, 50%) 2.5%,\n      hsl(83, 50%, 35%) 5%,\n      hsl(180, 10%, 50%) 7.5%,\n      hsla(227, 53%, 12%, .5) 10%,\n      hsla(227, 53%, 12%, .5) 15%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(189, 76%, 77%, .6) 0%,\n      hsla(147, 59%, 77%, .6) 25%,\n      hsla(271, 55%, 69%, .6) 50%,\n      hsla(355, 56%, 72%, .6) 75%);\n  background-blend-mode:\n    difference,\n    luminosity,\n    soft-light;\n  background-size:\n    var(--imgsize),\n    1100% 1100%,\n    600% 600%,\n    200% 200%;\n  background-position:\n    center,\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y);\n  filter: brightness(calc((var(--pointer-from-center) * .4) + .4)) contrast(2) saturate(1);\n}\n[data-rarity="rare holo vmax"] .holo-card__shine::after {\n  background-image:\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      133deg,\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%);\n  background-blend-mode: hue, hard-light;\n  background-size: 200% 700%, 300% 100%;\n  background-position: 0% var(--background-y), var(--background-x) var(--background-y);\n  mix-blend-mode: lighten;\n  opacity: calc((0.3 * var(--card-opacity)) + var(--card-opacity) * var(--pointer-from-center) * 0.5);\n  filter: saturate(1.5);\n}\n[data-rarity="rare holo vmax"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, .75) 0%,\n      hsl(0, 0%, 0%) 120%);\n  mix-blend-mode: hard-light;\n  filter: brightness(1) contrast(1);\n  opacity: calc((0.2 * var(--card-opacity)) + var(--card-opacity) * var(--pointer-from-center) * 0.8);\n}\n[data-rarity="rare holo vstar"]:not(.masked) .holo-card__shine,\n[data-rarity="rare holo vstar"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/ancient.png);\n  --imgsize: 18% 15%;\n  background-blend-mode:\n    exclusion,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*.25)+.35)) contrast(1.8) saturate(1.75);\n}\n[data-rarity="rare holo vstar"]:not(.masked) .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.75)+.5)) contrast(1.5) saturate(1.5);\n}\n[data-rarity="rare holo vstar"]:not(.masked) .holo-card__glare {\n  filter: brightness(.55) contrast(2);\n}\n.holo-card.masked[data-rarity="rare holo vstar"] .holo-card__shine,\n.holo-card.masked[data-rarity="rare holo vstar"] .holo-card__shine::before,\n.holo-card.masked[data-rarity="rare holo vstar"] .holo-card__shine::after {\n  -webkit-mask-image:\n    var(--mask),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, 0) 0%,\n      hsla(0, 0%, 100%, .5) 120%);\n  mask-image:\n    var(--mask),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, 0) 0%,\n      hsla(0, 0%, 100%, .5) 120%);\n}\n[data-rarity="rare holo vstar"] .holo-card__shine,\n[data-rarity="rare holo vstar"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize),\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  background-position:\n    center center,\n    0% var(--background-y),\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y);\n  filter: brightness(calc((var(--pointer-from-center)*.75)+.25)) contrast(2) saturate(1.25);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare holo vstar"] .holo-card__shine::after {\n  background-size:\n    var(--imgsize),\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc(var(--background-x)*-1) calc(var(--background-y)*-1),\n    var(--background-x) var(--background-y);\n  filter: brightness(calc((var(--pointer-from-center)*.75)+.5)) contrast(1.5) saturate(1.5);\n  mix-blend-mode: exclusion;\n}\n[data-rarity="rare holo vstar"] .holo-card__shine::before {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(190, 7%, 80%, .75) 0%,\n      hsla(260, 7%, 50%, .25) 45%,\n      hsl(310, 7%, 50%) 120%);\n  mix-blend-mode: hard-light;\n  z-index: 2;\n  opacity: 0.8;\n}\n[data-rarity="rare holo vstar"] .holo-card__glare {\n  filter: brightness(.7) contrast(2);\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(195, 90%, 90%) 5%,\n      hsl(300, 3%, 60%) 60%,\n      hsl(350, 0%, 15%) 150%);\n  mix-blend-mode: hard-light;\n  opacity: calc(var(--card-opacity) * (var(--pointer-from-center)*.75));\n}\n[data-rarity="rare ultra"]:not(.masked) .holo-card__shine,\n[data-rarity="rare ultra"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/illusion.png);\n  --imgsize: 33%;\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*.25)+.3)) contrast(1.3) saturate(1.1);\n}\n[data-rarity="rare ultra"]:not(.masked) .holo-card__shine::before {\n  content: none;\n  display: none;\n}\n[data-rarity="rare ultra"]:not(.masked) .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.4)+.7)) contrast(1.3) saturate(1.1);\n}\n[data-rarity="rare ultra"] .holo-card__shine,\n[data-rarity="rare ultra"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      90deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-position:\n    center center,\n    var(--background-x) 50%,\n    calc(var(--background-x) + (var(--background-y)*.15)) var(--background-y),\n    var(--background-x) var(--background-y);\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize),\n    300% 200%,\n    300% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*0.3)+.35)) contrast(1.2) saturate(1.8);\n  mix-blend-mode: color-dodge;\n  opacity: calc(var(--card-opacity) * .9);\n}\n[data-rarity="rare ultra"] .holo-card__shine::after {\n  background-position:\n    center center,\n    calc(var(--background-x) * -1) 50%,\n    calc((var(--background-x) + (var(--background-y)*.15)) * -1) calc(var(--background-y)*-1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize),\n    300% 200%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*.35)+.7)) contrast(1.3) saturate(1.1);\n  mix-blend-mode: exclusion;\n}\n[data-rarity="rare ultra"] .holo-card__shine::before {\n  -webkit-mask-image: none;\n  mask-image: none;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(0, 0%, 0%, 0) 45%);\n  background-position: center;\n  background-size: cover;\n  mix-blend-mode: overlay;\n  opacity: 0.6;\n  z-index: 1;\n}\n[data-rarity="rare ultra"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner ellipse at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 85%) 5%,\n      hsl(200, 8%, 35%) 55%,\n      hsl(320, 40%, 10%) 140%);\n  background-size: 140% 160%;\n  mix-blend-mode: hard-light;\n  filter: brightness(1) contrast(1.2) saturate(1);\n  opacity: calc(var(--card-opacity) * .65);\n}\n[data-rarity="rare rainbow"] {\n  --r-clr-1: hsl(0,57%,37%);\n  --r-clr-2: hsl(40,53%,39%);\n  --r-clr-3: hsl(90,60%,35%);\n  --r-clr-4: hsl(180,60%,35%);\n  --r-clr-5: hsl(180,60%,35%);\n  --r-clr-6: hsl(210,57%,39%);\n  --r-clr-7: hsl(280,55%,31%);\n}\n[data-rarity="rare rainbow"]:not(.masked) .holo-card__shine {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/illusion-mask.png);\n  --imgsize: 33%;\n}\n[data-rarity="rare rainbow"] .holo-card__shine {\n  background-image:\n    linear-gradient(\n      -45deg,\n      var(--r-clr-1),\n      var(--r-clr-5)),\n    var(--glitter),\n    linear-gradient(\n      -30deg,\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1));\n  background-blend-mode: luminosity, soft-light;\n  background-size:\n    200% 200%,\n    var(--glittersize) var(--glittersize),\n    400% 400%;\n  background-position:\n    calc(25% + (50% * var(--pointer-from-left))) calc(25% + (50% * var(--pointer-from-top))),\n    center center,\n    calc(25% + (var(--pointer-x) / 2)) calc(25% + (var(--pointer-y) / 2));\n  filter: brightness(calc((var(--pointer-from-center)*0.2)+0.5)) contrast(1.8) saturate(0.85);\n  mix-blend-mode: screen;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare rainbow"] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--glitter),\n    linear-gradient(\n      -60deg,\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1));\n  background-blend-mode: soft-light;\n  background-size: var(--glittersize) var(--glittersize), 400% 400%;\n  background-position: center center, var(--pointer-x) var(--pointer-y);\n  filter: brightness(calc((var(--pointer-from-center)*0.2)+0.45)) contrast(1.75) saturate(0.9);\n  mix-blend-mode: overlay;\n}\n[data-rarity="rare rainbow"] .holo-card__shine::before {\n  background-image: var(--foil);\n  background-size: var(--imgsize);\n  background-position: center center;\n  filter: brightness(1.2) contrast(1.1);\n  opacity: calc((var(--pointer-from-center) + .2) * .35);\n  background-blend-mode: difference;\n  mix-blend-mode: darken;\n}\n[data-rarity="rare rainbow"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 90%, .8),\n      hsla(187, 10%, 75%, .2) 40%,\n      hsla(197, 6%, 20%, .9) 120%);\n  filter: brightness(.85) contrast(1.6);\n  opacity: calc(var(--pointer-from-center) * 0.4);\n  mix-blend-mode: hard-light;\n}\n[data-rarity="rare rainbow alt"],\n[data-rarity="rare holo vmax"][data-trainer-gallery=true] {\n  --r-clr-1: hsl(0, 57%, 37%);\n  --r-clr-2: hsl(40, 53%, 39%);\n  --r-clr-3: hsl(90, 60%, 35%);\n  --r-clr-4: hsl(180, 60%, 35%);\n  --r-clr-5: hsl(180, 60%, 35%);\n  --r-clr-6: hsl(210, 57%, 39%);\n  --r-clr-7: hsl(280, 55%, 31%);\n}\n[data-rarity="rare rainbow alt"]:not(.masked) .holo-card__shine,\n[data-rarity="rare holo vmax"][data-trainer-gallery=true]:not(.masked) .holo-card__shine {\n  --foil: none;\n  --imgsize: 25% auto;\n  filter: brightness(calc((var(--pointer-from-center)*0.2)+0.25)) contrast(1.6) saturate(1.05);\n  mix-blend-mode: soft-light;\n  opacity: calc(var(--card-opacity) * 0.75);\n}\n[data-rarity="rare rainbow alt"]:not(.masked) .holo-card__shine::after {\n  opacity: calc(0.45 + (var(--pointer-from-center) * 0.15));\n  mix-blend-mode: soft-light;\n}\n[data-rarity="rare rainbow alt"] .holo-card__shine,\n[data-rarity="rare holo vmax"][data-trainer-gallery=true] .holo-card__shine {\n  --space: 5%;\n  background-image:\n    repeating-linear-gradient(\n      var(--angle),\n      hsla(283, 49%, 60%, .75) calc(var(--space)*1),\n      hsla(2, 70%, 58%, .75) calc(var(--space)*2),\n      hsla(53, 67%, 53%, .75) calc(var(--space)*3),\n      hsla(93, 56%, 52%, .75) calc(var(--space)*4),\n      hsla(176, 38%, 50%, .75) calc(var(--space)*5),\n      hsla(228, 100%, 77%, .75) calc(var(--space)*6),\n      hsla(283, 49%, 61%, .75) calc(var(--space)*7)),\n    var(--glitter),\n    linear-gradient(\n      -30deg,\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1));\n  background-size:\n    200% 400%,\n    var(--glittersize) var(--glittersize),\n    400% 400%;\n  background-position:\n    0% calc(var(--background-y)*1),\n    center center,\n    calc(var(--background-x)*1.5) calc(var(--background-y)*1.5);\n  background-blend-mode: luminosity, overlay;\n  filter: brightness(calc((var(--pointer-from-center)*0.3)+0.3)) contrast(3) saturate(1.8);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare rainbow alt"] .holo-card__shine::after,\n[data-rarity="rare holo vmax"][data-trainer-gallery=true] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--glitter),\n    linear-gradient(\n      -60deg,\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1));\n  background-blend-mode: overlay;\n  background-size: var(--glittersize) var(--glittersize), 400% 400%;\n  background-position: center center, calc(var(--background-x)*-1.5) calc(var(--background-y)*-1.5);\n  filter: brightness(calc((var(--pointer-from-center)*0.5)+0.6)) contrast(3) saturate(1);\n  mix-blend-mode: color-dodge;\n  opacity: calc(1.2 + (var(--pointer-from-center)/2) * -1);\n}\n[data-rarity="rare rainbow alt"] .holo-card__shine::before,\n[data-rarity="rare holo vmax"][data-trainer-gallery=true] .holo-card__shine::before {\n  content: "";\n  background-image: var(--foil);\n  background-size: var(--imgsize);\n  background-position: center center;\n  filter: brightness(1.5) contrast(1.5);\n  opacity: calc((var(--pointer-from-center) + 0.6) * 0.4);\n  background-blend-mode: difference;\n  mix-blend-mode: color-dodge;\n}\n[data-rarity="rare rainbow alt"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 20%, 90%, .75) 0%,\n      hsla(150, 20%, 30%, .65) 45%,\n      hsla(0, 0%, 0%, 1) 100%);\n  filter: brightness(.9) contrast(2);\n  opacity: calc(var(--card-opacity) * 0.75);\n}\n[data-rarity="rare secret"]:not(.masked) .holo-card__shine {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/geometric.png);\n  --imgsize: 33%;\n  filter: brightness(calc((var(--pointer-from-center)*.3)+.2)) contrast(2) saturate(.75);\n}\n[data-rarity="rare secret"] .holo-card__shine {\n  --shift: 1px;\n  --imgsize: cover;\n  background-image:\n    var(--glitter),\n    var(--glitter),\n    conic-gradient(\n      var(--sunpillar-clr-4),\n      var(--sunpillar-clr-5),\n      var(--sunpillar-clr-6),\n      var(--sunpillar-clr-1),\n      var(--sunpillar-clr-4)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(150, 0%, 0%, .98) 10%,\n      hsla(0, 0%, 95%, .15) 90%);\n  background-size:\n    var(--glittersize) var(--glittersize),\n    var(--glittersize) var(--glittersize),\n    cover,\n    cover;\n  background-position:\n    45% 45%,\n    55% 55%,\n    center center,\n    center center;\n  background-blend-mode:\n    soft-light,\n    hard-light,\n    overlay;\n  mix-blend-mode: color-dodge;\n  filter: brightness(calc(.4 + (var(--pointer-from-center)*.2))) contrast(1) saturate(2.7);\n}\n[data-rarity="rare secret"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--foil),\n    linear-gradient(\n      45deg,\n      hsl(46, 95%, 50%),\n      hsl(52, 100%, 69%)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(10, 20%, 90%, .95) 10%,\n      hsl(0, 0%, 0%) 70%);\n  background-size:\n    var(--imgsize),\n    cover,\n    cover;\n  background-position:\n    center center,\n    center center,\n    center center;\n  background-blend-mode: hard-light, multiply;\n  mix-blend-mode: lighten;\n  filter: brightness(1.25) contrast(1.25) saturate(0.35);\n  opacity: .8;\n}\n[data-rarity="rare secret"] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image: var(--glitter);\n  background-size: var(--glittersize) var(--glittersize);\n  background-position: calc(50% - ((var(--shift)*2) * var(--pointer-from-left)) + var(--shift)) calc(50% - ((var(--shift)*2) * var(--pointer-from-top)) + var(--shift));\n  filter: brightness(calc((var(--pointer-from-center)*.6)+.6)) contrast(1.5);\n  mix-blend-mode: overlay;\n}\n[data-rarity="rare secret"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(45, 8%, 80%, .3) 0%,\n      hsl(22, 15%, 12%) 180%);\n  filter: brightness(1.3) contrast(1.5);\n  mix-blend-mode: hard-light;\n}\n.holo-card[data-rarity="hyper rare"] {\n  --card-glow: hsl(46, 80%, 58%);\n  --card-edge: hsl(46, 90%, 74%);\n}\n.holo-card[data-rarity="hyper rare"]:hover,\n.holo-card[data-rarity="hyper rare"].interacting {\n  box-shadow:\n    0 0 2px 0px hsl(48, 90%, 88%),\n    0 0 5px 1px hsl(47, 85%, 64%),\n    0 0 14px 2px hsl(45, 80%, 50%),\n    0 10px 22px -5px black,\n    0 0 32px -14px hsl(44, 80%, 48%);\n}\n.holo-card[data-rarity="hyper rare"]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  z-index: 5;\n  pointer-events: none;\n  background-image: var(--glitter);\n  background-size: var(--glittersize) var(--glittersize);\n  background-position: calc(50% + (var(--pointer-from-left) - .5) * -10px) calc(50% + (var(--pointer-from-top) - .5) * -10px);\n  mix-blend-mode: screen;\n  filter: brightness(calc(var(--pointer-from-center) * 0.5 + 0.1)) contrast(4) saturate(0.12) sepia(1) hue-rotate(5deg);\n  opacity: calc(var(--card-opacity) * 0.14);\n}\n[data-rarity="hyper rare"]:not(.masked) .holo-card__shine {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/geometric.png);\n  --imgsize: 30%;\n  filter: brightness(calc((var(--pointer-from-center) * 0.25) + 0.18)) contrast(2.2) saturate(0.2) sepia(0.85) hue-rotate(-4deg);\n}\n[data-rarity="hyper rare"] .holo-card__shine {\n  --shift: 1px;\n  --imgsize: 30%;\n  background-image:\n    var(--glitter),\n    repeating-linear-gradient(\n      55deg,\n      transparent 0%,\n      transparent 4.2%,\n      rgba(255, 215, 0, .06) 4.4%,\n      transparent 4.6%,\n      transparent 8.8%),\n    conic-gradient(\n      at var(--pointer-x) var(--pointer-y),\n      hsl(34, 85%, 48%),\n      hsl(43, 95%, 64%),\n      hsl(50, 100%, 78%),\n      hsl(45, 92%, 66%),\n      hsl(38, 82%, 54%),\n      hsl(30, 86%, 44%),\n      hsl(34, 85%, 48%)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 100%, 96%, .90) 0%,\n      hsla(46, 90%, 64%, .55) 30%,\n      hsla(36, 70%, 38%, .30) 60%,\n      hsla(26, 65%, 15%, .85) 92%);\n  background-size:\n    var(--glittersize) var(--glittersize),\n    cover,\n    cover,\n    cover;\n  background-position:\n    calc(var(--background-x) * 1%) calc(var(--background-y) * 1%),\n    center center,\n    center center,\n    center center;\n  background-blend-mode:\n    soft-light,\n    overlay,\n    hard-light;\n  mix-blend-mode: color-dodge;\n  filter: brightness(calc(0.28 + (var(--pointer-from-center) * 0.26))) contrast(1.65) saturate(1.10) sepia(0.30) hue-rotate(4deg);\n}\n[data-rarity="hyper rare"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--foil),\n    linear-gradient(\n      135deg,\n      hsl(30, 95%, 32%),\n      hsl(42, 100%, 54%),\n      hsl(50, 100%, 76%),\n      hsl(44, 95%, 60%),\n      hsl(34, 95%, 40%)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(48, 100%, 96%, .88) 0%,\n      hsla(44, 85%, 54%, .38) 40%,\n      hsl(28, 55%, 8%) 80%);\n  background-size:\n    var(--imgsize),\n    cover,\n    cover;\n  background-position:\n    center,\n    center,\n    center;\n  background-blend-mode: hard-light, multiply;\n  mix-blend-mode: lighten;\n  filter: brightness(1.3) contrast(1.3) saturate(0.18) sepia(0.9) hue-rotate(-6deg);\n  opacity: 0.65;\n}\n[data-rarity="hyper rare"] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image: var(--glitter);\n  background-size: var(--glittersize) var(--glittersize);\n  background-position: calc(50% - ((var(--shift) * 3) * var(--pointer-from-left)) + (var(--shift) * 1.5)) calc(50% - ((var(--shift) * 3) * var(--pointer-from-top)) + (var(--shift) * 1.5));\n  filter: brightness(calc((var(--pointer-from-center) * 0.7) + 0.4)) contrast(2.2) saturate(0.15) sepia(1) hue-rotate(0deg);\n  mix-blend-mode: overlay;\n  opacity: 0.70;\n}\n[data-rarity="hyper rare"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(48, 95%, 95%, .45) 0%,\n      hsla(46, 82%, 68%, .20) 25%,\n      hsla(38, 60%, 36%, .06) 55%,\n      hsl(28, 55%, 8%) 180%);\n  filter: brightness(1.35) contrast(1.7);\n  mix-blend-mode: hard-light;\n}\n[data-rarity="amazing rare"]:not(.masked) .holo-card__shine {\n  clip-path: var(--clip);\n}\n[data-rarity="amazing rare"]:not(.masked) .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, 1) 10%,\n      hsla(0, 0%, 100%, .85) 20%,\n      hsla(0, 0%, 0%, .35) 90%);\n  mix-blend-mode: multiply;\n}\n[data-rarity="amazing rare"] .holo-card__shine {\n  background-image:\n    var(--glitter),\n    var(--glitter),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(150, 20%, 10%, 1) 10%,\n      hsla(177, 22%, 80%, .1) 50%,\n      hsla(0, 0%, 95%, .98) 90%);\n  background-size:\n    var(--glittersize) var(--glittersize),\n    var(--glittersize) var(--glittersize),\n    cover;\n  background-position:\n    40% 45%,\n    55% 55%,\n    center center;\n  background-blend-mode: soft-light, color-burn;\n  filter: brightness(1) contrast(1) saturate(.9);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="amazing rare"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--foil),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 20%, 90%, .95) 10%,\n      rgba(181, 139, 164, .5) 50%,\n      hsl(0, 0%, 0%) 60%);\n  background-size: cover, cover;\n  background-position: center center, center center;\n  background-blend-mode: color-burn;\n  mix-blend-mode: lighten;\n  filter: brightness(1) contrast(1) saturate(1);\n  opacity: 0.5;\n}\n[data-rarity="amazing rare"] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    repeating-linear-gradient(\n      var(--angle),\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7));\n  background-size: 400% 800%;\n  background-position: calc(50% + (50% - var(--background-x))*3) calc(50% + (50% - var(--background-y))*3);\n  filter: brightness(calc(0.75 - (var(--pointer-from-center)*0.5))) contrast(1) saturate(1);\n  mix-blend-mode: saturation;\n}\n.holo-card.masked[data-rarity="amazing rare"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 20%, 90%, .45) 0%,\n      hsla(150, 20%, 30%, .45) 45%,\n      hsla(0, 0%, 0%, .9) 120%);\n  filter: brightness(.9) contrast(2);\n}\n.holo-card.masked[data-rarity="amazing rare"] .holo-card__glare::after {\n  content: "";\n  -webkit-mask-image: var(--mask);\n  mask-image: var(--mask);\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 20%, 90%, .75) 0%,\n      hsla(150, 20%, 30%, .65) 45%,\n      hsla(0, 0%, 0%, 1) 90%);\n  filter: brightness(1) contrast(1.5);\n  mix-blend-mode: overlay;\n  opacity: 1;\n}\n[data-rarity="radiant rare"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/trainerbg.png);\n  --imgsize: 25% auto;\n  background-blend-mode: difference;\n}\n[data-rarity="radiant rare"] .holo-card__shine {\n  clip-path: var(--clip-borders);\n  --barwidth: 1.2%;\n  --space: 200px;\n  --imgsize: cover;\n  background-image:\n    radial-gradient(\n      farthest-corner ellipse at calc((var(--pointer-x))*0.5 + 25%) calc((var(--pointer-y))*0.5 + 25%),\n      hsl(0, 0%, 95%) 20%,\n      var(--card-glow) 130%),\n    repeating-linear-gradient(\n      45deg,\n      hsl(0, 0%, 10%) 0%,\n      hsl(0, 0%, 10%) 1%,\n      hsl(0, 0%, 10%) var(--barwidth),\n      hsl(0, 0%, 20%) calc(var(--barwidth) + 0.01%),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*2),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*2 + 0.01%),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*3),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*3 + 0.01%),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*4),\n      hsl(0, 0%, 50%) calc(var(--barwidth)*4 + 0.01%),\n      hsl(0, 0%, 50%) calc(var(--barwidth)*5),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*5 + 0.01%),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*6),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*6 + 0.01%),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*7),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*7 + 0.01%),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*8),\n      hsl(0, 0%, 10%) calc(var(--barwidth)*8 + 0.01%),\n      hsl(0, 0%, 10%) calc(var(--barwidth)*9),\n      hsl(0, 0%, 0%) calc(var(--barwidth)*9 + 0.01%),\n      hsl(0, 0%, 0%) calc(var(--barwidth)*10)),\n    repeating-linear-gradient(\n      -45deg,\n      hsl(0, 0%, 10%) 0%,\n      hsl(0, 0%, 10%) 1%,\n      hsl(0, 0%, 10%) var(--barwidth),\n      hsl(0, 0%, 20%) calc(var(--barwidth) + 0.01%),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*2),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*2 + 0.01%),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*3),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*3 + 0.01%),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*4),\n      hsl(0, 0%, 50%) calc(var(--barwidth)*4 + 0.01%),\n      hsl(0, 0%, 50%) calc(var(--barwidth)*5),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*5 + 0.01%),\n      hsl(0, 0%, 42.5%) calc(var(--barwidth)*6),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*6 + 0.01%),\n      hsl(0, 0%, 35%) calc(var(--barwidth)*7),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*7 + 0.01%),\n      hsl(0, 0%, 20%) calc(var(--barwidth)*8),\n      hsl(0, 0%, 10%) calc(var(--barwidth)*8 + 0.01%),\n      hsl(0, 0%, 10%) calc(var(--barwidth)*9),\n      hsl(0, 0%, 0%) calc(var(--barwidth)*9 + 0.01%),\n      hsl(0, 0%, 0%) calc(var(--barwidth)*10));\n  background-size:\n    cover,\n    210% 210%,\n    210% 210%;\n  background-position:\n    center,\n    calc(((var(--background-x)-50%)*1.5)+50%) calc(((var(--background-y)-50%)*1.5)+50%),\n    calc(((var(--background-x)-50%)*1.5)+50%) calc(((var(--background-y)-50%)*1.5)+50%);\n  background-blend-mode:\n    exclusion,\n    darken,\n    color-dodge;\n  filter: brightness(.5) contrast(2) saturate(1.75);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="radiant rare"] .holo-card__shine::after {\n  clip-path: var(--clip);\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      55deg,\n      hsl(3, 95%, 85%) calc(var(--space)*1),\n      hsl(207, 100%, 84%) calc(var(--space)*2),\n      hsl(29, 100%, 85%) calc(var(--space)*3),\n      hsl(160, 100%, 86%) calc(var(--space)*4),\n      hsl(309, 94%, 87%) calc(var(--space)*5),\n      hsl(188, 95%, 85%) calc(var(--space)*6),\n      hsl(3, 95%, 85%) calc(var(--space)*7));\n  background-size: var(--imgsize), 400% 100%;\n  background-position: center, calc(((var(--background-x)-50%)*-2.5)+50%) calc(((var(--background-y)-50%)*-2.5)+50%);\n  filter: brightness(.6) contrast(3) saturate(2);\n  mix-blend-mode: color-dodge;\n  background-blend-mode: hard-light;\n}\n[data-rarity="radiant rare"] .holo-card__shine::before {\n  z-index: 2;\n  background-image:\n    var(--glitter),\n    radial-gradient(\n      farthest-corner ellipse at calc(((var(--pointer-x))*0.5)+25%) calc(((var(--pointer-y))*0.5)+25%),\n      hsla(0, 0%, 58%, .8) 10%,\n      hsla(0, 0%, 20%, .9) 20%,\n      hsla(0, 0%, 20%, .5) 50%);\n  background-size: 15% 15%, 350% 350%;\n  background-position: center;\n  background-blend-mode: color-dodge;\n  mix-blend-mode: overlay;\n  filter: brightness(.66) contrast(2) saturate(.5);\n}\n[data-rarity="radiant rare"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, .33) 0%,\n      hsl(0, 0%, 25%) 110%);\n  filter: brightness(1) contrast(1.5);\n  mix-blend-mode: hard-light;\n}\n[data-rarity="rare shiny"]:not(.masked) .holo-card__shine,\n[data-rarity="rare shiny"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/illusion.png);\n  --imgsize: 33%;\n  background-blend-mode:\n    exclusion,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*.3)+.35)) contrast(2) saturate(1.5);\n}\n[data-rarity="rare shiny"]:not(.masked) .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.4)+.5)) contrast(1.4) saturate(1.2);\n  mix-blend-mode: difference;\n}\n[data-rarity="rare shiny"] .holo-card__shine {\n  clip-path: var(--clip);\n}\n[data-rarity="rare shiny"] .holo-card__shine,\n[data-rarity="rare shiny"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc(var(--background-x) + (var(--background-y)*0.2)) var(--background-y),\n    var(--background-x) var(--background-y);\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize),\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*0.4)+.4)) contrast(1.4) saturate(2.25);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare shiny"] .holo-card__shine::after {\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc((var(--background-x)+(var(--background-y)*0.2))*-1) calc(var(--background-y)*-1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize),\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*.4)+.8)) contrast(1.5) saturate(1.25);\n  mix-blend-mode: exclusion;\n}\n[data-rarity="rare shiny"] .holo-card__shine::before {\n  -webkit-mask-image: none;\n  mask-image: none;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(0, 0%, 0%, 0) 40%);\n  background-position: center;\n  background-size: cover;\n  mix-blend-mode: overlay;\n  opacity: 0.75;\n  z-index: 1;\n}\n[data-rarity="rare shiny"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsl(320, 5%, 15%) 150%);\n  background-size: cover;\n  mix-blend-mode: multiply;\n  filter: brightness(1.2) contrast(1) saturate(.7);\n  opacity: calc(var(--card-opacity) * var(--pointer-from-center));\n}\n[data-rarity="rare shiny v"]:not(.masked) .holo-card__shine,\n[data-rarity="rare shiny v"]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/illusion.png);\n  --imgsize: 33%;\n  background-blend-mode:\n    exclusion,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*.3)+.35)) contrast(2) saturate(1.5);\n}\n[data-rarity="rare shiny v"]:not(.masked) .holo-card__shine::before {\n  content: none;\n  display: none;\n}\n[data-rarity="rare shiny v"]:not(.masked) .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.5)+.8)) contrast(1.6) saturate(1.4);\n}\n[data-rarity="rare shiny v"] .holo-card__shine,\n[data-rarity="rare shiny v"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, 0.1) 12%,\n      hsla(0, 0%, 0%, 0.15) 20%,\n      hsla(0, 0%, 0%, 0.25) 120%);\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc(var(--background-x) + (var(--background-y)*0.2)) var(--background-y),\n    var(--background-x) var(--background-y);\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize),\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*0.4) + .4)) contrast(1.4) saturate(2.25);\n}\n[data-rarity="rare shiny v"] .holo-card__shine::after {\n  content: "";\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc((var(--background-x) + (var(--background-y)*0.2)) * -1) calc(var(--background-y) * -1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize),\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*.4) + .8)) contrast(1.5) saturate(1.25);\n  mix-blend-mode: exclusion;\n}\n[data-rarity="rare shiny v"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none;\n  mask-image: none;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(0, 0%, 0%, 0) 40%);\n  background-position: center;\n  background-size: cover;\n  mix-blend-mode: overlay;\n  opacity: 0.75;\n  z-index: 1;\n}\n[data-rarity="rare shiny v"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 90%) 5%,\n      hsl(200, 5%, 45%) 80%,\n      hsl(320, 40%, 10%) 150%);\n  background-size: 120% 140%;\n  background-position: center center;\n  mix-blend-mode: darken;\n  filter: brightness(.88) contrast(2.25) saturate(.7);\n  opacity: calc(var(--card-opacity) * var(--pointer-from-center) * 0.75);\n}\n[data-rarity="rare shiny vmax"] .holo-card__shine {\n  --imgsize: cover;\n  --angle: -30deg;\n  --r-clr-1: hsl(0,57%,37%);\n  --r-clr-2: hsl(40,53%,39%);\n  --r-clr-3: hsl(90,60%,35%);\n  --r-clr-4: hsl(180,60%,35%);\n  --r-clr-5: hsl(180,60%,35%);\n  --r-clr-6: hsl(210,57%,39%);\n  --r-clr-7: hsl(280,55%,31%);\n  background-image:\n    var(--glitter),\n    var(--glitter),\n    linear-gradient(\n      var(--angle),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1),\n      var(--r-clr-2),\n      var(--r-clr-3),\n      var(--r-clr-4),\n      var(--r-clr-5),\n      var(--r-clr-6),\n      var(--r-clr-7),\n      var(--r-clr-1)),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(248, 5%, 10%, 1) 10%,\n      hsla(206, 5%, 80%, .1) 50%,\n      hsla(0, 0%, 95%, .98) 90%);\n  background-size:\n    var(--glittersize) var(--glittersize),\n    var(--glittersize) var(--glittersize),\n    400% 400%,\n    cover;\n  background-position:\n    40% 45%,\n    55% 55%,\n    calc(var(--background-x)*1.5) calc(var(--background-y)*1.5),\n    center center;\n  background-blend-mode:\n    soft-light,\n    overlay,\n    color-burn;\n  filter: brightness(1) contrast(1) saturate(.85);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare shiny vmax"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    var(--foil),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(248, 5%, 91%, .95) 10%,\n      hsla(206, 5%, 68%, .5) 50%,\n      hsl(0, 0%, 0%) 120%);\n  background-size: var(--imgsize), cover;\n  background-position: center center, center center;\n  background-blend-mode: color-burn;\n  mix-blend-mode: lighten;\n  filter: brightness(1) contrast(1) saturate(.4);\n  opacity: 0.35;\n}\n[data-rarity="rare shiny vmax"] .holo-card__shine::after {\n  content: "";\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n  background-image:\n    repeating-linear-gradient(\n      var(--angle),\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7));\n  background-size: 400% 800%;\n  background-position: calc(50% + (50% - var(--background-x))*3) calc(50% + (50% - var(--background-y))*3);\n  filter: brightness(calc(0.75 - (var(--pointer-from-center)*0.5))) contrast(1) saturate(1);\n  mix-blend-mode: hue;\n}\n[data-rarity="rare shiny vmax"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(248, 5%, 90%, .45) 0%,\n      hsla(206, 5%, 30%, .45) 45%,\n      hsla(0, 0%, 0%, .33) 120%);\n  filter: brightness(1) contrast(1.25);\n}\n[data-rarity="rare shiny vmax"] .holo-card__glare::after {\n  content: "";\n  -webkit-mask-image: var(--mask);\n  mask-image: var(--mask);\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(248, 5%, 90%, .75) 0%,\n      hsla(206, 5%, 30%, .65) 45%,\n      hsla(0, 0%, 0%, .75) 100%);\n  filter: brightness(1) contrast(1.25);\n  mix-blend-mode: overlay;\n  opacity: 1;\n}\n[data-rarity="trainer gallery rare holo"] .holo-card__shine {\n  --space: 5%;\n  --angle: -22deg;\n  --imgsize: 300% 400%;\n  clip-path: var(--clip-borders);\n  background-image:\n    repeating-linear-gradient(\n      var(--angle),\n      hsla(283, 49%, 60%, .75) calc(var(--space)*1),\n      hsla(2, 74%, 59%, .75) calc(var(--space)*2),\n      hsla(53, 67%, 53%, .75) calc(var(--space)*3),\n      hsla(93, 56%, 52%, .75) calc(var(--space)*4),\n      hsla(176, 38%, 50%, .75) calc(var(--space)*5),\n      hsla(228, 100%, 77%, .75) calc(var(--space)*6),\n      hsla(283, 49%, 61%, .75) calc(var(--space)*7));\n  background-blend-mode: color-dodge;\n  background-size: var(--imgsize);\n  background-position: 0% calc(var(--background-y)*1);\n  filter: brightness(calc((var(--pointer-from-center)*0.3)+0.5)) contrast(2.3) saturate(1);\n}\n[data-rarity="trainer gallery rare holo"] .holo-card__shine::after {\n  content: "";\n  background-image:\n    radial-gradient(\n      farthest-corner ellipse at calc(((var(--pointer-x))*0.5)+25%) calc(((var(--pointer-y))*0.5)+25%),\n      hsl(0, 0%, 100%) 5%,\n      hsla(300, 100%, 11%, .6) 40%,\n      hsl(0, 0%, 22%) 120%);\n  background-position: center center;\n  background-size: 400% 500%;\n  filter: brightness(calc((var(--pointer-from-center)*0.2)+0.4)) contrast(.85) saturate(1.1);\n  mix-blend-mode: hard-light;\n}\n[data-rarity="trainer gallery rare holo"] .holo-card__shine::before {\n  content: none;\n  display: none;\n}\n[data-rarity="trainer gallery rare holo"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 100%, 1) 10%,\n      hsla(0, 0%, 100%, .6) 35%,\n      hsla(180, 11%, 35%, 1) 60%);\n  mix-blend-mode: soft-light;\n}\n[data-rarity="trainer gallery rare holo"] .holo-card__glare::before,\n[data-rarity="trainer gallery rare holo"] .holo-card__glare::after {\n  content: none;\n  display: none;\n}\n[data-rarity="rare ultra"][data-subtypes*=supporter]:not(.masked) .holo-card__shine,\n[data-rarity="rare ultra"][data-subtypes*=supporter]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/trainerbg.png);\n  --imgsize: 20%;\n  background-blend-mode:\n    color-burn,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*0.05)+.6)) contrast(1.5) saturate(1.2);\n}\n[data-rarity="rare ultra"][data-subtypes*=supporter] .holo-card__shine {\n  filter: brightness(calc((var(--pointer-from-center)*0.05)+.8)) contrast(1.75) saturate(1.2);\n}\n[data-rarity="rare ultra"][data-subtypes*=supporter] .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.4)+.85)) contrast(2) saturate(.5);\n}\n[data-rarity="rare ultra"][data-subtypes*=supporter] .holo-card__shine::before {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(0, 0%, 0%, 0) 80%);\n  mix-blend-mode: screen;\n  opacity: 0.5;\n}\n[data-rarity="rare ultra"][data-subtypes*=supporter] .holo-card__glare {\n  opacity: calc(var(--card-opacity)*.75);\n  mix-blend-mode: multiply;\n  filter: brightness(1.5) contrast(1.4) saturate(1);\n  background-size: 170% 170%;\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true]:not(.masked) .holo-card__shine,\n[data-rarity="rare holo v"][data-trainer-gallery=true]:not(.masked) .holo-card__shine::after {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/illusion.png);\n  --imgsize: 33%;\n  background-blend-mode:\n    exclusion,\n    hue,\n    hard-light;\n  filter: brightness(calc((var(--pointer-from-center)*.3)+.35)) contrast(2) saturate(1.5);\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true]:not(.masked) .holo-card__shine::before {\n  content: none;\n  display: none;\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true]:not(.masked) .holo-card__shine::after {\n  filter: brightness(calc((var(--pointer-from-center)*.5)+.8)) contrast(1.6) saturate(1.4);\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true] .holo-card__shine,\n[data-rarity="rare holo v"][data-trainer-gallery=true] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: cover;\n  background-image:\n    var(--foil),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc(var(--background-x) + (var(--background-y)*0.2)) var(--background-y),\n    var(--background-x) var(--background-y);\n  background-blend-mode:\n    soft-light,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize),\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*0.4)+.4)) contrast(1.4) saturate(2.25);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true] .holo-card__shine::after {\n  background-position:\n    center center,\n    0% var(--background-y),\n    calc((var(--background-x)+(var(--background-y)*0.2))*-1) calc(var(--background-y)*-1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize),\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(calc((var(--pointer-from-center)*.4)+.8)) contrast(1.5) saturate(1.25);\n  mix-blend-mode: exclusion;\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true] .holo-card__shine::before {\n  -webkit-mask-image: none;\n  mask-image: none;\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(0, 0%, 0%, 0) 40%);\n  background-position: center;\n  background-size: cover;\n  mix-blend-mode: overlay;\n  opacity: 0.75;\n  z-index: 1;\n}\n[data-rarity="rare holo v"][data-trainer-gallery=true] .holo-card__glare {\n  opacity: calc(var(--card-opacity)*.4);\n}\n[data-rarity="rare holo vmax"][data-trainer-gallery=true] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(50, 30%, 90%) 0%,\n      hsl(162, 5%, 40%),\n      hsl(0, 0%, 0%) 120%);\n  filter: brightness(1) contrast(1);\n  opacity: calc(var(--card-opacity) * var(--pointer-from-center) * 0.85);\n}\n[data-rarity="rare secret"][data-trainer-gallery=true]:not(.masked) .holo-card__shine {\n  --foil: url(https://raw.githubusercontent.com/simeydotme/pokemon-cards-css/main/public/img/geometric.png);\n  --imgsize: 33%;\n  filter: brightness(calc((var(--pointer-from-center)*0.3)+0.2)) contrast(2) saturate(.75);\n}\n[data-rarity="rare secret"][data-trainer-gallery=true]:not(.masked) .holo-card__glare {\n  filter: brightness(.5) contrast(1);\n}\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine,\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine::before,\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine::after {\n  -webkit-mask-image: none !important;\n  mask-image: none !important;\n}\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine {\n  background-image:\n    var(--glitter),\n    var(--glitter),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(152.7, 21.6%, 10%) 10%,\n      hsla(177, 22%, 80%, .1) 50%,\n      hsla(0, 0%, 95%, .98) 90%),\n    linear-gradient(\n      45deg,\n      hsl(46, 95%, 50%),\n      hsl(52, 100%, 69%));\n  background-size:\n    var(--glittersize) var(--glittersize),\n    var(--glittersize) var(--glittersize),\n    cover,\n    cover;\n  background-position:\n    40% 45%,\n    55% 55%,\n    center center,\n    center center;\n  background-blend-mode:\n    soft-light,\n    darken,\n    color;\n  filter: brightness(1) contrast(1) saturate(1);\n  mix-blend-mode: color-dodge;\n  opacity: var(--card-opacity);\n}\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine::before {\n  background-image:\n    var(--foil),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(50, 20%, 90%, .95) 10%,\n      hsla(324, 22%, 63%, .5) 50%,\n      hsl(0, 0%, 0%) 90%);\n  background-size: var(--imgsize), cover;\n  background-blend-mode: color-burn;\n  mix-blend-mode: exclusion;\n  filter: brightness(1) contrast(1) saturate(1);\n  opacity: 1;\n}\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__shine::after {\n  background-image:\n    var(--glitter),\n    conic-gradient(\n      var(--sunpillar-clr-4),\n      var(--sunpillar-clr-5),\n      var(--sunpillar-clr-6),\n      var(--sunpillar-clr-1),\n      var(--sunpillar-clr-2),\n      var(--sunpillar-clr-3),\n      var(--sunpillar-clr-4));\n  background-size: var(--glittersize) var(--glittersize), cover;\n  background-blend-mode: luminosity;\n  filter: brightness(calc((var(--pointer-from-center)*0.5)+0.6)) contrast(2) saturate(3);\n  mix-blend-mode: soft-light;\n}\n[data-rarity="rare secret"][data-trainer-gallery=true] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(40, 100%, 95%, .2) 10%,\n      hsla(40, 20%, 5%, 1) 180%);\n  filter: brightness(1) contrast(1);\n  mix-blend-mode: hard-light;\n}\n.holo-card[data-rarity="rare secret"]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  z-index: 5;\n  pointer-events: none;\n  background-image: var(--glitter);\n  background-size: var(--glittersize) var(--glittersize);\n  background-position: calc(50% + (var(--pointer-from-left) - .5) * -8px) calc(50% + (var(--pointer-from-top) - .5) * -8px);\n  mix-blend-mode: screen;\n  filter: brightness(calc(var(--pointer-from-center)*0.5 + 0.1)) contrast(5) saturate(0.7);\n  opacity: calc(var(--card-opacity) * 0.18);\n}\n[data-rarity="double rare"]:not(.masked) .holo-card__shine {\n  filter: brightness(.95) contrast(1.85) saturate(.9);\n}\n[data-rarity="double rare"] .holo-card__shine {\n  mix-blend-mode: screen;\n}\n[data-rarity="double rare"] .holo-card__shine,\n[data-rarity="double rare"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: 500px;\n  background-image:\n    var(--grain),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-blend-mode:\n    screen,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize) 100%,\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  background-position:\n    center,\n    0% var(--background-y),\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y);\n  filter: brightness(.8) contrast(2.95) saturate(.65);\n}\n[data-rarity="double rare"] .holo-card__shine::after {\n  content: "";\n  background-position:\n    center,\n    0% var(--background-y),\n    calc(var(--background-x) * -1) calc(var(--background-y) * -1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize) 100%,\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(1) contrast(2.5) saturate(1.75);\n  mix-blend-mode: soft-light;\n}\n[data-rarity="double rare"] .holo-card__shine::before {\n  content: "";\n  -webkit-mask-image: none;\n  mask-image: none;\n  background-image: var(--sparkle-stars);\n  background-size: 28% 28%;\n  background-position: calc(50% + (var(--pointer-from-left) - .5) * -18px) calc(50% + (var(--pointer-from-top) - .5) * -18px);\n  mix-blend-mode: screen;\n  filter: brightness(calc(var(--pointer-from-center) * 0.8 + 0.5)) contrast(3) saturate(0.6);\n  opacity: calc(var(--card-opacity) * 0.55);\n}\n[data-rarity="double rare"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(210, 3%, 54%, .33) 45%,\n      hsla(0, 0%, 20%, .9) 130%);\n  opacity: calc(var(--card-opacity) * .5);\n  mix-blend-mode: hard-light;\n  filter: brightness(.9) contrast(1.75);\n}\n[data-rarity="illustration rare"]:not(.masked) .holo-card__shine {\n  filter: brightness(.95) contrast(1.85) saturate(.9);\n}\n[data-rarity="illustration rare"] .holo-card__shine {\n  mix-blend-mode: screen;\n}\n[data-rarity="illustration rare"] .holo-card__shine,\n[data-rarity="illustration rare"] .holo-card__shine::after {\n  --space: 5%;\n  --angle: 133deg;\n  --imgsize: 500px;\n  background-image:\n    var(--grain),\n    repeating-linear-gradient(\n      0deg,\n      var(--sunpillar-clr-1) calc(var(--space)*1),\n      var(--sunpillar-clr-2) calc(var(--space)*2),\n      var(--sunpillar-clr-3) calc(var(--space)*3),\n      var(--sunpillar-clr-4) calc(var(--space)*4),\n      var(--sunpillar-clr-5) calc(var(--space)*5),\n      var(--sunpillar-clr-6) calc(var(--space)*6),\n      var(--sunpillar-clr-1) calc(var(--space)*7)),\n    repeating-linear-gradient(\n      var(--angle),\n      #0e152e 0%,\n      hsl(180, 10%, 60%) 3.8%,\n      hsl(180, 29%, 66%) 4.5%,\n      hsl(180, 10%, 60%) 5.2%,\n      #0e152e 10%,\n      #0e152e 12%),\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsla(0, 0%, 0%, .1) 12%,\n      hsla(0, 0%, 0%, .15) 20%,\n      hsla(0, 0%, 0%, .25) 120%);\n  background-blend-mode:\n    screen,\n    hue,\n    hard-light;\n  background-size:\n    var(--imgsize) 100%,\n    200% 700%,\n    300% 100%,\n    200% 100%;\n  background-position:\n    center,\n    0% var(--background-y),\n    var(--background-x) var(--background-y),\n    var(--background-x) var(--background-y);\n  filter: brightness(.8) contrast(2.95) saturate(.65);\n}\n[data-rarity="illustration rare"] .holo-card__shine::after {\n  content: "";\n  background-position:\n    center,\n    0% var(--background-y),\n    calc(var(--background-x) * -1) calc(var(--background-y) * -1),\n    var(--background-x) var(--background-y);\n  background-size:\n    var(--imgsize) 100%,\n    200% 400%,\n    195% 100%,\n    200% 100%;\n  filter: brightness(1) contrast(2.5) saturate(1.75);\n  mix-blend-mode: soft-light;\n}\n[data-rarity="illustration rare"] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      farthest-corner circle at var(--pointer-x) var(--pointer-y),\n      hsl(0, 0%, 100%) 0%,\n      hsla(210, 3%, 54%, .33) 45%,\n      hsla(0, 0%, 20%, .9) 130%);\n  opacity: calc(var(--card-opacity) * .5);\n  mix-blend-mode: hard-light;\n  filter: brightness(.9) contrast(1.75);\n}\n[data-rarity=common] .holo-card__shine {\n  display: none;\n}\n[data-rarity=common] .holo-card__glare {\n  background-image:\n    radial-gradient(\n      circle at var(--pointer-x) var(--pointer-y),\n      rgba(255, 255, 255, 0.38) 0%,\n      rgba(255, 255, 255, 0.12) 35%,\n      transparent 65%);\n  opacity: var(--card-opacity);\n  mix-blend-mode: overlay;\n}\n');

export { CardZoomModal, HoloCard, apiCardToProps, fetchPokemonCard, searchPokemonCards };
