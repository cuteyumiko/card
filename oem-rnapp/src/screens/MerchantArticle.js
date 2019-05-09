import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView, ImageBackground,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';

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
  state = {
    item: null
  }
  render() {
    const { item } = this.state;
    return (
      <View style={{flex: 1, backgroundColor:'#ffffff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>{item ? item.name : '图文教程'}</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        { item ? (
          <ScrollView>
            <TinymceView html={item.content}/>
          </ScrollView>
        ) : null}

      </View>
    );
  }
  async componentDidMount() {
    const { id } = this.props.navigation.state.params;
    const item = (await axios.get(`/api/merchant_article/${id}`)).data;
    this.setState({item});
  }

}

export default withRedux(withNavigation(Screen));
