import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULT_PER_PAGE } from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultperpage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bk => bk.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    return state.recipe;
  } catch (err) {
    throw err;
  }
}
export async function loadSearch(query) {
  try {
    state.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.page = 1;
    state.search.result = data.recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
        ...(res.key && { key: res.key }),
      };
    });
  } catch (e) {
    throw e;
  }
}
export function getSearchByPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.result.slice(start, end);
}
export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmark();
  // console.log(state.bookmarks);
}
export function deleteBookmark(id) {
  state.recipe.bookmarked = false;
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  saveBookmark();
}
export function controlServings(serv) {
  state.recipe.ingredients.forEach(el => {
    el.quantity = (el.quantity * serv) / state.recipe.servings;
  });
  state.recipe.servings = serv;
}
function saveBookmark() {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
}
function loadBookmark() {
  const storage = JSON.parse(localStorage.getItem('bookmark'));
  if (!storage) return;
  state.bookmarks = storage;
}
function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    ingredients: recipe.ingredients,
    url: recipe.source_url,
    image: recipe.image_url,
    title: recipe.title,
    cooking_time: recipe.cooking_time,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
}
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = [
      ...Object.entries(newRecipe)
        .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
        .map(ing => {
          const ingArr = ing[1].replaceAll('  ', '').split(',');
          if (ingArr.length !== 3)
            throw new Error('INVALID INGRIDIENT FORMAT.TRY AGAIN ;)');
          const [quantity, unit, description] = ingArr;
          return { quantity: quantity ? +quantity : null, unit, description };
        }),
    ];

    const recipe = {
      ingredients,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
}
function init() {
  loadBookmark();
}
// localStorage.clear();
init();
