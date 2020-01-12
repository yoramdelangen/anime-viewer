const slugsToMap = {
  "black-clover": "black-clover-tv"
};

export default function slugMapper(slug) {
  return slugsToMap[slug] || slug;
}
