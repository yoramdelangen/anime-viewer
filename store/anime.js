import { useState, useEffect } from "react";
import store from "lscache";
import { getFromApi } from "../utils/api";

export default function useAnime(animeId) {
  const stored = store.get("anime_" + animeId) || null;
  const state = useState(stored);
  const [anime, setAnime] = state;

  // in case of loading and state is empty
  useEffect(() => {
    if (anime === null) {
      getFromApi(`/${animeId}?extended=full`).then(s => {
        setAnime(s);
      });
    }
  }, []);

  useEffect(() => {
    if (anime === null) {
      return;
    }
    store.set("anime_" + animeId, anime, 60);
  }, [anime]);

  return state;
}
