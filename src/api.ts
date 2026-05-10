/**
 * Minimal Pokémon TCG API v2 client.
 *
 * The public API works without an API key at lower rate limits.
 * Set VITE_POKEMON_TCG_API_KEY (or pass `apiKey`) to raise the limit.
 *
 * Docs: https://docs.pokemontcg.io/
 */

const API_BASE = "https://api.pokemontcg.io/v2";

export interface PokemonApiCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  rarity?: string;
  number: string;
  set: { id: string; name: string; series: string };
  images: { small: string; large: string };
}

export interface HoloCardData {
  id: string;
  imageUrl: string;
  name: string;
  rarity?: string;
  subtypes?: string[];
  supertype?: string;
  setId: string;
  cardNumber: string;
}

interface FetchOptions {
  apiKey?: string;
  signal?: AbortSignal;
}

function buildHeaders(apiKey?: string): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) headers["X-Api-Key"] = apiKey;
  return headers;
}

export function apiCardToProps(card: PokemonApiCard): HoloCardData {
  return {
    id: card.id,
    imageUrl: card.images?.large ?? card.images?.small ?? "",
    name: card.name,
    rarity: card.rarity,
    subtypes: card.subtypes,
    supertype: card.supertype,
    setId: card.set?.id ?? "",
    cardNumber: card.number,
  };
}

/** Fetch a single card by its TCG API id (e.g. "swsh4-50"). */
export async function fetchPokemonCard(
  id: string,
  options: FetchOptions = {},
): Promise<HoloCardData> {
  const res = await fetch(`${API_BASE}/cards/${encodeURIComponent(id)}`, {
    headers: buildHeaders(options.apiKey),
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`pokemon-holo-cards: card "${id}" not found (HTTP ${res.status})`);
  }
  const body = (await res.json()) as { data: PokemonApiCard };
  return apiCardToProps(body.data);
}

export interface SearchOptions extends FetchOptions {
  /** Results per page (max 250, default 20) */
  pageSize?: number;
  /** Page number, 1-indexed */
  page?: number;
  /** orderBy e.g. "-set.releaseDate,number" */
  orderBy?: string;
}

/** Free-text search — passes `q=<query>` to the API. */
export async function searchPokemonCards(
  query: string,
  options: SearchOptions = {},
): Promise<HoloCardData[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.page) params.set("page", String(options.page));
  if (options.orderBy) params.set("orderBy", options.orderBy);

  const res = await fetch(`${API_BASE}/cards?${params.toString()}`, {
    headers: buildHeaders(options.apiKey),
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`pokemon-holo-cards: search failed (HTTP ${res.status})`);
  }
  const body = (await res.json()) as { data: PokemonApiCard[] };
  return body.data.map(apiCardToProps);
}
