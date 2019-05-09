import React, { Component } from 'react';
import {
  View, Image, Text, TouchableOpacity
} from 'react-native';

import _ from 'lodash';
import axios from 'axios';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class ExportComponent extends Component {
  state = {
    item: null,
  }

  render() {
    const { item } = this.state;
    if(!item) return null;
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('loanApply', { id: item.id})} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>
        <Image source={ item.icon ? {uri: item.icon} : require('../assets/icon-180.png') } style={{width:60, height:60}} />
        <View style={{marginLeft:13, flex:1}}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Text style={{fontSize:15,color:'#333333'}}>{item.id}{item.name} </Text><View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}><Text style={{fontSize:10, color:'#ED471C'}}>{item.tip_text}</Text></View>
          </View>
          <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}>{item.description ? item.description.replace(/\n/, ' ') : ''}</Text>
          <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}><Text style={{fontSize:12, lineHeight:17, color:'#ED471C'}}>{item.got_count}</Text> 人已申请</Text>
        </View>

        <View>
          <Text style={{fontSize:12, lineHeight:17, color:'#FF8800', textAlign:'right'}}>佣金最高{item.max_level_money}元</Text>
          <Text style={{fontSize:14, lineHeight:20, color:'#ED471C', textAlign:'right'}}>立即申请</Text>
        </View>

      </TouchableOpacity>
    )
  }

  async componentDidMount() {
    const { id } = this.props;

    const [item] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_loan_with_merchant', method: 'get', query: { id, merchant_id: this.props.merchant.id, prop: 'property' }})
    ])).data;

    item.property = _(item.property).mapKeys('property_code').mapValues('value').value();
    this.setState({item});
  }
}

export default withNavigation(withRedux(ExportComponent));
