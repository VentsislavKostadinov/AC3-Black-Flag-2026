import { getStore } from "../store.js";

const getCharacters = () => {
    const store = getStore();
    const navigation = store.navigation ?? [];
    const charactersSection = navigation.find((item) => item.characters);
    return charactersSection?.characters ?? [];
};

const getSelectedCharacterName = () => {
    const hashRoute = window.location.hash.replace(/^#/, "");
    const [, queryString] = hashRoute.split("?");

    if (!queryString) {
        return "";
    }

    const query = new URLSearchParams(queryString);
    return query.get("selected") ?? "";
};

export const renderCharactersPage = () => {
    const characters = getCharacters();
    const selectedCharacterName = getSelectedCharacterName();

    if (!characters.length) {
        return `
      <section>
        <h1>Characters</h1>
        <p>No character data available.</p>
      </section>
    `;
    }

    const filteredCharacters = selectedCharacterName
        ? characters.filter(
            (character) =>
                character.character?.toLowerCase() === selectedCharacterName.toLowerCase()
        )
        : characters;

    if (!filteredCharacters.length) {
        return `
      <section>
        <h1>Characters</h1>
        <p>No character found for "${selectedCharacterName}".</p>
      </section>
    `;
    }

    const cards = filteredCharacters
        .map(
            (character) => `
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-12 col-xl-4">
            <article class="card h-100 bg-dark text-light border-secondary">
              <img src="${character.image}" class="card-img-top" alt="${character.character}">
              <div class="card-body">
                <h2 class="h5 card-title">${character.character}</h2>
              <p class="card-text mb-1"><strong>Biography:</strong> ${character.biography ?? "N/A"}</p>
              <p class="card-text mb-2"><strong>Early Years:</strong> ${character.earlyYears ?? "N/A"}</p>
              <p class="card-text">${character.description}</p>
            </div>
          </article>
        </div>
      </div>
    `
        )
        .join("");

    return `${cards}`;
};
