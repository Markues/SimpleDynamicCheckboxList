import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import CheckboxList from './components/CheckboxList';

export default (
  <Route component={App}>
    <Route path='/home' component={CheckboxList} />
  </Route>
);
