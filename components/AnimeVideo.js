import React from "react";
import Axios from "axios";
import Loading from "./Loading";
import Router from "next/router";
import { SCRAPE_TOKEN } from "../utils/api";

const VIDEO_URL = "https://animegg.org";
const MEDIA_URL = "http://y-proxy-api.d/scrape?url=" + VIDEO_URL;
const ASPECT_RATIO = 16 / 9;

export default function AnimeVideo({ anime, episode, info }) {
  const { slug } = anime.attributes;
  const [isLoading, setLoading] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const options = {
        headers: {
          "X-TOKEN": SCRAPE_TOKEN
        }
      };
      const queryString = `&query=${encodeURIComponent(
        "div#subbed-Animegg iframe[src]"
      )}&attr=src`;

      const url = `${MEDIA_URL}/${slug}-episode-${episode}` + queryString;
      const rsp = await Axios.get(url, options);
      const videoUrl = await rsp.data.result;

      setVideoUrl(VIDEO_URL + videoUrl);
    })();
  }, []);

  const handleClose = () => {
    Router.push(document.location.pathname);
  };

  const ButtonClose = () => (
    <button
      onClick={() => handleClose()}
      className="fixed top-0 right-0 p-4 m-4 z-50"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center p-10">
        <ButtonClose />
        <Loading />
      </div>
    );
  }

  setTimeout(() => {
    const videoFrame = document.getElementById("videoFrame");
    function resizeContainer() {
      const { offsetWidth, offsetHeight } = videoFrame;

      if (offsetWidth > offsetHeight) {
        videoFrame.style.height = offsetWidth / ASPECT_RATIO + "px";
      } else if (offsetHeight > offsetWidth) {
        videoFrame.style.width = offsetHeight / ASPECT_RATIO + "px";
      }
    }

    window.addEventListener("resize", resizeContainer);
    resizeContainer();
  }, 100);

  const episodeDesc = info ? info.attributes.synopsis : "";

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center p-10">
        <ButtonClose />

        <iframe
          id="videoFrame"
          frameBorder="0"
          src={videoUrl}
          className="w-full my-8"
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="text-left px-10">
        <h1 className="text-3xl font-light text-gray-700">Episode {episode}</h1>
        <h4 className="text-lg text-gray-800">
          {anime.attributes.canonicalTitle}
        </h4>

        <p className="text-sd font-thin text-gray-800 my-6">{episodeDesc}</p>
      </div>
    </div>
  );
}
