import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';

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
    list: [],
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

        {_.map(this.state.list, o => (
          <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('notice_detail', { id: o.id })} style={{marginLeft:10, marginRight:10, marginTop:10, backgroundColor:'#ffffff', paddingTop:9, paddingLeft: 20, paddingBottom: 17, paddingRight:20}}>
            <Text style={{textAlign:'center', fontSize:13, color:'#C9C9C9'}}>{moment(o.create_time).format('MM月DD日')}</Text>
            <Text style={{marginTop: 5, fontSize:15, color:'#333333'}} numberOfLines={1}>{o.name}</Text>

            <View style={{position:'absolute', right:20, top:0, bottom:0, justifyContent:'center'}}>
            <Image source={require('../assets/right-arrow.png')} style={{marginLeft:8, height:12}} />
            </View>
          </TouchableOpacity>
        ))}

      </View>
    );
  }
  async componentDidMount() {
    let list = (await axios.get('api/m/merchant_notice', { params: {
      type_code: 'text-marquee',
    }})).data;
    this.setState({ list });
  }
}

export default withRedux(withNavigation(Screen));
