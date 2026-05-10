import React from 'react';

interface HoloCardProps {
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
declare const HoloCard: React.FC<HoloCardProps>;

declare const CardZoomModal: React.FC;

/**
 * Minimal Pokémon TCG API v2 client.
 *
 * The public API works without an API key at lower rate limits.
 * Set VITE_POKEMON_TCG_API_KEY (or pass `apiKey`) to raise the limit.
 *
 * Docs: https://docs.pokemontcg.io/
 */
interface PokemonApiCard {
    id: string;
    name: string;
    supertype: string;
    subtypes?: string[];
    rarity?: string;
    number: string;
    set: {
        id: string;
        name: string;
        series: string;
    };
    images: {
        small: string;
        large: string;
    };
}
interface HoloCardData {
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
declare function apiCardToProps(card: PokemonApiCard): HoloCardData;
/** Fetch a single card by its TCG API id (e.g. "swsh4-50"). */
declare function fetchPokemonCard(id: string, options?: FetchOptions): Promise<HoloCardData>;
interface SearchOptions extends FetchOptions {
    /** Results per page (max 250, default 20) */
    pageSize?: number;
    /** Page number, 1-indexed */
    page?: number;
    /** orderBy e.g. "-set.releaseDate,number" */
    orderBy?: string;
}
/** Free-text search — passes `q=<query>` to the API. */
declare function searchPokemonCards(query: string, options?: SearchOptions): Promise<HoloCardData[]>;

export { CardZoomModal, HoloCard, type HoloCardData, type HoloCardProps, type PokemonApiCard, type SearchOptions, apiCardToProps, fetchPokemonCard, searchPokemonCards };
