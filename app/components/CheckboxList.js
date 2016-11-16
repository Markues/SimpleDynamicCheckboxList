import React from 'react';
import {_} from 'underscore';
import CheckboxListStore from '../stores/CheckboxListStore'
import CheckboxListActions from '../actions/CheckboxListActions';

// Private class
class CheckboxItem extends React.Component {
  render() {
    return (
      <div key={this.props.key} className="checkbox">
        <label>
          <input
            type="checkbox"
            value={this.props.checkboxItem.value}
            checked={this.props.checkboxItem.selected}
            onChange={CheckboxListActions.handleSelect.bind(this, this.props.updateQueryString, this.props.checkboxItems)}
          />
          {this.props.checkboxItem.label}
        </label>
      </div>
    );
  }
}

class CheckboxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = CheckboxListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let checkboxArray = this.getCheckboxArray(this.props);

    CheckboxListStore.listen(this.onChange);
    CheckboxListActions.getList(checkboxArray);
  }

  componentWillReceiveProps(nextProps) {
    let checkboxArray = this.getCheckboxArray(nextProps);

    let checkboxItems = _.map(this.state.checkboxItems, (checkboxItem) => {
      if(_.find(checkboxArray, (item) => {return checkboxItem.value === item;})) {
        return {label: checkboxItem.label, value: checkboxItem.value, selected: true};
      } else {
        return {label: checkboxItem.label, value: checkboxItem.value, selected: false};
      }
    });

    this.setState({checkboxItems: checkboxItems});
  }

  componentWillUnmount() {
    CheckboxListStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  getCheckboxArray(props) {
    let path = props.location.pathname;
    let queryStr = props.location.search;
    let fullUrl = path + queryStr;
    let getQueryParam = this.getParameterByName(fullUrl);
    return getQueryParam("checkboxList").replace(/[()]/g, '').split(/[/|.]/); // Split on '.' and '|'
  }

  updateQueryStringParameter(url) {
    return function(key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = url.indexOf('?') !== -1 ? "&" : "?";
      if (url.match(re)) {
        return url.replace(re, '$1' + key + "=" + value + '$2');
      }
      else {
        return url + separator + key + "=" + value;
      }
    };
  }

  // Parse query string for 'name' variable
  getParameterByName(url) {
    return function(name) {
      var adjName = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + adjName + "(=([^&#]*)|&|#|$)");
      var results = regex.exec(url);
      if (!results) {
        return null;
      }
      if (!results[2]) {
        return '';
      }
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
  }

  render() {
    let self = this;
    let path = this.props.location.pathname;
    let queryStr = this.props.location.search;
    let fullUrl = path + queryStr;

    let updateQueryString = this.updateQueryStringParameter(fullUrl);

    let convert = function(parts) {
      return parts.map(function(part) {
        return (
          <CheckboxItem key={part.value} checkboxItem={part} checkboxItems={parts} updateQueryString={updateQueryString}/>
        )
      });
    };

    let checkboxList = convert(this.state.checkboxItems);
    let firstThird = Math.round(checkboxList.length / 3) - 1;
    let secondThird = firstThird + Math.round(checkboxList.length / 3);

    return (
      <div className='container'>
        <div className='jumbotron'>
          <form role="form">
            <table className="table">
              <tbody>
                <tr>
                  <td className='col-xs-4'>
                    {checkboxList.slice(0, firstThird)}
                  </td>
                  <td className='col-xs-4'>
                    {checkboxList.slice(firstThird, secondThird)}
                  </td>
                  <td className='col-xs-4'>
                    {checkboxList.slice(secondThird, checkboxList.length - 1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }
}

export default CheckboxList;
