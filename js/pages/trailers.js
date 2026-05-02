import { getStore } from "../store.js";

const getTrailers = () => {
  const store = getStore();
  const navigation = store.navigation ?? [];
  const trailersSection = navigation.find((item) => item.trailers);
  return trailersSection?.trailers ?? [];
};

export const renderTrailersPage = () => {
  const trailers = getTrailers();

  if (!trailers.length) {
    return `No trailer links available.`;
  }

  const frames = trailers
    .map((url, index) => {
      return `
        <iframe
          width="853"
          height="480"
          src="${url}"
          title="Assassin's Creed Black Flag Trailer ${index + 1}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      `;
    })
    .join("");

  return frames;
};
