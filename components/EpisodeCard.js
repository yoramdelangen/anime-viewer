import React from "react";
import Router from "next/router";
import { strSlug } from "../utils/helpers";
import Image from "./Image";

export default function EpisodeCard({ episode, anime }) {
  const { title, episode: number } = episode;
  const slug = strSlug(anime.title);
  const _id = anime.ids.simkl;

  function pushNavigation() {
    const query = {
      id: _id,
      episode: number
    };

    Router.push(
      { pathname: "/show/[...id]", query },
      `/show/${_id}/${slug}?episode=${number}`,
      { shallow: true }
    );
  }

  return (
    <button
      onClick={pushNavigation}
      className="w-full sm:w-1/2 md:w-1/4 p-2 lg:w-1/6 flex items-center md:block text-left cursor-pointer"
    >
      <Image
        className={episode.img ? "rounded w-1/2 md:w-full" : "mx-auto h-24"}
        placeholder="/images/vid.svg"
        src={
          episode.img
            ? "episodes/" + episode.img + "_c.webp"
            : "/images/vid.svg"
        }
        alt={title}
      />
      <div className="flex-1 w-full pl-4 md:pl-0">
        <h2 className="text-sm text-gray-200 pt-2">Episode {number}</h2>
        <h2 className="text-xs text-gray-500 font-thin">{title}</h2>
      </div>
    </button>
  );
}
