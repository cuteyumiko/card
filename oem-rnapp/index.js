import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'

import axios from 'axios';
import moment from 'moment';

import App from './App';
// import { reducers } from './src/redux';
import { reducers } from './src/redux';
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

moment.locale('zh-cn');

axios.defaults.baseURL = 'https://h5.hello.com';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('oem-rnapp', () => () =>
  <Provider store={store}>
    <App />
  </Provider>
);
