import React, { Component } from 'react';
import {
  Text, View, TextInput, Modal, ImageBackground,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
import ImageOK from '../../components/ImageOK';

const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

const settleTypeList = [
  { id: 1, name: '隔天' },
  { id: 2, name: '秒到' },
];

class Screen extends Component {

  state = {
    item: null,
    itemList: [],
    processVisible: false,
    levelList: [],
  }
  render() {
    const item = this.state.item;

    const ListView = (this.state.item && this.state.item.property.bg_image) ? ImageBackground : View;
    const ListProp = (this.state.item && this.state.item.property.bg_image) ? { source: { uri: this.state.item.property.bg_image } } : {};
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>{item ? item.name : '积分兑换'}</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {this.state.item ? (
          <ListView {...ListProp} style={{flex:1}}>
          {_.map(this.state.itemList, o => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ticketSource2', { id: o.id, source_id: o.source_id})} key={o.id} style={{overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginLeft: 10, marginRight: 10}}>
              <LinearGradient colors={[ item.property.start_color || '#FE7735', item.property.end_color || '#F43F2C']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                <View style={{flexDirection:'row', paddingRight: 15}}>
                  <View style={{padding:7, backgroundColor:'#fff', borderRadius:40, margin: 15}}>
                    <Image source={{uri:item.icon}} style={{width:35, height:35}} />
                  </View>
                  <View style={{flex:1}}>
                    <View style={{marginTop: 20, flexDirection:'row', alignItems: 'flex-end'}}>
                      <Text style={{flex:1,fontSize:17, color: '#fff'}}>{o.name}</Text>
                      <View style={{backgroundColor:'#fff', justifyContent:'center', paddingHorizontal:6, paddingVertical:2, borderRadius:20}}>
                        <Text style={{color:item.property.end_color || '#F43F2C', fontSize:13, lineHeight:17}}>立即兑换</Text>
                      </View>
                    </View>

                    <View style={{flexDirection:'row', marginTop: 3}}>
                      <Text style={{flex:1, fontSize: 12, color: '#fff'}}>兑换积分：{o.points}</Text>
                      <Text style={{fontSize: 12, color: '#fff'}}>结算时间：{o.settle_type_name}</Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection:'row', borderTopWidth:0.5, borderColor:'#fff'}}>
                  {_.map(this.state.levelList, p => (
                    <View key={p.id} style={{flex:1, paddingVertical:5}}>
                      <Text style={{fontSize:12, color:'#fff',textAlign:'center'}} numberOfLines={1}>{p.name}</Text>
                      <Text style={{marginTop:5,fontSize:12, color:'#fff',textAlign:'center'}} numberOfLines={1}>{_.get(p, `ticket[${o.id}].money`)}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <View style={{flexDirection:'row', marginTop:50}}>
            <View style={{flex:1}}></View>
            <Image source={require('../../assets/ticket-process-1.png')} style={{width:40, height:40}} />
            <View style={{flex:2, paddingHorizontal:5, justifyContent:'center'}}>
              <View style={{height:0.5, backgroundColor:'#AFB4D2'}}></View>
            </View>
            <Image source={require('../../assets/ticket-process-2.png')} style={{width:40, height:40}} />
            <View style={{flex:2, paddingHorizontal:5, justifyContent:'center'}}>
              <View style={{height:0.5, backgroundColor:'#AFB4D2'}}></View>
            </View>
            <Image source={require('../../assets/ticket-process-3.png')} style={{width:40, height:40}} />
            <View style={{flex:2, paddingHorizontal:5, justifyContent:'center'}}>
              <View style={{height:0.5, backgroundColor:'#AFB4D2'}}></View>
            </View>
            <Image source={require('../../assets/ticket-process-4.png')} style={{width:40, height:40}} />
            <View style={{flex:1}}></View>
          </View>
          <View style={{flexDirection:'row', marginTop:5, paddingHorizontal:6}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:10, color:'#B6B6B6', textAlign:'center'}}>选择兑换银行点击“立即兑换”</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:10, color:'#B6B6B6', textAlign:'center'}}>根据步骤提示兑换并按求保单</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:10, color:'#B6B6B6', textAlign:'center'}}>点击“兑换记录”查看是否兑换成功</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{fontSize:10, color:'#B6B6B6', textAlign:'center'}}>审核成功后到我的收益中提现</Text>
            </View>
          </View>
          </ListView>
        ) : null}
      </View>
    );
  }

  async componentDidMount() {
    const { source_id } = this.props.navigation.state.params;

    const [item, user_level_x_product_ticket, itemList, levelList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_ticket_source', method: 'get', query: { id: source_id, prop: 'property' } }),
      JSON.stringify({ object: 'user_level_x_product_ticket', method: 'filter', query: { merchant_id: this.props.merchant.id, source_id } }),
      JSON.stringify({ object: 'product_ticket', method: 'filter', query: { source_id } }),
      JSON.stringify({ object: 'user_level', method: 'filter', query: { merchant_id: this.props.merchant.id } }),
    ])).data;

    item.property = _(item.property).mapKeys('property_code').mapValues('value').value();

    this.setState({
      item,
      itemList: _.map(itemList, o => ({
        ...o,
        settle_type_name: (_.find(settleTypeList, { id: o.settle_type }) || { name: o.settle_type }).name,
      })),
      levelList: _.map(levelList, o => ({
        ...o,
        ticket: _(user_level_x_product_ticket).filter({ level_id: o.id }).mapKeys('ticket_id').value(),
      }))});

  }
}

export default withRedux(Screen)
