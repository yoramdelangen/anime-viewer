import React from "react";
import Axios from "axios";
import Loading from "./Loading";
import Router from "next/router";
import { SCRAPE_TOKEN } from "../utils/api";
import { strSlug } from "../utils/helpers";
import Layout from "../components/Layout";
import Animegg from "../utils/animegg";

const VIDEO_URL = "//www.animegg.org";
const VIDEO_REGEX = "div#subbed-Animegg iframe[src]";
const MEDIA_HOST =
  process.env.NODE_ENV === "production" ? "proxy.sydl.nl" : "y-proxy-api.d";
const MEDIA_URL = "https://" + MEDIA_HOST + "/scrape?url=https:" + VIDEO_URL;
// 9/5 = 5/9*100
// 16/9 = 9/16*100
const ASPECT_RATIO = (9 / 16) * 100; // 16 / 9;

const SCARPERS = {
  animegg: {
    url: "//www.animegg.org",
    regex: "div#subbed-Animegg iframe[src]",
    path: "/{0}-{1}",
    includeEpisode: true
  },
  anime1: {
    url: "//www.anime1.com",
    regex: '".*st[2|7].anime1.com/[HorribleSubs].*.mp4.*"',
    path: "/watch/{0}-{1}",
    includeEpisode: true
  }
};

// https://www.animegg.org/attack-on-titan-episode-25
// https://www.animegg.org/shingeki-no-kyojin-episode-23

function getAvailableSlugs(anime) {
  return (
    [anime.ids.slug, strSlug(anime.en_title || ""), strSlug(anime.title || "")]
      // filter undefined, null or empty strings
      .filter(x => x && x.length)
      // make unique
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(Animegg)
  );
}

function getEpisodeSlug(slug, includeEpisode) {
  console.log(slug, includeEpisode);
  return slug + (includeEpisode ? "-episode" : "");
}

async function scarpeEmbedCode(slug, episode) {
  const options = { headers: { "X-TOKEN": SCRAPE_TOKEN } };
  const queryString = `&query=${encodeURIComponent(VIDEO_REGEX)}&attr=src`;
  //www.anime1.com/watch/naruto/episode-219
  console.log("epi", episode);
  // const path = "/{0}-{1}".format(slug, episode);
  console.log("path", path);
  const url = `${MEDIA_URL}/watch/${path}` + queryString;
  console.log(url);
  return await await Axios.get(url, options);
}

/**
 * Component for showing the Anime Player.
 *
 * @param {*} param0
 */
export default function AnimeVideo({ anime, episode, info }) {
  const [isLoading, setLoading] = React.useState(true);
  const [isVideoLoading, setVideoLoading] = React.useState(true);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [errorMessage, setError] = React.useState();
  const [attempts, setAttempts] = React.useState(0);

  const episodeAvailableSlugs = getAvailableSlugs(anime);

  async function loadVideoUrl(nr) {
    nr = !nr ? 0 : nr;
    setAttempts(nr);
    console.log("nr", nr);
    const slug = getEpisodeSlug(episodeAvailableSlugs[nr], true);

    const rsp = await scarpeEmbedCode(slug, episode).catch(err => err);

    if (!rsp.data) {
      // check if there is another slug to be tested
      if (nr < episodeAvailableSlugs.length - 1) {
        return loadVideoUrl(++nr);
      }

      if (rsp.message.includes(404)) {
        setError(
          "Unfortunatly a 404 was thrown, the show wasn't found on animegg.org"
        );
      } else {
        setError("Some error occured: " + rsp.message);
      }
      return;
    }

    const _videoUrl = await rsp.data.result;

    setLoading(false);
    setVideoUrl(VIDEO_URL + _videoUrl.replace('"', ""));
  }

  React.useEffect(() => {
    (async () => {
      await loadVideoUrl();
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

  const episodeDesc = info ? info.descriptions : "";
  const episodeTitle = info ? info.title : "";

  return (
    <Layout
      className="px-10 pt-10 pb-5"
      title={`Episode ${episode} | ${anime.title} | ${episodeTitle}`}
    >
      <div className="flex flex-col items-center" id="videoContainer">
        <ButtonClose />

        <div
          className="relative my-8 w-full"
          style={{ paddingBottom: ASPECT_RATIO + "%" }}
        >
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading />
              Attempt: {attempts}/{episodeAvailableSlugs.length}
            </div>
          )}

          {errorMessage ? (
            <div className="text-red text-lg py-10">{errorMessage}</div>
          ) : (
            <iframe
              id="videoFrame"
              frameBorder="0"
              src={videoUrl}
              className={
                "absolute w-full h-full" + (isVideoLoading ? " hidden" : "")
              }
              onLoad={e => setVideoLoading(false)}
            />
          )}
        </div>
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
