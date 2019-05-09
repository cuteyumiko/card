import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
  Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  state = {
    list: [],
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>

        {_.map(this.state.list, o => (
          <View key={o.id} style={{backgroundColor:'#fff', marginTop:2, padding: 15}}>
            <View style={{flexDirection:'row'}}>
              <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:60,height:60}} />
              <View style={{flex:1, marginLeft:10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontSize:15, color:'#333333'}}>{o.name}</Text>
                  <View style={{backgroundColor:'#F5F5F7', paddingLeft:8, paddingRight:8, paddingTop:1, paddingBottom:1}}>
                    <Text style={{fontSize:12, color:'#4959B8'}}>{o.tip_text}</Text>
                  </View>
                </View>
                <Text style={{fontSize:13, color:'#999999', marginTop:5}}>{_.get(o.description.split('\n'), '[0]')}</Text>
                <Text style={{fontSize:13, color:'#999999', marginTop:5}}>{_.get(o.description.split('\n'), '[1]')}</Text>
              </View>

              <View style={{alignItems:'center'}}>
                <Text style={{fontSize:13,color:'#AFB4D2'}}>最高佣金<Text style={{color:'#FF300F', fontSize:15}}>{o.max_level_money}元</Text></Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('cardQR', { id: o.id})} style={{marginTop:10, borderWidth:1,borderRadius:20, borderColor:'#FF300F', paddingLeft:5, paddingRight:5, paddingTop:2, paddingBottom:2}}>
                  <Text style={{color:'#FF300F', fontSize:14}}>推广海报</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop:5}}>
              <View style={{backgroundColor:'#F5F5F7', flexDirection:'row', padding:2}}>
                <Text numberOfLines={1} style={{flex:1, color:'#AFB4D2', fontSize:12}}>{o.link}</Text>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {
                  Clipboard.setString(`${o.name} ${o.link}`)
                  Toast.success('已复制');
                }}>
                  <Text style={{fontSize:12, color:'#AFB4D2'}}>复制</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    );
  }
  async componentDidMount() {

    let list = (await axios.get('/api/m/product_card', { params: {
      is_enabled: 1,
      is_recommend: 1,
      type_code__like: '[hot]',
      order:'sort',
    }})).data;

    list = _.map(list, o => ({
      ...o,
      link: this.props.merchant.extend.dwz_prefix ? `${this.props.merchant.extend.dwz_prefix}/c/${this.props.user.id}-${o.id}` : `${axios.defaults.baseURL}/product_card_apply?referee=${this.props.user.id}&id=${o.id}`,
    }))

    if(this.props.onCopyText) {
      this.props.onCopyText(_.map(list, o => `${o.name} ${o.link}`).join('\n'));
    }
    this.setState({ list });
  }
}

export default withRedux(withNavigation(Screen));
