import React from "react";
import Axios from "axios";
import Loading from "./Loading";
import Router from "next/router";
import { SCRAPE_TOKEN } from "../utils/api";
import { strSlug } from "../utils/helpers";
import Layout from "../components/Layout";
import Animegg from "../utils/animegg";

const VIDEO_URL = "//animegg.org";
const MEDIA_HOST =
  process.env.NODE_ENV === "production" ? "proxy.sydl.nl" : "proxy-api.d";
const MEDIA_URL = "https://" + MEDIA_HOST + "/scrape?url=https:" + VIDEO_URL;
const ASPECT_RATIO = 16 / 9;

// https://www.animegg.org/attack-on-titan-episode-25
// https://www.animegg.org/shingeki-no-kyojin-episode-23

function getEpisodeSlug(episode, includeEpisode) {
  return (
    Animegg(strSlug(episode.en_title || episode.title)) +
    (includeEpisode ? "-episode" : "")
  );
}

async function scarpeEmbedCode(slug, episode) {
  const options = { headers: { "X-TOKEN": SCRAPE_TOKEN } };
  const queryString = `&query=${encodeURIComponent(
    "div#subbed-Animegg iframe[src]"
  )}&attr=src`;

  const url = `${MEDIA_URL}/${slug}-${episode}` + queryString;
  return await await Axios.get(url, options);
}

export default function AnimeVideo({ anime, episode, info }) {
  const [isLoading, setLoading] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(null);

  // console.log(anime, episode, "info", info);

  React.useEffect(() => {
    (async () => {
      const slug = getEpisodeSlug(anime, true);

      const rsp = await scarpeEmbedCode(slug, episode);
      const _videoUrl = await rsp.data.result;

      setVideoUrl("https:" + VIDEO_URL + _videoUrl);
    })();
  }, []);

  const handleClose = () => {
    Router.push("/show/[...id]", document.location.pathname, { shallow: true });
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
    let videoFrame = document.getElementById("videoFrame");
    function resizeContainer() {
      if (!videoFrame) {
        videoFrame = document.getElementById("videoFrame");
      }

      const { offsetWidth, offsetHeight } = videoFrame || {};

      if (offsetWidth > offsetHeight) {
        videoFrame.style.height = offsetWidth / ASPECT_RATIO + "px";
      } else if (offsetHeight > offsetWidth) {
        videoFrame.style.width = offsetHeight / ASPECT_RATIO + "px";
      }
    }

    window.addEventListener("resize", resizeContainer);
    resizeContainer();
  }, 200);

  const episodeDesc = info ? info.synopsis : "";
  const episodeTitle = info ? info.title : "";

  return (
    <Layout
      className="px-10 pt-10 pb-5"
      title={`Episode ${episode} | ${anime.title} | ${episodeTitle}`}
    >
      <div className="flex flex-col items-center">
        <ButtonClose />

        <iframe
          id="videoFrame"
          frameBorder="0"
          src={videoUrl}
          className="w-full my-8"
          onLoad={e => {
            setLoading(false);
          }}
        />
      </div>
      <div className="text-left">
        <h1 className="text-3xl font-light text-gray-600">
          Episode {episode} {episodeTitle ? "- " + episodeTitle : ""}
        </h1>
        <h4 className="text-lg text-gray-700">{anime.title}</h4>

        <p className="text-sd font-thin text-gray-600 my-6">{episodeDesc}</p>
      </div>
    </Layout>
  );
}
