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
    name__like: '',
    remenList: [],
    jinriList: [],
    hotList_is_recommend: [],
    hotList_not_recommend: [],
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
          <Image source={require('../../assets/remen.png')} style={{height:20}} />
          <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:4}}>热门推荐</Text>
        </View>

        <View style={{padding:10}}>
          {this.state.remenList.length ? (
            <Swiper showsPagination={false} loop={false} style={{height:130}}>
              {_.map(this.state.remenList, o => (
                <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('cardApply', { id: o.id})} key={o.id} style={{flex:1, borderRadius:10, overflow:'hidden'}}>
                  <Image source={{uri: o.property.card_hot || o.icon}} style={{height:130}} resizeMode='cover' />
                </TouchableOpacity>
              ))}
            </Swiper>
          ): null}
        </View>
        <View style={{height:1, backgroundColor:'#eee'}}></View>

        <View style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
          <Image source={require('../../assets/tuijian.png')} style={{height:20}} />
          <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:4}}>今日推荐</Text>
        </View>

        {this.state.jinriList.length ? (
          <Swiper height={160} >

            {_.map(_.chunk(this.state.jinriList, 3), (list, i) => (

              <View key={i} style={{flexDirection:'row', padding: 20}}>
                {_.map(list, o => (
                  <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('cardApply', { id: o.id})} key={o.id} style={{flex:1, alignItems:'center'}}>
                    <Image source={{uri: o.property.card_image || o.icon}} style={{width:85, height:55}} />
                    <Text style={{marginTop:11,fontSize:14,color:'#333333'}}>{o.property.card_name || o.name}</Text>
                    <Text style={{marginTop:2,fontSize:12,color:'#999999'}}>{o.property.card_desc || o.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </Swiper>
        ) : null}

        <View style={{height:5, backgroundColor:'#eee'}}></View>

        <View style={{flexDirection:'row', paddingHorizontal: 15, paddingVertical:5, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
          <Image source={require('../../assets/tuijian.png')} style={{height:20}} />
          <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:4}}>热门银行</Text>
          <View style={{flex:1,flexDirection:'row', borderWidth:0.5, borderRadius:4, borderColor: '#CED0DA', marginHorizontal: 15, alignItems:'center'}}>
            <Image source={require('../../assets/search.png')} style={{marginLeft:10, width:15, height:15}} />
            <TextInput onChangeText={ name__like => {
              this.setState({name__like})
              this.reload({name__like})
            }} style={{flex: 1, marginLeft:10, fontSize:14, padding: 0}} placeholder='请输入关键字' underlineColorAndroid='transparent' />
          </View>
        </View>

        {_.map(this.state.hotList_is_recommend, o => (
          <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('cardApply', { id: o.id})} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>

            <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:60, height:60}} />
            <View style={{marginLeft:13, flex:1}}>
              <View style={{flexDirection: 'row', alignItems:'center'}}>
                <Text style={{fontSize:15,color:'#333333'}}>{o.name} </Text>
                {o.property.tips ? (
                  <View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}>
                    <Text style={{fontSize:10, color:'#ED471C'}}>{o.property.tips}</Text>
                  </View>
                ) : null}

              </View>
              <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}>{o.description ? o.description.replace(/\n/, ' ') : ''}</Text>
              <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}><Text style={{fontSize:12, lineHeight:17, color:'#ED471C'}}>{o.got_count}</Text> 人已申请</Text>
            </View>

            <View>

              <Text style={{fontSize:14, lineHeight:20, color:'#ED471C', textAlign:'right'}}>立即申请</Text>
            </View>

          </TouchableOpacity>

        ))}

        <View style={{flexDirection:'row', flexWrap:'wrap', padding: 5}}>

          {_.map(this.state.hotList_not_recommend, o => (
            <View key={o.id} style={{width:'50%', flexDirection: 'row', padding: 5}}>
              <View style={{shadowColor:'#27347D',shadowOffset:{h:2,w:0}, shadowRadius:4, shadowOpacity:0.25, borderRadius:5}}>
                <View style={{padding:1, backgroundColor:'#fff', borderRadius:5}}>
                  <Image source={{uri:o.icon}} style={{width:50, height:50, borderRadius:5}} />
                </View>
              </View>
              <View style={{marginLeft: 10, flex: 1}}>
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                  <Text style={{fontSize:15,color:'#333333'}}>{o.name} </Text><View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}><Text style={{fontSize:10, color:'#ED471C'}}>{o.tip_text}</Text></View>
                </View>
                <Text style={{marginTop: 3,fontSize: 12, color: '#999999'}}>{_.get(o.description.split('\n'), '[0]')}</Text>
                <Text style={{marginTop: 3, fontSize: 12, color: '#999999'}}>{_.get(o.description.split('\n'), '[1]')}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    );
  }

  async reload ( params = {} ) {

    const [hotList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: {
        merchant_id: this.props.merchant.id,
        is_enabled: 1,
        type_code__like: '[hot]',
        order: 'sort',
        prop: 'property',
        ...params
      } }),
    ])).data;

    const hotList_is_recommend = _.filter(hotList, o => o.is_recommend);
    const hotList_not_recommend = _.filter(hotList, o => !o.is_recommend);

    this.setState({
      hotList_is_recommend: _.map(hotList_is_recommend, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })),
      hotList_not_recommend: _.map(hotList_not_recommend, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      }))});
  }
  async componentDidMount() {

    const [remenList, jinriList, hotList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, type_code__like: '[app_remen]', order: 'sort', prop: 'property'} }),
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, type_code__like: '[app_jinri]', order: 'sort', prop: 'property'} }),
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, type_code__like: '[hot]', order: 'sort', prop: 'property'} }),
    ])).data;

    const hotList_is_recommend = _.filter(hotList, o => o.is_recommend);
    const hotList_not_recommend = _.filter(hotList, o => !o.is_recommend);
    this.setState({
      remenList: _.map(remenList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })),
      jinriList: _.map(jinriList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })),
      hotList_is_recommend: _.map(hotList_is_recommend, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })),
      hotList_not_recommend: _.map(hotList_not_recommend, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      }))});
  }
}

export default withRedux(withNavigation(Screen));
