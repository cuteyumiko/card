import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { ModalIndicator, Toast } from 'teaset';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

const statusList = [
  { id: 1, name: '待处理' },
  { id: 2, name: '打款成功' },
  { id: 3, name: '打款失败,已撤销' },
  { id: 4, name: '打款处理中' },
];

class Screen extends Component {
  state = {
    list: []
  }
  render() {
    const list = this.getList();
    return (
      <ScrollView style={{flex: 1}}>


        {_.map(list, o => (
          <View key={o.id} style={{backgroundColor:'#fff', borderRadius:5, marginHorizontal:10, marginTop:10}}>
            <View style={{flexDirection:'row', paddingHorizontal:20, paddingTop:20, paddingBottom:12}}>
              <Text style={{flex:1}}>订单号：{o.code}</Text>
              <Text style={{color:(o.status == 3 ? '#FF300F' : '#4959B8')}}>{o.status_name}</Text>
            </View>
            <View style={{height:1, backgroundColor:'#BEBFC3'}}></View>
            <View style={{padding:20}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{flex:1, fontSize:14, color:'#CAA473', lineHeight:20}}>提现</Text>
                <Text style={{fontSize:16, color:'#ED471C'}}><Text style={{fontSize:26}}>{o.money}</Text>元</Text>
              </View>
              <Text style={{marginTop:8, fontSize:14, color:'#4A4A4A', lineHeight:20}}>打款时间：{o.close_time}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    );
  }
  getList() {
    return _.map(this.state.list, o => ({
      ...o,
      status_name: (_.find(statusList, { id: o.status }) || { name: o.status }).name,
      close_time: o.close_time ? moment(o.close_time).format('YYYY-MM-DD HH:mm:ss') : '-',
      create_time: moment.unix(o.create_time).format('YYYY-MM-DD HH:mm:ss'),
    }))
  }
  async componentDidMount() {
    ModalIndicator.show('查询中');
    const list = (await axios.get('/api/my/cash_order', { params: { order: 'create_time'} })).data;
    this.setState({ list });
    ModalIndicator.hide();
  }
}

export default withNavigation(Screen);
