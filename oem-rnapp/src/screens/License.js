import React, { Component } from 'react';
import {
  Text, View, TextInput, ImageBackground,
  TouchableOpacity, Image, ScrollView, AsyncStorage,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import TinymceView from '../components/TinymceView';

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
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>HelloCard平台服务协议</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex:1, padding:10}}>
          <TinymceView html={this.props.merchant.extend.agreement} style={{paddingBottom: this.props.marginBottom}} />
        </ScrollView>
      </View>
    );
  }

}

export default withRedux(Screen)
