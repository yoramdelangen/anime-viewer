const slugsToMap = {
  "black-clover": "black-clover-tv",
  "fullmetal-alchemist-brotherhood": "full-metal-alchemist-brotherhood"
};

export default function slugMapper(slug) {
  return slugsToMap[slug] || slug;
}
