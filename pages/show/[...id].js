import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import renderHTML from "react-render-html";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import EpisodeCard from "../../components/EpisodeCard";
import AnimeVideo from "../../components/AnimeVideo";
import Image from "../../components/Image";
import useAnime from "../../store/anime";
import useEpisodes from "../../store/episodes";

export default function Anime() {
  const router = useRouter();
  let { id, episode } = router.query;

  if (!id) {
    return <Loading />;
  }
  id = id ? id[0] : id;

  const [show] = useAnime(id);
  const [episodes] = useEpisodes(id);

  const [isLoading, setLoading] = React.useState(true);
  const [isEpisodeLoading, setEpisodeLoading] = React.useState(true);
  const [watchEpisode, setWatchEpisode] = React.useState(episode || null);

  React.useEffect(() => {
    if (show !== null) {
      setLoading(false);
    }
  }, [show]);

  React.useEffect(() => {
    if (episodes !== null) {
      setEpisodeLoading(false);
    }
  }, [episodes]);

  React.useEffect(() => {
    setWatchEpisode(router.query.episode || null);
  }, [router.query.episode]);

  if (isLoading) {
    return <Loading />;
  }

  console.log(isEpisodeLoading, watchEpisode);

  if (!isEpisodeLoading && watchEpisode) {
    return (
      <AnimeVideo
        anime={show}
        episode={watchEpisode}
        info={episodes.find(x => x.episode === parseInt(watchEpisode))}
      />
    );
  }

  const { en_title, title, fanart, overview } = show || {};

  return (
    <Layout title={en_title || title} className="flex flex-col p-2 sm:p-8">
      <div>
        <Link href="/" passHref>
          <a className="font-hairline border-b border-transparent hover:border-red-500 inline-block">
            ⟵ <span className="pl-2">Back</span>
          </a>
        </Link>
      </div>
      <header className="my-4 overflow-hidden" style={{ maxHeight: "600px" }}>
        <Image
          className="w-full object-cover"
          src={"fanart/" + fanart + "_medium.webp"}
        />
      </header>

      <div>
        <h1 className="text-3xl font-light">{en_title || title}</h1>
        <p className="text-sm font-thin my-4">{renderHTML(overview)}</p>
      </div>

      <div className="flex flex-wrap -mx-2">
        {isEpisodeLoading ? (
          <Loading />
        ) : (
          episodes
            .filter(e => e.aired)
            .map(episode => (
              <EpisodeCard
                key={episode.ids.simkl_id}
                episode={episode}
                anime={show}
              />
            ))
        )}
      </div>
    </Layout>
  );
}
