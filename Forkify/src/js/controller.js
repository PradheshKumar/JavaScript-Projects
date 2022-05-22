import * as model from '../js/model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import resultView from './views/resultView.js';
import pagination from './views/pagination.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function ShowRecipe() {
  try {
    const ResId = window.location.hash.slice(1);
    if (!ResId) return;
    recipeView.LoadSpinner();

    await model.loadRecipe(ResId);
    recipeView.render(model.state.recipe);
    resultView.update(model.getSearchByPage());
    bookmarkView.update(model.state.bookmarks);
    // recipeView.LoadSpinner();
  } catch (e) {
    console.log(e);
    recipeView.renderError();
  }
}
async function searchRecipe(query) {
  resultView.LoadSpinner();
  await model.loadSearch(query);
  resultView.render(model.getSearchByPage());
  pagination.render(model.state.search);
}
function HandlePagination(goto) {
  resultView.render(model.getSearchByPage(goto));
  pagination.render(model.state.search);
}
function HandleServing(serv) {
  model.controlServings(serv);
  recipeView.update(model.state.recipe);
}
function HandleAddBookmark() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
}
function HandleBookmark() {
  bookmarkView.render(model.state.bookmarks);
}
async function HandleAddRecipe(recipe) {
  try {
    addRecipeView.LoadSpinner();
    await model.uploadRecipe(recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    setTimeout(addRecipeView.togglewindow(), MODAL_CLOSE_SEC * 1000);
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (e) {
    addRecipeView.renderError(e.message);
  }
}
function init() {
  bookmarkView.addHandler(HandleBookmark);
  recipeView.AddListener(ShowRecipe);
  recipeView.addHandlerServings(HandleServing);
  recipeView.addHandlerBookmark(HandleAddBookmark);
  searchView.addHandler(searchRecipe);
  pagination._addHandler(HandlePagination);
  addRecipeView.addHandlerUpload(HandleAddRecipe);
}
init();
// ShowRecipe();
