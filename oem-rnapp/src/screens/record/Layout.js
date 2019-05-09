import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Card from './Card';
import Loan from './Loan';
import Ticket from './Ticket';
import LevelUp from './LevelUp';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row',paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>申请记录</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        <ScrollableTabView style={{flex:1}} initialPage={0} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#ffffff' tabBarActiveTextColor='#4959B8' tabBarInactiveTextColor='#333333' tabBarUnderlineStyle={{height:3, backgroundColor:'#FEC51D'}}>
          <Card tabLabel='信用卡' />
          <Loan tabLabel='贷款' />
          <Ticket tabLabel='积分兑换' />
          <LevelUp tabLabel='升级' />
        </ScrollableTabView>
      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(Screen);
