import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import Swiper from 'react-native-swiper';

import _ from 'lodash';
import axios from 'axios';

import TextInput from '../../components/JSTextInput';

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
    type2List: [],

    type_id: null,
    type2_ids: [],

    remenList: [],
    name__like: '',
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <ScrollView>
          <View style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
            <Image source={require('../../assets/remen.png')} style={{height:20}} />
            <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:4}}>热门推荐</Text>
          </View>

          <View style={{padding:10}}>
            {this.state.remenList.length ? (
              <Swiper showsPagination={false} loop={false} style={{height:130}}>
                {_.map(this.state.remenList, o => (
                  <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('loanApply', { id: o.id})} key={o.id} style={{flex:1, borderRadius:10, overflow:'hidden'}}>
                    <Image source={{uri: o.property.loan_hot || o.icon}} style={{height:130}} resizeMode='cover' />
                  </TouchableOpacity>
                ))}
              </Swiper>
            ): null}
          </View>

          <View style={{height:5, backgroundColor:'#eee'}}></View>

          <View style={{flexDirection:'row', paddingHorizontal: 15, paddingVertical:5, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
            <Image source={require('../../assets/youzhi.png')} style={{height:20}} />
            <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:4}}>优质产品</Text>
            <View style={{flex:1,flexDirection:'row', borderWidth:0.5, borderRadius:4, borderColor: '#CED0DA', marginHorizontal: 15, alignItems:'center'}}>
              <Image source={require('../../assets/search.png')} style={{marginLeft:10, width:15, height:15}} />
              <TextInput onChangeText={ name__like => {
                this.setState({name__like})
                this.reload({name__like})
              }} style={{flex: 1, marginLeft:10, fontSize:14, padding: 0}} placeholder='请输入关键字' underlineColorAndroid='transparent' />
            </View>
          </View>

          <ScrollView horizontal style={{flexDirection:'row', marginTop:10}} showsHorizontalScrollIndicator={false}>
            {_.map(this.state.typeList, o => (
              <TouchableOpacity key={o.id} onPress={() => this.setType(o.id)} key={o.id} style={{paddingHorizontal:12, alignItems:'center'}}>
                <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:25, height:25}} />
                <Text style={{marginTop:5, fontSize:12, lineHeight:17, color:'#5B5B5B'}}>{o.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{flexDirection:'row', marginTop:5}}>
            {_.map(this.state.type2List, o => (
              <TouchableOpacity key={o.id} onPress={() => this.setType2(o.id)} key={o.id} style={{flex:1, paddingHorizontal: 15, alignItems:'center'}}>
                <Text style={{marginTop:5, fontSize:12, lineHeight:17, color: this.state.type2_ids.indexOf(o.id) !== -1 ? '#FEC51D' : '#818181', textAlign:'center'}}>{o.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{marginTop:20}}>
            {_.map(this.getList(), o => (
              <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('loanApply', { id: o.id})} style={{padding:5, borderRadius: 5, backgroundColor:'#fff', }}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:40, height:40}} />
                  <View style={{flex:1,marginLeft:10}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <Text style={{fontSize:15,color:'#333333'}}>{o.name} </Text><View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}><Text style={{fontSize:10, color:'#ED471C'}}>{o.got_count}人已申请</Text></View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:1}}>
                        <Text style={{marginTop: 5, fontSize:12, color:'#999999'}}>额度: {o.quota} 参考月利率: {o.interest}</Text>

                        {o.type2List && o.type2List.length ? (
                          <View style={{flexDirection:'row', marginTop:6 }}>
                            {_.map(o.type2List, p => (
                              <View key={p.id} style={{borderRadius: 10, borderWidth:0.5, borderColor: p.color, paddingHorizontal:5, paddingVertical:2, marginRight: 5}}>
                                <Text style={{fontSize:12, color:p.color}}>{p.name}</Text>
                              </View>

                            ))}
                          </View>
                        ) : null}
                      </View>
                      <View>
                        <Text style={{marginTop:5, fontSize:14, color:'#ED471C', textAlign:'right'}}>立即申请</Text>
                      </View>
                    </View>
                  </View>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  getList() {
    return _.map(this.state.list, o => {
      const type_ids = _.map(o.type_ids.split(','), o => parseInt(o.substr(1, o.length-2)));
      const type2List = _.intersectionWith(this.state.type2List, type_ids, ({ id }, o) => id === o);
      return {
        ...o,
        type2List,
      };
    });
  }

  async setType(id) {

    if(id === this.state.type_id) return;

    const type_ids__like = [];
    this.setState({type_id:id, type2_ids: []})

    const [type2List, list] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_loan_type', method: 'filter', query: { parent_id: id } }),
      JSON.stringify({ object: 'product_loan_with_merchant', method: 'filter', query: {
        merchant_id: this.props.merchant.id, is_enabled: 1, is_recommend: 1, order: 'sort',
        type_ids__like: `[${id}]`,
        name__like: this.state.name__like,
      } }),
    ])).data;

    this.setState({list, type2List})
  }

  async setType2(id) {
    const type2_ids = _.xor(this.state.type2_ids, [id]);

    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        ...(type2_ids.length ? { type_ids__like: _.map(type2_ids, o => `[${o}]`).join(',') } : {}),
        name__like: this.state.name__like,
      }
    })).data;
    this.setState({list, type2_ids})

  }

  async reload(params = {}) {
    const type2_ids = this.state;
    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        ...(type2_ids.length ? { type_ids__like: _.map(type2_ids, o => `[${o}]`).join(',') } : {}),
        name__like: this.state.name__like,
        ...params,
      }
    })).data;
    this.setState({list})
  }
  async componentDidMount() {

    const [typeList, remenList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_loan_type', method: 'filter', query: { parent_id: '', catagory_id: 2} }),
      JSON.stringify({ object: 'product_loan_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, is_recommend: 1, type_code__like: '[app_remen]', order: 'sort', prop: 'property'} }),
    ])).data;

    const type_id = (_.find(typeList, o=> o.name.indexOf('白户') !== -1) || { id: null}).id;

    this.setState({
      typeList,
      remenList: _.map(remenList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      }))
    });

    this.setType(type_id);
  }
}

export default withRedux(withNavigation(Screen));
