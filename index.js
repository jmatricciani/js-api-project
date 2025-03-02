import * as utils from "./utils.js";
import { LIMIT } from "./config.js";

const listAllPokemon = async () => {
  const data = await utils.getResults(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}`
  );
  data.results.forEach((pokemon) => {
    const markup = `<li><a href="#">${pokemon.name}</a></li>`;
    const list = document.querySelector("#select-pokemon");
    list.insertAdjacentHTML("beforeend", markup);
    list.children[list.children.length - 1].addEventListener("click", () => {
      getWeakness(pokemon.url);
    });
  });
};

const getWeakness = async (url) => {
  const pokemon = await utils.displayPokemon(url);
  const urls = await utils.getUrls(pokemon);
  utils.displaySprites(urls);
};

listAllPokemon();
getWeakness("https://pokeapi.co/api/v2/pokemon/1");
