import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView, ImageBackground,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';

import ImageOK from '../components/ImageOK';

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
      <View style={{flex: 1, backgroundColor:'#ffffff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>{this.props.navigation.state.params.title}</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        <ScrollView>
          <ImageOK source={{uri: this.props.merchant.extend[this.props.navigation.state.params.key]}} />
        </ScrollView>
      </View>
    );
  }
  async componentDidMount() {
  }

}

export default withRedux(withNavigation(Screen));
