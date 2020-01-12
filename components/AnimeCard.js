import React from "react";
import Link from "next/link";
import { strSlug } from "../utils/helpers";
import Image from "./Image";

export default function AnimeCard({ anime }) {
  return (
    <Link
      key={anime.ids.simkl_id}
      href="/show/[...id]"
      as={`/show/${anime.ids.simkl_id}/${strSlug(anime.title)}`}
      passHref
    >
      <a className="p-2 w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6 text-left cursor-pointer">
        <Image
          className="rounded"
          placeholder="/images/vid.svg"
          src={"posters/" + anime.poster + "_m.webp"}
          alt={anime.title}
        />
        <h2 className="text-sm text-gray-200 pt-2">{anime.title}</h2>
      </a>
    </Link>
  );
}
