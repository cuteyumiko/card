import React, { Component } from 'react';
import {
  Text, View, FlatList,
  TouchableOpacity, Image, ImageBackground,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

import Income from './Income';
import Withdraw from './Withdraw';

const incomeTypeConfig = {
  'card': {
    borderLeftColor: '#A28DFF',
    typeText: '信用卡'
  },
  'loan': {
    borderLeftColor: '#FFC573',
    typeText: '网贷',
  },
  'ticket': {
    borderLeftColor: '#4CE29A',
    typeText: '积分兑换',
  },
  'level' : {
    borderLeftColor: '#FF487B',
    typeText: '会员升级',
  },
  'other' : {
    borderLeftColor: '#FF00FF',
    typeText: '其他',
  }
}

const withdrawStatusList = [
  { id: 1, name: '待处理' },
  { id: 2, name: '打款成功' },
  { id: 3, name: '打款失败,已撤销' },
  { id: 4, name: '打款处理中' },
];

class Screen extends Component {
  state = {
    income_list: [],
    income_list_offset: 0,
    income_refreshing: false,
    income_list_loading: false,

    withdraw_list: [],
    withdraw_list_offset: 0,
    withdraw_refreshing: false,
    withdraw_list_loading: false,
  }
  render() {
    return (

      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>我的收益</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{backgroundColor:'#fff'}}>
          <ImageBackground style={{margin: 10, padding: 20}} source={require('../../assets/wodeshouyi-bg.png')} resizeMode='stretch'>
            <Text style={{fontSize:14, lineHeight:20, color:'#FFFFFF'}}>可提现(元)</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:30, lineHeight: 35, color:'#FFFFFF'}}>{this.props.user.balance}</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('cashApply')}>
                <Text style={{marginLeft:16, fontSize:14, lineHeight:20, color:'#F8E71C'}}>去提现</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', marginTop: 16}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:20, lineHeight:24, color:'#FFFFFF'}}>{this.props.user.cash_income.toFixed(2)}</Text>
                <Text style={{marginTop: 3, fontSize:14, lineHeight:20, color:'#FFFFFF'}}>已提现(元)</Text>
              </View>
              <View>
                <Text style={{fontSize:20, lineHeight:24, color:'#FFFFFF', textAlign:'right'}}>{this.props.user.sum_income.toFixed(2)}</Text>
                <Text style={{marginTop: 3, fontSize:14, lineHeight:20, color:'#FFFFFF', textAlign:'right'}}>总收益(元)</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <ScrollableTabView initialPage={0} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#FFFFFF' tabBarActiveTextColor='#4959B8' tabBarInactiveTextColor='#333333' tabBarUnderlineStyle={{height:2, backgroundColor:'#4959B8'}}>
          <FlatList tabLabel='收入明细'
            data={this.state.income_list}
            keyExtractor={item => `${item.id}`}
            ListFooterComponent={() => {
              if(this.state.income_refreshing){
                return null;
              }else if (this.state.income_list_loading) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>好像还可以再加载一点</Text>
                  </View>
                )
              } else if(this.state.income_list_offset < 0) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>只有这么多记录了</Text>
                  </View>
                )
              } else {
                return null
              }
            }}
            renderItem={({item}) => (
              <View key={item.id} style={{marginTop:10, borderRadius:5, overflow:'hidden', backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row', alignItems:'flex-end', borderLeftWidth:6, borderLeftColor:item.borderLeftColor, marginBottom: 10, paddingLeft: 17, paddingRight:20, paddingTop: 10}}>
                  <Text style={{flex:1, fontSize:15, lineHeight:21, color:'#333333'}}>{item.typeText}</Text>
                  <Text style={{fontSize:14, color:'#CAA473'}}>收入金额<Text style={{fontSize:26, color:'#FF300F'}}>{item.change_value}</Text><Text style={{fontSize:16, color:'#FF300F'}}>元</Text></Text>
                </View>
                <View style={{padding:0, borderTopWidth:1, borderColor:'#BEBFC3', paddingTop:10, paddingBottom:20, paddingHorizontal: 20}}>
                  <Text style={{fontSize:14, color:'#4A4A4A', lineHeight:20 }}>申请人：{item.order_name} {item.order_mobile}</Text>
                  <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>类目：{item.order_text}</Text>
                  <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>订单号：{item.order_code}</Text>
                  <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>日期：{item.create_time}</Text>
                </View>
              </View>
            )}
            onRefresh={() => {
              this.income_reload(true);
            }}
            refreshing={this.state.income_refreshing}
            onEndReached={() => {
              this.income_reload();
            }}
            onEndReachedThreshold={0.1}
          />
          <FlatList tabLabel='提现明细'
            data={this.state.withdraw_list}
            keyExtractor={item => `${item.id}`}
            ListFooterComponent={() => {
              if(this.state.withdraw_refreshing){
                return null;
              }else if (this.state.withdraw_list_loading) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>好像还可以再加载一点</Text>
                  </View>
                )
              } else if(this.state.withdraw_list_offset < 0) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>只有这么多记录了</Text>
                  </View>
                )
              } else {
                return null
              }
            }}
            renderItem={({item}) => (
              <View key={item.id} style={{backgroundColor:'#fff', borderRadius:5, marginHorizontal:10, marginTop:10}}>
                <View style={{flexDirection:'row', paddingHorizontal:20, paddingTop:20, paddingBottom:12}}>
                  <Text style={{flex:1}}>订单号：{item.code}</Text>
                  <Text style={{color:(item.status == 3 ? '#FF300F' : '#4959B8')}}>{item.status_name}</Text>
                </View>
                <View style={{height:1, backgroundColor:'#BEBFC3'}}></View>
                <View style={{padding:20}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{flex:1, fontSize:14, color:'#CAA473', lineHeight:20}}>提现</Text>
                    <Text style={{fontSize:16, color:'#ED471C'}}><Text style={{fontSize:26}}>{item.money}</Text>元</Text>
                  </View>
                  <Text style={{marginTop:8, fontSize:14, color:'#4A4A4A', lineHeight:20}}>打款时间：{item.close_time}</Text>
                </View>
              </View>
            )}
            onRefresh={() => {
              this.withdraw_reload(true);
            }}
            refreshing={this.state.withdraw_refreshing}
            onEndReached={() => {
              this.withdraw_reload();
            }}
            onEndReachedThreshold={0.1}
          />
        </ScrollableTabView>
      </View>


    );
  }

  async income_reload(refresh) {
    const { income_list_loading } = this.state;
    let offset = refresh ? 0 : this.state.income_list_offset;
    const income_list = refresh ? [] : this.state.income_list;
    if(offset < 0 || income_list_loading ) return;

    this.setState({
      income_list_loading: true,
      income_refreshing: offset === 0,
    })

    let list = (await axios.get('/api/my/user_balance', {
      params: {
        order: 'create_time',
        change_value__gt: 0,
        offset,
        limit: 20,
      }
    })).data;


    list = _.map(list, o => {
      let income_type = 'other';
      if (o.card_order_id) income_type = 'card';
      else if (o.loan_order_id) income_type = 'loan';
      else if (o.ticket_order_id) income_type = 'ticket';
      else if (o.level_order_id) income_type = 'level';

      return {
        ...o,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm MMM'),
        order_text: o.level_order_id ? `${o.name}－${o.lower_name} ${o.order_creator_id !== o.lower_id ? '下级代理' : ''} 升级` : `${o.name}－${o.comments} ${o.lower_id ? `${o.lower_name}推广` : ''}`,
        ...(incomeTypeConfig[income_type] || {})
      }
    })

    this.setState({
      income_list: [ ...income_list, ...list],
      income_list_offset: list.length === 20 ? offset + 20 : -1,
      income_list_loading: false,
      income_refreshing: false,
    });
  }

  async withdraw_reload(refresh) {
    const { withdraw_list_loading } = this.state;
    let offset = refresh ? 0 : this.state.withdraw_list_offset;
    const withdraw_list = refresh ? [] : this.state.withdraw_list;
    if(offset < 0 || withdraw_list_loading ) return;

    this.setState({
      withdraw_list_loading: true,
      withdraw_refreshing: offset === 0,
    })

    let list = (await axios.get('/api/my/cash_order', { params: {
      order: 'create_time',
      offset,
      limit: 20,
    } })).data;

    list = _.map(list, o => ({
      ...o,
      status_name: (_.find(withdrawStatusList, { id: o.status }) || { name: o.status }).name,
      close_time: o.close_time ? moment(o.close_time).format('YYYY-MM-DD HH:mm:ss') : '-',
      create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
    }))


    this.setState({
      withdraw_list: [ ...withdraw_list, ...list],
      withdraw_list_offset: list.length === 20 ? offset + 20 : -1,
      withdraw_list_loading: false,
      withdraw_refreshing: false,
    });
  }

  async componentDidMount() {
    await this.income_reload();
    await this.withdraw_reload();
  }
}

export default withRedux(Screen)
