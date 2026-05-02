import { getStore } from "../store.js";

const getCities = () => {
  const store = getStore();
  const navigation = store.navigation ?? [];
  const citiesSection = navigation.find((item) => item.cities);
  return citiesSection?.cities ?? [];
};

const getSelectedCityName = () => {
  const hashRoute = window.location.hash.replace(/^#/, "");
  const [, queryString] = hashRoute.split("?");

  if (!queryString) {
    return "";
  }

  const query = new URLSearchParams(queryString);
  return query.get("selected") ?? "";
};

export const renderCitiesPage = () => {
  const cities = getCities();
  const selectedCityName = getSelectedCityName();

  if (!cities.length) {
    return `
      <section>
        <h1>Cities</h1>
        <p>No city data available.</p>
      </section>
    `;
  }

  const filteredCities = selectedCityName
    ? cities.filter((city) => city.city?.toLowerCase() === selectedCityName.toLowerCase())
    : cities;

  if (!filteredCities.length) {
    return `
      <section>
        <h1>Cities</h1>
        <p>No city found for "${selectedCityName}".</p>
      </section>
    `;
  }

  const cityItems = filteredCities
    .map(
      (city) => `
        <div class="col-12 col-lg-4">
          <article class="p-3 rounded-3 bg-dark bg-opacity-75 h-100 border border-secondary">
            ${city.image ? `<img src="${city.image}" class="img-fluid rounded mb-3" alt="${city.city}">` : ""}
            <h2 class="h4">${city.city}</h2>
            <p class="mb-0">${city.description}</p>
          </article>
        </div>
      `
    )
    .join("");

  return `
    <section>
      <h1 class="mb-4">Cities</h1>
      <div class="row g-4">
        ${cityItems}
      </div>
    </section>
  `;
};
