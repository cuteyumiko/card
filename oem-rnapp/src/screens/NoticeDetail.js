import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';

import TinymceView from '../components/TinymceView';


import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

class Screen extends Component {
  state = {
    item: null,
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>通知</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{paddingBottom: this.props.marginBottom, backgroundColor:'#ffff', flex:1}}>
        {this.state.item ? (
          <ScrollView style={{padding: 20,flex:1}}>
            <Text style={{fontSize:15, color:'#333333'}}>{this.state.item.name}</Text>
            <TinymceView html={this.state.item.content}/>
            <Text style={{marginTop:10, marginBottom:20, fontSize:12, color:'#9C9C9C'}}>{moment(this.state.item.create_time).format('YYYY年MM月DD日 HH:mm')}</Text>
          </ScrollView>
        ) : null}
        </View>
      </View>
    );
  }
  async componentDidMount() {
    const { id } = this.props.navigation.state.params;
    const item = (await axios.get(`api/merchant_notice/${id}`)).data;
    this.setState({item});
  }
}

export default withRedux(Screen);
