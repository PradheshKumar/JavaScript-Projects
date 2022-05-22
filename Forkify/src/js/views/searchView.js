class searchView {
  _parentEl = document.querySelector('.search');

  addHandler(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler(document.querySelector('.search__field').value);
      this._clearSearch();
    });
  }
  _clearSearch() {
    document.querySelector('.search__field').value = '';
  }
}
export default new searchView();
