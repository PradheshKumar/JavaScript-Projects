import icons from 'url:../../img/icons.svg';
import View from './View';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _addHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultperpage
    );
    const CurPage = this._data.page;
    if (CurPage === 1 && numPage > 1)
      return `<button data-goto="${
        CurPage + 1
      }" class="btn--inline pagination__btn--next">
    <span>Page ${CurPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    if (CurPage === numPage && numPage > 1)
      return `<button data-goto="${
        CurPage - 1
      }" class="btn--inline  pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${CurPage - 1}</span>
  </button>`;

    if (CurPage < numPage)
      return `<button data-goto="${
        CurPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${CurPage - 1}</span>
  </button>
  <button data-goto="${CurPage + 1}" class="btn--inline pagination__btn--next">
<span>Page ${CurPage + 1}</span>
<svg class="search__icon">
  <use href="${icons}#icon-arrow-right"></use>
</svg>
</button>`;

    return '';
  }
}
export default new PaginationView();
