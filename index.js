const LIMIT = 151;

const NORMAL =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771128_vtZCTx0FcngaRlL.png";
const FIRE =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771352_MP2IoWHMCgayfeK.png?1669505291";
const WATER =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771459_AaAIX3pHc7GIinU.png";
const GRASS =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771540_w4kKqo42ZRUeX0p.png";
const ELECTRIC =
  " https://f2.toyhou.se/file/f2-toyhou-se/images/57771500_VEeZTR9rNNkSxkD.png";
const ICE =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771587_XBalRb0HxiJkdUT.png";
const FIGHT =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771658_74zWFIYPh0tPuB4.png";
const POISON =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771757_Z5mYNRTnaWMUqVr.png?1669526845";
const GROUND =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771875_Nrecvde7xnrxTk8.png";
const FLYING =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771930_twNTWQYULGjv6h9.png";
const PSYCHIC =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57771981_tbRJ3pQFtGMPZkE.png";
const BUG =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772046_ce3UTOAYQf1N4vo.png";
const ROCK =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772110_XXgtD99dd43cvgm.png";
const GHOST =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772262_DyelDLqGwQzCvmL.png";
const DRAGON =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772395_mwaLEWVivQFwgDW.png";
const DARK =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772456_pNyWZ8hKhMEXNgR.png";
const STEEL =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772533_9rXuNNQibi8FjTA.png";
const FAIRY =
  "https://f2.toyhou.se/file/f2-toyhou-se/images/57772660_vBfPlPSuI5rhE5g.png";

// UTILS

const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

const getTypeBadge = (type) => {
  switch (type) {
    case "normal":
      return `<img src="${NORMAL}"/>`;
    case "fire":
      return `<img src="${FIRE}"/>`;
    case "water":
      return `<img src="${WATER}"/>`;
    case "grass":
      return `<img src="${GRASS}"/>`;
    case "electric":
      return `<img src="${ELECTRIC}"/>`;
    case "ice":
      return `<img src="${ICE}"/>`;
    case "fighting":
      return `<img src="${FIGHT}"/>`;
    case "poison":
      return `<img src="${POISON}"/>`;
    case "ground":
      return `<img src="${GROUND}"/>`;
    case "flying":
      return `<img src="${FLYING}"/>`;
    case "psychic":
      return `<img src="${PSYCHIC}"/>`;
    case "bug":
      return `<img src="${BUG}"/>`;
    case "rock":
      return `<img src="${ROCK}"/>`;
    case "ghost":
      return `<img src="${GHOST}"/>`;
    case "dragon":
      return `<img src="${DRAGON}"/>`;
    case "dark":
      return `<img src="${DARK}"/>`;
    case "steel":
      return `<img src="${STEEL}"/>`;
    case "fairy":
      return `<img src="${FAIRY}"/>`;
  }
};

// FETCH
const getAllPokemon = async () => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.results);
      data.results.forEach((pokemon) => {
        const markup = `<li><a onClick="getWeakness('${pokemon.url}'); return false;" href="#">${pokemon.name}</a></li>`;
        document
          .querySelector("#select-pokemon")
          .insertAdjacentHTML("beforeend", markup);
        // console.log(document.querySelector("#select-pokemon"));
      });
      return data.results;
    });
};
const pokemon = getAllPokemon();

const getWeakness = async (url) => {
  // console.log(url);
  document.querySelector("#sprites").innerHTML = "";
  return await fetch(url)
    .then((res) => res.json())
    .then(async (data) => {
      document.getElementById("pokemon-image").src = data.sprites.front_default;
      document.getElementById("pokemon-name").innerHTML = data.name;
      const urls = data.types.map((obj) => obj.type.url);
      //   console.log(`type urls: ${urls} `);
      const promises = urls.map((url) => fetch(url));
      await Promise.all(promises)
        .then((resp) => Promise.all(resp.map((res) => res.json())))
        .then(async (data) => {
          const weaknessUrls = removeDuplicates(
            data
              .map((type) =>
                type.damage_relations.double_damage_from.map((type) => type.url)
              )
              .reduce((acc, val) => acc.concat(val), [])
          );
          const weaknessTypes = removeDuplicates(
            data
              .map((type) =>
                type.damage_relations.double_damage_from.map(
                  (type) => type.name
                )
              )
              .reduce((acc, val) => acc.concat(val), [])
          );

          // Update weakness badges
          console.log(`weak to type urls: ${weaknessUrls}`);
          console.log(`weak to type names: ${weaknessTypes}`);
          document.getElementById("weakness-types").innerHTML = "";
          weaknessTypes.map(
            (type) =>
              (document.getElementById("weakness-types").innerHTML +=
                getTypeBadge(type))
          );
          const promises = weaknessUrls.map((url) => fetch(url));
          await Promise.all(promises)
            .then((resp) => Promise.all(resp.map((res) => res.json())))
            .then(async (data) => {
              // console.log(data.map((type) => type.pokemon.map((obj) => obj.pokemon.name)));
              const pokemonUrls = data.map((type) =>
                type.pokemon.map((obj) => obj.pokemon.url)
              );
              // console.log(pokemonUrls);
              const filteredUrls = [];
              for (let type of pokemonUrls) {
                // console.log(type.filter((str) => console.log(str)));
                const filtered = type.filter((str) => {
                  const regex = /\d+\/$/gm;
                  const id = str.match(regex);
                  // console.log(Number(id[0].slice(0, -1)));
                  return Number(id[0].slice(0, -1)) < LIMIT;
                });
                // console.log(filtered);
                filteredUrls.push(filtered);
              }
              // console.log(filteredUrls);
              const promisesArray = [];
              filteredUrls.forEach((arr) => {
                promisesArray.push(arr.map((url) => fetch(url)));
              });
              for (let promises of promisesArray) {
                await Promise.all(promises)
                  .then((resp) => Promise.all(resp.map((res) => res.json())))
                  .then((data) => {
                    data.map((pokemon) => {
                      // console.log(pokemon.types.map((data) => data.type.name));
                      let markup = `<div><img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"><h4>${pokemon.name}</h4>`;
                      pokemon.types.map(
                        (data) => (markup += getTypeBadge(data.type.name))
                      );
                      markup += `</div>`;
                      document
                        .querySelector("#sprites")
                        .insertAdjacentHTML("beforeend", markup);
                    });
                  });
              }
            });
        });
    });
};

getWeakness("https://pokeapi.co/api/v2/pokemon/1");
