import { useState, useEffect } from "react";
import store from "store2";
import { getFromApi } from "../utils/api";

export default function useAnime() {
  const stored = store("trending");
  const state = useState(stored || []);
  const [trending, setTrending] = state;

  useEffect(() => {
    if (store.page("initial_trending") === null) {
      getFromApi("/trending/anime").then(rsp => {
        setTrending(rsp);
        store.page("initial_trending", true);
      });
    }
  }, []);

  useEffect(() => {
    if (trending.length === 0) {
      return;
    }
    store.set("trending", trending);
  }, [trending]);

  return state;
}
