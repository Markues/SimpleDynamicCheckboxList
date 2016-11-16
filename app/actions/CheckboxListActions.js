import alt from '../alt';

class CheckboxItemActions {
  constructor() {
    this.generateActions(
      'getListSuccess',
      'getListFail',
      'updateSelection'
    );
  }

  getList(checkedArray) {
    $.ajax({url: '/api/checkboxList'})
      .done((data) => {
        this.actions.getListSuccess({data: data, cArray: checkedArray})
      })
      .fail((jqXhr) => {
        this.actions.getListFail(jqXhr)
      });
  }

  handleSelect(updateQueryString, checkboxItems, event) {
    let selected = event.target.value;
    this.actions.updateSelection({selected: selected, updateQueryString: updateQueryString, checkboxItems: checkboxItems});
  }
}

export default alt.createActions(CheckboxItemActions);
