# pokemon-holo-cards

Animated holographic Pokémon card effects for React. All rarities, CDN-backed foil textures, click-to-zoom with flip animation, full mouse + touch support.

## Install

```bash
npm install pokemon-holo-cards
```

Peer deps: `react >= 17`, `react-dom >= 17`.

## Quick start — by TCG card id (easiest)

```tsx
import { HoloCard, CardZoomModal } from "pokemon-holo-cards";

export default function App() {
  return (
    <>
      <CardZoomModal />
      <HoloCard id="swsh4-50" style={{ width: 300 }} />
    </>
  );
}
```

The `id` prop fetches the card from the public [Pokémon TCG API](https://docs.pokemontcg.io/) and wires up every prop automatically.

## Manual props

If you already have the card data:

```tsx
<HoloCard
  imageUrl="https://images.pokemontcg.io/swsh4/50_hires.png"
  name="Raikou"
  rarity="Amazing Rare"
  subtypes={["Basic"]}
  supertype="Pokémon"
  setId="swsh4"
  cardNumber="050"
  style={{ width: 300 }}
/>
```

## Using the API helpers

```tsx
import { fetchPokemonCard, searchPokemonCards, HoloCard } from "pokemon-holo-cards";

// single card
const card = await fetchPokemonCard("swsh4-50");

// search
const results = await searchPokemonCards("name:charizard rarity:\"Rare Holo VMAX\"", {
  pageSize: 20,
  orderBy: "-set.releaseDate",
});

// Each item is already shaped for <HoloCard {...card} />
results.map(card => <HoloCard key={card.id} {...card} />);
```

Pass your own key for higher rate limits: `fetchPokemonCard(id, { apiKey: "..." })`.

## Props

| prop | type | required | notes |
| --- | --- | --- | --- |
| `id` | `string` | * | TCG API card id (e.g. `"swsh4-50"`). If set, auto-fetches. |
| `imageUrl` | `string` | * | Needed when `id` is not set. |
| `name` | `string` | no | Alt text + zoom label. |
| `rarity` | `string` | no | TCG rarity string — drives the holo style. |
| `subtypes` | `string[]` | no | Affects foil URL (e.g. VMAX). |
| `supertype` | `string` | no | `"Pokémon"` \| `"Trainer"` \| `"Energy"`. |
| `setId` | `string` | no | Required for CDN foil textures. |
| `cardNumber` | `string` | no | Required for CDN foil textures. |
| `apiKey` | `string` | no | Optional TCG API key. |
| `onClick` | `function` | no | Fires on click/Enter/Space. |
| `onFetchError` | `(err) => void` | no | Fires if the API lookup fails. |
| `loadingFallback` | `ReactNode` | no | Rendered while fetching. |
| `errorFallback` | `ReactNode` | no | Rendered on error. |
| `style` / `className` | — | no | Merged into the outer element. |

_* Provide either `id` **or** `imageUrl`._

## `<CardZoomModal />`

Mount **once** at your app root. Listens for clicks on any `<HoloCard>` and plays the flip-zoom animation. Press `Esc` or click outside to close.

## Supported rarities

Reverse Holo · Rare Holo · Cosmos · V · VMAX · VSTAR · V-Union · Ultra/Full Art · Rainbow · Rainbow Alt · Secret Rare · Amazing Rare · Radiant Rare · Shiny V · Shiny VMAX · Trainer Gallery · modern-era aliases (Double Rare, Illustration Rare, Special Illustration Rare, Hyper Rare, etc.).

## Accessibility

Cards render as `role="button"` with `tabIndex=0`. Enter/Space trigger the zoom.

## Credits

Holographic CSS ported from [simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css). Foil textures hosted by [poke-holo.b-cdn.net](https://poke-holo.b-cdn.net).

## License

MIT
