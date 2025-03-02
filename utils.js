import { LIMIT, MAX_POKEMON, ID_REGEX, BADGES } from "./config.js";

export const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

export const getTypeBadge = (type) => {
  switch (type) {
    case "normal":
      return `<img src="${BADGES.NORMAL}"/>`;
    case "fire":
      return `<img src="${BADGES.FIRE}"/>`;
    case "water":
      return `<img src="${BADGES.WATER}"/>`;
    case "grass":
      return `<img src="${BADGES.GRASS}"/>`;
    case "electric":
      return `<img src="${BADGES.ELECTRIC}"/>`;
    case "ice":
      return `<img src="${BADGES.ICE}"/>`;
    case "fighting":
      return `<img src="${BADGES.FIGHT}"/>`;
    case "poison":
      return `<img src="${BADGES.POISON}"/>`;
    case "ground":
      return `<img src="${BADGES.GROUND}"/>`;
    case "flying":
      return `<img src="${BADGES.FLYING}"/>`;
    case "psychic":
      return `<img src="${BADGES.PSYCHIC}"/>`;
    case "bug":
      return `<img src="${BADGES.BUG}"/>`;
    case "rock":
      return `<img src="${BADGES.ROCK}"/>`;
    case "ghost":
      return `<img src="${BADGES.GHOST}"/>`;
    case "dragon":
      return `<img src="${BADGES.DRAGON}"/>`;
    case "dark":
      return `<img src="${BADGES.DARK}"/>`;
    case "steel":
      return `<img src="${BADGES.STEEL}"/>`;
    case "fairy":
      return `<img src="${BADGES.FAIRY}"/>`;
  }
};

export const getTotalBaseStats = (pokemon) => {
  return pokemon.stats.reduce((acc, stat) => (acc += stat.base_stat), 0);
};

export const getResults = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

export const getResultsArray = async (urls) => {
  const response = await Promise.all(urls.map((url) => fetch(url)));
  return await Promise.all(response.map((res) => res.json()));
};

export const displayPokemon = async (url) => {
  document.querySelector("#sprites").innerHTML = "";
  document.getElementById("weakness-types").innerHTML = "";
  const pokemon = await getResults(url);
  document.getElementById("pokemon-image").src = pokemon.sprites.front_default;
  document.getElementById("pokemon-name").innerHTML = pokemon.name;
  document.getElementById(
    "total-base-stats"
  ).innerHTML = `Total Base Stats: ${getTotalBaseStats(pokemon)}`;
  return pokemon;
};

export const getUrls = async (pokemon) => {
  const weaknesses = await getResultsArray(
    pokemon.types.map((obj) => obj.type.url)
  );
  const weaknessTypes = removeDuplicates(
    weaknesses
      .map((type) =>
        type.damage_relations.double_damage_from.map((type) => type.name)
      )
      .reduce((acc, val) => acc.concat(val), [])
  );
  weaknessTypes.map(
    (type) =>
      (document.getElementById(
        "weakness-types"
      ).innerHTML += `<div class="weak-against">${getTypeBadge(type)}</div>`)
  );
  const weaknessObject = await getResultsArray(
    removeDuplicates(
      weaknesses
        .map((type) =>
          type.damage_relations.double_damage_from.map((type) => type.url)
        )
        .reduce((acc, val) => acc.concat(val), [])
    )
  );
  const pokemonUrls = weaknessObject.map((type) =>
    type.pokemon.map((obj) => obj.pokemon.url)
  );
  const filteredUrls = [];
  for (let type of pokemonUrls) {
    filteredUrls.push(
      type.filter((str) => {
        return Number(str.match(ID_REGEX)[0].slice(0, -1)) < LIMIT;
      })
    );
  }
  return filteredUrls;
};

export const displaySprites = async (urls) => {
  const weaknessBadges = document.querySelectorAll(".weak-against");
  for (let i = 0; i < urls.length; i++) {
    const pokemonByType = await getResultsArray(urls[i]);
    weaknessBadges[i].insertAdjacentHTML(
      "beforeend",
      `<h4>${pokemonByType.length}</h4>`
    );
    pokemonByType.map((pokemon) => {
      let markup = `<div class="weakness-pokemon"><img src="${
        pokemon.sprites.front_default
      }" alt="${pokemon.name}"><h5>${
        pokemon.name
      }</h5><h5>Stats: ${getTotalBaseStats(pokemon)}</h5>`;
      pokemon.types.map((data) => (markup += getTypeBadge(data.type.name)));
      markup += `</div>`;
      document
        .querySelector("#sprites")
        .insertAdjacentHTML("beforeend", markup);
    });
  }
  const teamList = document.querySelector("#team");

  document.querySelectorAll(".weakness-pokemon").forEach((pokemon) =>
    pokemon.addEventListener("click", () => {
      if (teamList.childElementCount < MAX_POKEMON) {
        pokemon.style.display = "none";
        document
          .querySelector("#team")
          .insertAdjacentHTML(
            "beforeend",
            `<div class="team-pokemon">${pokemon.innerHTML}</div>`
          );
        const lastPokemon = document.querySelectorAll(".team-pokemon");
        const index = document.querySelectorAll(".team-pokemon").length - 1;
        lastPokemon[index].addEventListener("click", () => {
          pokemon.style.display = "block";
          lastPokemon[index].remove();
        });
      }
    })
  );
};
