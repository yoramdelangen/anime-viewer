import { useState, useEffect } from "react";
import store from "lscache";
import { getFromApi } from "../utils/api";

export default function useTrending(subtype) {
  subtype = subtype ? subtype : "watched"; // year , month , all , voted , watched

  const stored = store.get("trending_" + subtype);
  const state = useState(stored || []);
  const [trending, setTrending] = state;

  // in case of loading and state is empty
  useEffect(() => {
    if (trending.length === 0) {
      getFromApi("/best/" + subtype + "?type=all&extended=full").then(rsp => {
        setTrending(rsp);
      });
    }
  }, []);

  useEffect(() => {
    if (trending.length === 0) {
      return;
    }

    store.set("trending_" + subtype, trending, 60);
  }, [trending]);

  return state;
}
