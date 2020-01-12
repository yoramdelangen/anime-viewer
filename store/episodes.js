import { useState, useEffect } from "react";
import store from "lscache";
import { getFromApi, sortAttrBy } from "../utils/api";

async function fetchEpisodes(id) {
  // const query = `sort=-number&page[limit]=${pageLimit}&page[offset]=${offset}`;

  const episodes = await await getFromApi(`/episodes/${id}?extended=full`);
  // let episodes = rsp.;

  return episodes.filter(e => e.type === "episode");
}

export default function useEpisodes(animeId) {
  const stored = store.get("episodes_anime_" + animeId) || null;
  const state = useState(stored || null);
  const [episodes, setEpisdoes] = state;

  // in case of loading and state is empty
  useEffect(() => {
    if (episodes === null) {
      fetchEpisodes(animeId).then(episodes => {
        setEpisdoes(episodes.sort(sortAttrBy("episode")));
      });
    }
  }, []);

  useEffect(() => {
    if (episodes === null) {
      return;
    }
    store.set("episodes_anime_" + animeId, episodes, 60 * 24);
  }, [episodes]);

  return state;
}
