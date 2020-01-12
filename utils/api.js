import Axios from "axios";

export const SIMKL_KEY =
  "d5e1044ace03867877b99fa787e01d561af5dcb0692c99d8f991ff331662e03b";

export const API_URL = "https://api.simkl.com";
export const API_PATH = "/anime";

export const SCRAPE_TOKEN =
  'dnvqGHjfBk8S#tSJEGaG4$4xf*SKv&2VrK#v3&Z55ezzTDZk%r5ta?WU67&ySpb@"';

export async function getFromApi(path, fromRoot) {
  const res = await Axios.get(API_URL + (fromRoot ? "" : API_PATH) + path);
  const json = await res.data;

  return json;
}

export const getENTitle = titles => {
  return titles.en_us || titles.en || titles.en_jp;
};

export const sortAttrBy = key => (a, b) => {
  if (a[key] < b[key]) {
    return 1;
  } else if (a[key] > b[key]) {
    return -1;
  }
  return 0;
};
