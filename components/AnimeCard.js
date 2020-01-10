import React from "react";
import Link from "next/link";
import { getENTitle } from "../utils/api";

export default function AnimeCard({ anime }) {
  const { titles, posterImage, canonicalTitle, slug } = anime.attributes;

  return (
    <Link href="/show/[id]/[slug]" as={`/show/${anime.id}/${slug}`} passHref>
      <a className="p-2 w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6 text-left cursor-pointer">
        <img className="rounded" src={posterImage.medium} alt={titles.en_us} />
        <h2 className="text-sm text-gray-200 pt-2">{getENTitle(titles)}</h2>
        <h2 className="text-xs text-gray-500 pb-2 font-thin">
          {canonicalTitle}
        </h2>
      </a>
    </Link>
  );
}
