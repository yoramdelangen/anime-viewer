import Axios from "axios";

export const API_LIMIT = 20;

export const API_URL = "https://kitsu.io/api/edge";

export const SCRAPE_TOKEN =
  'dnvqGHjfBk8S#tSJEGaG4$4xf*SKv&2VrK#v3&Z55ezzTDZk%r5ta?WU67&ySpb@"';

export async function getFromApi(path) {
  const res = await Axios.get(API_URL + path);
  const json = await res.data;

  return json.data;
}

export const getENTitle = titles => {
  return titles.en_us || titles.en || titles.en_jp;
};

export const sortAttrBy = key => (a, b) => {
  if (a.attributes[key] < b.attributes[key]) {
    return 1;
  } else if (a.attributes[key] > b.attributes[key]) {
    return -1;
  }
  return 0;
};
