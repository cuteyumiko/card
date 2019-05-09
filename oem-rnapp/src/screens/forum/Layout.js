import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import { connect } from 'react-redux'
import { actions } from '../../redux';

const reduxWrap = connect(
  state => state.app,
  dispatch => ({
  })
);

import College from './College';
import BBS from './BBS';

class Screen extends Component {
  render() {
    return (
      <View style={{flex:1, backgroundColor: '#4959B8', paddingTop:this.props.marginTop }}>
        <ScrollableTabView locked={true} initialPage={0} style={{flex:1}} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#4959B8' tabBarActiveTextColor='#FEC51D' tabBarInactiveTextColor='#fff' tabBarUnderlineStyle={{height:0}} renderTabBar={() => <ScrollableTabBar />}>
          <College tabLabel='Hello学院'/>
          <BBS tabLabel='互动留言'/>
        </ScrollableTabView>
      </View>
    );
  }
  componentDidMount() {
  }
}

export default reduxWrap(Screen);
