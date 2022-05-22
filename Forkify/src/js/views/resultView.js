import previewView from './previewView';
import View from './View';

class resultView extends View {
  _data = '';
  _parentElement = document.querySelector('.results');
  _error = 'NO RECIPE FOUND !!! TRY ANOTHER RECIPE ;)';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultView();
