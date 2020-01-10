import React from "react";
import Link from "next/link";

export default function EpisodeCard({ episode, anime }) {
  const { titles, thumbnail, canonicalTitle, number } = episode.attributes;
  const { slug } = anime.attributes;

  return (
    <Link
      href="/show/[id]/[slug]"
      as={`/show/${anime.id}/${slug}?episode=${number}`}
      passHref
    >
      <a className="w-1/2 md:w-1/4 p-2 lg:w-1/6 flex items-center md:block text-left cursor-pointer">
        <img
          className="rounded w-1/2 md:w-full"
          src={thumbnail.original}
          alt={titles.en_us}
        />
        <div className="flex-1 w-full pl-4">
          <h2 className="text-sm text-gray-200 pt-2">Episode {number}</h2>
          <h2 className="text-xs text-gray-500 pb-2 font-thin">
            {canonicalTitle}
          </h2>
        </div>
      </a>
    </Link>
  );
}
