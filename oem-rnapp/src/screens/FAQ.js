import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';

import _ from 'lodash';
import axios from 'axios';

import TinymceView from '../components/TinymceView';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setUser: (user) => dispatch(actions.app.setUser(user)),
    setBankCardId: (bankCardId) => dispatch(actions.app.setBankCardId(bankCardId)),
    setBankCardList: (bankCardList) => dispatch(actions.app.setBankCardList(bankCardList)),
  })
);

class Screen extends Component {
  state = {
    textList: [],
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>常见问题</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        <ScrollView style={{flex: 1}}>

          {_.map(this.state.textList, o => (
            <View key={o.id} style={{padding:5}}>
              <TouchableOpacity onPress={() => this.setState({
                textList: _.map(this.state.textList, p => p.id === o.id ? {...p, exp: !o.exp } : p )
              })} style={{flexDirection:'row', backgroundColor:'#ddd', padding:5}}>
                <Text style={{flex:1}}>{o.name}</Text>
                <Image source={o.exp ? require('../assets/item-unfold.png') : require('../assets/item-enter.png')} style={{width:20, height:20, marginRight: 5}} />
              </TouchableOpacity>

              {o.exp ? (
                <View>
                  <TinymceView html={o.content} style={{padding:10}}/>
                </View>
              ) : null}

            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
  async componentDidMount() {
    const textList = (await axios.get('/api/m/merchant_article', { params: { type_code: 'text', order: 'sort__asc'}})).data;
    this.setState({textList});
  }
}

export default withRedux(Screen);
