import icons from 'url:../../img/icons.svg';
export default class View {
  _message = '';
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this._renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const Newmarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(Newmarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach(function (newEl, i) {
      const CurEl = curElements[i];
      if (!newEl.isEqualNode(CurEl) && newEl.firstChild?.nodeValue.trim())
        CurEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(CurEl))
        Array.from(newEl.attributes).forEach(function (attr) {
          CurEl.setAttribute(attr.name, attr.value);
        });
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  _renderError(message = this._error) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href=" ${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  LoadSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
