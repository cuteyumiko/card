import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ImageBackground,
  Linking, Modal, Clipboard, AsyncStorage,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>

        <ScrollableTabView renderTabBar={() => <View />} style={{flex:1}}>
          <ImageBackground style={{flex:1, backgroundColor:'#fff'}} key={1} source={require('../assets/welcome-0.png')} resizeMode='contain'>

            <View style={{flex:1}}></View>
            <View style={{flexDirection:'row', height:100, alignItems:'center', justifyContent:'center'}}>

              <View style={{backgroundColor:'#888', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
              <View style={{backgroundColor:'#ddd', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
              <View style={{backgroundColor:'#ddd', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
            </View>
          </ImageBackground>
          <ImageBackground style={{flex:1, backgroundColor:'#fff'}} key={2} source={require('../assets/welcome-1.png')} resizeMode='contain'>
            <View style={{flex:1}}></View>
            <View style={{flexDirection:'row', height:100, alignItems:'center', justifyContent:'center'}}>

              <View style={{backgroundColor:'#ddd', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
              <View style={{backgroundColor:'#888', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
              <View style={{backgroundColor:'#ddd', width:10, height: 10, borderRadius:5, marginLeft:10}}></View>
            </View>
          </ImageBackground>
          <ImageBackground style={{flex:1}} key={3} source={require('../assets/welcome-2.png')} resizeMode='cover'>

            <View style={{flex:1}}></View>
            <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity style={{marginTop:100}} onPress={ async () => {
                await AsyncStorage.setItem('hideWelcome', '1');
                if(this.props.user) {
                  const home = this.props.merchant.extend.app_fenxiao_hide == '0' ? 'home' : 'home2';
                  this.props.navigation.replace(home)
                } else {
                  this.props.navigation.replace('login')
                }
              }}>
                <Text style={{color:'#fff'}}>开始体验</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollableTabView>


      </View>
    );
  }

  async componentDidMount() {
  }
}

export default withRedux(Screen)
