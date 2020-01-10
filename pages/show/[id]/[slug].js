import React from "react";
import { useRouter } from "next/router";
import { getFromApi, getENTitle, sortAttrBy } from "../../../utils/api";
import Loading from "../../../components/Loading";
import EpisodeCard from "../../../components/EpisodeCard";
import AnimeVideo from "../../../components/AnimeVideo";
import Link from "next/link";

const API_LIMIT = 20;

export default function Anime() {
  const router = useRouter();
  const { id, episode } = router.query;

  if (!id) {
    return <Loading />;
  }

  const [isLoading, setLoading] = React.useState(true);
  const [show, setShow] = React.useState(null);
  const [episodes, setEpisodes] = React.useState(null);
  const [pageCount, setPageCount] = React.useState(null);
  const [watchEpisode, setWatchEpisode] = React.useState(episode || null);

  async function fetchEpisodePages(page) {
    page = !page ? 0 : page - 1;

    if (page > pageCount) {
      return;
    }

    let offset = API_LIMIT * page;

    return await getFromApi(
      `/anime/${id}/episodes?sort=-number&page[limit]=${API_LIMIT}&page[offset]=${offset}`
    );
  }

  async function fetching(page) {
    const _new = await fetchEpisodePages(page);

    setEpisodes(eps => {
      let o = (eps || []).concat(_new);
      return o.sort(sortAttrBy("number"));
    });

    if (page >= 0 && page < pageCount) {
      fetching(++page);
    }
  }

  React.useEffect(() => {
    getFromApi(`/anime/${id}`).then(s => {
      setShow(s);
      console.log(
        Math.ceil(s.attributes.episodeCount / API_LIMIT),
        s.attributes
      );
      const totalEpisodes =
        s.attributes.episodeCount ||
        s.attributes.totalLength / s.attributes.episodeLength;
      setPageCount(Math.ceil(totalEpisodes / API_LIMIT));
    });
  }, []);

  React.useEffect(() => {
    let page = 1;
    console.log(show, pageCount);
    if (show && pageCount) {
      fetching(page);
    }
  }, [show, pageCount]);

  React.useEffect(() => {
    console.log(show, episodes);
    if (show !== null && episodes !== null) {
      setLoading(false);
    }
  }, [show, episodes]);

  React.useEffect(() => {
    setWatchEpisode(router.query.episode || null);
  }, [router.query.episode]);

  if (isLoading) {
    return <Loading />;
  }

  if (watchEpisode) {
    return (
      <AnimeVideo
        anime={show}
        episode={watchEpisode}
        info={episodes.find(
          x => x.attributes.number === parseInt(watchEpisode)
        )}
      />
    );
  }

  const { titles, coverImage, synopsis, posterImage } = show.attributes || {};

  return (
    <section className="flex flex-col p-2 sm:p-8 container mx-auto">
      <div>
        <Link href="/" passHref>
          <a className="font-hairline border-b border-transparent hover:border-red-500 inline-block">
            ⟵ <span className="pl-2">Back</span>
          </a>
        </Link>
      </div>
      <header className="my-4 overflow-hidden" style={{ maxHeight: "600px" }}>
        <img
          className="w-full object-cover"
          src={coverImage ? coverImage.large : posterImage.original}
        />
      </header>

      <div>
        <h1 className="text-3xl font-light">{getENTitle(titles)}</h1>
        <p className="text-sm font-thin my-4">{synopsis}</p>
      </div>

      <div className="flex flex-wrap -mx-2">
        {episodes.map(episode => (
          <EpisodeCard key={episode.id} episode={episode} anime={show} />
        ))}
      </div>
    </section>
  );
}
