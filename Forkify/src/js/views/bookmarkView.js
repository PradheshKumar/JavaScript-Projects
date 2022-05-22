import previewView from './previewView';
import View from './View';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _error = 'NO BOOKMARK FOUND !!! FIND A RECIPE AND BOOKMARK IT :)';
  addHandler(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new bookmarkView();
