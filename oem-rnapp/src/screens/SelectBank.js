import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setBankId: (bankId) => dispatch(actions.app.setBankId(bankId)),
  })
);

class Screen extends Component {
  state = {
    list: []
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>选择银行卡</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {_.map(this.props.bankList, (o, i) => (
          <TouchableOpacity key={o.id} onPress={() => {
            this.props.setBankId(o.id);
            this.props.navigation.pop();
          }} style={{flexDirection:'row'}}>
            <View style={{padding:5}}>
              <Image source={{uri: o.icon}} style={{width:30,height:30}} resizeMode='contain'/>
            </View>
            <View style={{flexDirection:'row', flex:1, marginLeft:10, borderTopWidth:i > 0 ? 0.5 : 0, borderColor:'#ddd', alignItems:'center'}}>
              <Text style={{flex:1}}>{o.name}</Text>
              <Text style={{flex:1}}>储蓄卡</Text>
            </View>
          </TouchableOpacity>
        ))}


      </View>
    );
  }
  async componentDidMount() {
  }
}

export default withRedux(withNavigation(Screen))
