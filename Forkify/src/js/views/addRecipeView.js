import View from './View';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'SUCCESSFULLY ADDED!!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this.addHandlerShow();
    this.addHandlerClose();
  }
  togglewindow() {
    console.log(this);
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  addHandlerShow() {
    this._btnOpen.addEventListener('click', this.togglewindow.bind(this));
  }
  addHandlerClose() {
    this._btnClose.addEventListener('click', this.togglewindow.bind(this));
    this._overlay.addEventListener('click', this.togglewindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new addRecipeView();
