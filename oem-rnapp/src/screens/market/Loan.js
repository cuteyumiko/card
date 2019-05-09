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
    typeList: [],
    type_id: null,
  }

  getText() {
    return 'loan';
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <ScrollView horizontal style={{flexDirection:'row', marginTop:10}} showsHorizontalScrollIndicator={false}>
          {_.map(this.state.typeList, o => (
            <TouchableOpacity key={o.id} onPress={() => this.setType(o.id)} key={o.id} style={{paddingHorizontal:12, alignItems:'center'}}>
              <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:25, height:25}} />
              <Text style={{marginTop:5, fontSize:12, lineHeight:17, color:'#5B5B5B'}}>{o.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {_.map(this.state.list, o => (
          <View key={o.id} style={{backgroundColor:'#fff', marginTop:2, padding: 15}}>
            <View style={{flexDirection:'row'}}>
              <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:60,height:60}} />
              <View style={{flex:1, marginLeft:20}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontSize:15, color:'#333333'}}>{o.name}</Text>
                  <View style={{backgroundColor:'#F5F5F7', paddingLeft:8, paddingRight:8, paddingTop:1, paddingBottom:1}}>
                    <Text style={{fontSize:12, color:'#4959B8'}}>{o.tip_text}</Text>
                  </View>
                </View>
                <Text style={{fontSize:13, color:'#999999', marginTop:5}}>额度: {o.quota}</Text>
                <Text style={{fontSize:13, color:'#999999', marginTop:5}}>参考月利率：{o.interest}</Text>
              </View>

              <View style={{alignItems:'center'}}>
                <Text style={{fontSize:13,color:'#AFB4D2'}}>{'最高佣金'}<Text style={{color:'#FF300F', fontSize:15}}>{o.max_level_money}{o.money_unit}</Text></Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('loanQR', { id: o.id})} style={{marginTop:10, borderWidth:1,borderRadius:20, borderColor:'#FF300F', paddingLeft:5, paddingRight:5, paddingTop:2, paddingBottom:2}}>
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
                  <Image source={require('../../assets/market-copy.png')} style={{height:12, width: 12}} />
                  <Text style={{fontSize:12, color:'#AFB4D2'}}>复制</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
  async setType(id) {

    if(id === this.state.type_id) return;

    const type_ids__like = [];
    this.setState({type_id:id, type2_ids: []})
    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        type_ids__like: `[${id}]`,
      }
    })).data;
    list = _.map(list, o => ({
      ...o,
      link: this.props.merchant.extend.dwz_prefix ? `${this.props.merchant.extend.dwz_prefix}/l/${this.props.user.id}-${o.id}`: `${axios.defaults.baseURL}/product_loan_apply?referee=${this.props.user.id}&id=${o.id}`,
    }))

    if(this.props.onCopyText) {
      this.props.onCopyText(_.map(list, o => `${o.name} ${o.link}`).join('\n'));
    }

    let type2List = (await axios.get('/api/product_loan_type', { params: { parent_id: id }})).data;
    this.setState({list, type2List})
  }

  async componentDidMount() {
    let list = (await axios.get('/api/m/product_loan', { params: {
      is_enabled: 1,
      order:'sort',
    }})).data;
    list = _.map(list, o => ({
      ...o,
      link: this.props.merchant.extend.dwz_prefix ? `${this.props.merchant.extend.dwz_prefix}/l/${this.props.user.id}-${o.id}`: `${axios.defaults.baseURL}/product_loan_apply?referee=${this.props.user.id}&id=${o.id}`,
    }))

    if(this.props.onCopyText) {
      this.props.onCopyText(_.map(list, o => `${o.name} ${o.link}`).join('\n'));
    }

    const typeList = (await axios.get('/api/product_loan_type', { params: { catagory_id: 2 }})).data;
    const type_id = (_.find(typeList, o=> o.name.indexOf('白户') !== -1) || { id: null}).id;


    this.setState({ list, typeList, type_id });
  }
}

export default withRedux(withNavigation(Screen));
