import React, { Component } from 'react';
import {
  Text,
  View, AsyncStorage,
} from 'react-native';

import { ModalIndicator } from 'teaset';

import createScreen from './src/screens/Layout';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
moment.locale('zh-cn');


import codePush from 'react-native-code-push';
const withCodePush = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE });

import { connect } from 'react-redux'
import { actions } from './src/redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setMerchant: (merchant) => dispatch(actions.app.setMerchant(merchant)),
    setToken: (token) => dispatch(actions.app.setToken(token)),
    setUser: (user) => dispatch(actions.app.setUser(user)),
  })
);

class App extends Component {
  state = {
    RootScreen: null
  }
  render() {
    const { RootScreen } = this.state;
    if(!RootScreen) return <View style={{flex:1, backgroundColor:'#fff'}} />;
    return <RootScreen style={{flex: 1}} />;
  }
  async componentDidMount() {

    const merchant = (await axios.get('/api/m/info')).data[0];
    console.log(merchant);
    const extendList = (await axios.get('/api/m/extend')).data;
    merchant.extend = _(extendList).mapKeys('code').mapValues('value').value();
    this.props.setMerchant(merchant);

    const hideWelcome = await AsyncStorage.getItem('hideWelcome');
    const token = await AsyncStorage.getItem('token');
    let initialRouteName = hideWelcome ? 'login' : 'welcome';
    console.log(token);
    if(token) {
      try {
        axios.defaults.headers.common['X-Token'] = token;
        const { user } = (await axios.get('/api/token_info')).data;
        console.log(user);
        this.props.setToken(token);
        this.props.setUser(user);
        if(hideWelcome){
          if(merchant.extend.app_fenxiao_hide == '0') {
            initialRouteName = 'home';
          } else {
            initialRouteName = 'home2';
          }
        }
      }catch(e) {
        
      }
    }
    const RootScreen = createScreen({ initialRouteName})
    this.setState({RootScreen});
  }

  codePushStatusDidChange(status) {
    switch(status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        ModalIndicator.show('下载更新中');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        ModalIndicator.show('更新中');
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        // ModalIndicator.hide();
        // Toast.message('更新完成');
        break;
    }
  }
  codePushDownloadDidProgress(progress) {
    ModalIndicator.show(`${(progress.receivedBytes / progress.totalBytes * 100).toFixed(0)} %`);
  }
}

export default withCodePush(withRedux(App));
