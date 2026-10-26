// Photos of Australian high-rise and residential buildings, served from Unsplash's image CDN (images.unsplash.com).
// All are free to use under the Unsplash License (https://unsplash.com/license): commercial use allowed, no permission
// or attribution required. Credits are still listed on /legal/ as a courtesy.
// Unsplash's CDN (imgix) resizes and converts to AVIF/WebP on the fly, so `unsplashLoader` asks it for each size
// next/image needs instead of re-processing the image on our server.

export type Photo = { src: string; alt: string; credit: string; profile: string; page: string; place: string; position?: string };

export const photos = {
  /** Residential towers on the Swan River at Elizabeth Quay, Perth. */
  elizabethQuay: {
    src: "https://images.unsplash.com/photo-1596826063323-9a60b8d11e72",
    alt: "Residential and office towers beside the Swan River at Elizabeth Quay, Perth",
    credit: "Urlaubstracker",
    profile: "https://unsplash.com/@urlaubstracker",
    page: "https://unsplash.com/photos/ZXgGLpUF8cg",
    place: "Elizabeth Quay, Perth WA",
    position: "70% 50%",
  },
  /** Perth CBD skyline from Kings Park at sunset. */
  perthSunset: {
    src: "https://images.unsplash.com/photo-1662673053425-924b45c185d0",
    alt: "The Perth city skyline and Swan River at sunset, seen from Kings Park",
    credit: "Eddie Mark Blair",
    profile: "https://unsplash.com/@blaireddieau",
    page: "https://unsplash.com/photos/ySzmc-Hozsw",
    place: "Kings Park, Perth WA",
  },
  /** Perth CBD by day from Kings Park. */
  perthDay: {
    src: "https://images.unsplash.com/photo-1683496422145-59a41ac8285e",
    alt: "Perth city towers and the Swan River on a clear day, seen from Kings Park",
    credit: "Paul Arky",
    profile: "https://unsplash.com/@paularky",
    page: "https://unsplash.com/photos/wNTZooTneCY",
    place: "Kings Park, Perth WA",
  },
  /** A glass high-rise from street level. */
  glassTower: {
    src: "https://images.unsplash.com/photo-1655088819260-f15af0a2e45d",
    alt: "Looking up at a glass high-rise tower against a blue sky",
    credit: "J A C K",
    profile: "https://unsplash.com/@jackpm9",
    page: "https://unsplash.com/photos/AUmOcHIUJp4",
    place: "Australia",
  },
  /** A coastal residential tower. */
  coastalTower: {
    src: "https://images.unsplash.com/photo-1737026891193-9d7620a6be80",
    alt: "A residential apartment tower on the Australian coast with the ocean behind",
    credit: "Alexander Cafarella",
    profile: "https://unsplash.com/@alexanderc",
    page: "https://unsplash.com/photos/1EYcYx0c4mg",
    place: "Australia",
  },
  /** Apartment towers above a tree-lined street. */
  apartmentTowers: {
    src: "https://images.unsplash.com/photo-1633296457114-a454aadb5378",
    alt: "Brick and glass apartment towers above a tree-lined street",
    credit: "Josh Chiodo",
    profile: "https://unsplash.com/@joshchiodo",
    page: "https://unsplash.com/photos/E9OPSKO0sZk",
    place: "Australia",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** next/image loader for images.unsplash.com: the CDN does the resizing and format conversion. */
export function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 72}`;
}

/** The photo shown with each service (cards on the homepage and inner pages, and the service-page header). */
export const servicePhoto: Record<"biv" | "whs" | "sfp" | "asb", PhotoKey> = {
  sfp: "perthDay",
  biv: "coastalTower",
  whs: "apartmentTowers",
  asb: "glassTower",
};
