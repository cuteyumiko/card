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

const typeConfig = {
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

class Screen extends Component {
  state = {
    list: []
  }

  render() {
    const list = this.getList();

    return (
      <ScrollView style={{flex: 1}}>

        {_.map(list, o => (
          <View key={o.id} style={{marginTop:10, borderRadius:5, overflow:'hidden', backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row', alignItems:'flex-end', borderLeftWidth:6, borderLeftColor:o.borderLeftColor, marginBottom: 10, paddingLeft: 17, paddingRight:20, paddingTop: 10}}>
              <Text style={{flex:1, fontSize:15, lineHeight:21, color:'#333333'}}>{o.typeText}</Text>
              <Text style={{fontSize:14, color:'#CAA473'}}>收入金额<Text style={{fontSize:26, color:'#FF300F'}}>{o.change_value}</Text><Text style={{fontSize:16, color:'#FF300F'}}>元</Text></Text>
            </View>
            <View style={{padding:0, borderTopWidth:1, borderColor:'#BEBFC3', paddingTop:10, paddingBottom:20, paddingHorizontal: 20}}>
              <Text style={{fontSize:14, color:'#4A4A4A', lineHeight:20 }}>申请人：{o.order_name} {o.order_mobile}</Text>
              <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>类目：{o.order_text}</Text>
              <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>订单号：{o.order_code}</Text>
              <Text style={{marginTop:5, fontSize:14, color:'#4A4A4A', lineHeight:20 }}>日期：{o.create_time}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    );
  }
  getList() {
    return _.map(this.state.list, o => {
      let income_type = 'other';
      if (o.card_order_id) income_type = 'card';
      else if (o.loan_order_id) income_type = 'loan';
      else if (o.ticket_order_id) income_type = 'ticket';
      else if (o.level_order_id) income_type = 'level';

      return {
        ...o,
        create_time: moment(o.create_time).format('YYYY-MM-DD HH:mm MMM'),
        order_text: o.level_order_id ? `${o.name}－${o.lower_name} ${o.order_creator_id !== o.lower_id ? '下级代理' : ''} 升级` : `${o.name}－${o.comments} ${o.lower_id ? `${o.lower_name}推广` : ''}`,
        ...(typeConfig[income_type] || {})
      }
    })
  }
  async componentDidMount() {
    // await this.income_reload();
    // ModalIndicator.show('查询中');
    // const list = (await axios.get('/api/my/user_balance', {
    //   params: {
    //     order: 'create_time',
    //     change_value__gt: 0
    //   }
    // })).data;
    //
    // this.setState({ list });
    // ModalIndicator.hide();
  }
}

export default withNavigation(Screen);
