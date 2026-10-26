"use client";

import Image, { type ImageProps } from "next/image";
import { photos, unsplashLoader, type PhotoKey } from "@/lib/photos";

/**
 * A photo from lib/photos.ts, loaded from Unsplash's CDN at the right size for the screen.
 * (A client component because next/image's `loader` prop is a function.)
 */
export function Photo({ k, decorative = false, className = "", style, ...rest }: { k: PhotoKey; decorative?: boolean } & Omit<ImageProps, "src" | "alt" | "loader">) {
  const p = photos[k];
  return (
    <Image
      {...rest}
      src={p.src}
      alt={decorative ? "" : p.alt}
      loader={unsplashLoader}
      className={className}
      style={{ objectPosition: "position" in p ? p.position : undefined, ...style }}
    />
  );
}
