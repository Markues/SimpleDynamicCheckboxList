import alt from '../alt';
import {_} from 'underscore';
import {browserHistory} from 'react-router';
import CheckboxItemActions from '../actions/CheckboxItemActions';

class CheckboxItemStore {
  constructor() {
    this.bindActions(CheckboxItemActions);
    this.checkboxItems = [{value: '1', label: 'loading...', selected: false}];
  }

  onGetListSuccess(dataObj) {
    let checkedData = _.map(dataObj.data, (checkboxItem) => {
      if(_.find(dataObj.cArray, (item) => {return checkboxItem.value === item;})) {
        return {label: checkboxItem.label, value: checkboxItem.value, selected: !checkboxItem.selected};
      } else {
        return checkboxItem;
      }
    });

    this.checkboxItems = checkedData;
  }

  onGetListFail(jqXhr) {
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }

  onUpdateSelection(data) {
    this.checkboxItems = _.map(data.checkboxItems, (checkboxItem) => {
      return {
        value: checkboxItem.value,
        label: checkboxItem.label,
        selected: (checkboxItem.value === data.selected ? !checkboxItem.selected : checkboxItem.selected)
      };
    });

    let selItem = _.pluck(_.filter(this.checkboxItems, (checkboxItem) => {return checkboxItem.selected;}), 'value');
    let cbList = "";
    if(selItem.length < 1) {
      cbList = "";
    }
    else if(selItem.length === 1) {
      cbList = selItem[0];
    }
    else if(selItem.length > 1) {
      cbList = ("(" + (_.reduce(selItem, (memo, value) => {
        return memo + value + "|"
      }, "")).slice(0, -1)) + ")";
    }
    let newUri = data.updateQueryString("checkboxList", cbList);
    browserHistory.push(newUri);
  }
}

export default alt.createStore(CheckboxItemStore);
