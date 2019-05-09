import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {

  state = {
    status: 0,
    a_list: [],
  }
  statusList = [
    { id: 1, name: '未完善' },
    { id: 2, name: '已认证' },
    { id: 3, name: '未通过' },
  ]

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>团队管理</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{flexDirection:'row', padding: 5, backgroundColor:'#fff'}}>
          <View style={{flex:1, padding: 5}}>
            <TouchableOpacity onPress={() => this.state.status !== 0 && this.setState({ status: 0 })} style={{paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 0 ? { backgroundColor:'#4959B8' } : { })}}>
              <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 0 ? { color: '#fff' } : { color: '#4959B8'})}}>全部</Text>
            </TouchableOpacity>
          </View >
          <View style={{flex:1, padding: 5}}>
            <TouchableOpacity onPress={() => this.state.status !== 2 && this.setState({ status: 2 })} style={{flex:1, paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 2 ? { backgroundColor:'#4959B8' } : { })}}>
              <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 2 ? { color: '#fff'} : { color: '#4959B8'})}}>已认证</Text>
            </TouchableOpacity>
          </View >
          <View style={{flex:1, padding: 5}}>
            <TouchableOpacity onPress={() => this.state.status !== 1 && this.setState({ status: 1 })} style={{flex:1, paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 1 ? { backgroundColor:'#4959B8' } : {})}}>
              <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 1 ? { color: '#fff'} : { color: '#4959B8'})}}>未完善</Text>
            </TouchableOpacity>
          </View >
        </View>

        <ScrollView>

          {_.map(this.getList(), o => (
            <View key={o.id} style={{marginTop:10, backgroundColor:'#ffffff', paddingLeft: 20, paddingTop: 25, paddingBottom: 15, paddingRight: 20}}>
              <View style={{flexDirection:'row'}}>
                <Image source={{uri:o.creator_head_image || this.props.merchant.extend.default_head_image}} style={{width:30,height:30, borderRadius:15}} />
                <View style={{flex:1, marginLeft: 10}}>
                  <Text style={{fontSize:15, color:'#333333'}}>{o.name} {o.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                  <Text style={{marginTop:4, fontSize:15, color:'#333333'}}>{o.level_name}</Text>
                  <View style={{position:'absolute', top: 0, right: 0, bottom: 0, alignItems:'flex-end'}}>
                    <View style={{borderWidth: 1, borderRadius: 20, borderColor: '#FF300F', paddingLeft:8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
                      <Text style={{ fontSize:15, color:'#FF300F'}}>{o.status_name}</Text>
                    </View>
                    <Text style={{marginTop:3, fontSize:12, color:'#9C9C9C'}}>加入时间：{o.create_time}</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection:'row', marginTop: 15}}>
                <View style={{flex:1,alignItems:'center'}}>
                  <Text style={{fontSize:26, color:'#ED471C'}}>{o.referee_count} <Text style={{fontSize:16}}>个</Text></Text>
                  <Text style={{marginTop:5, fontSize:14, color:'#CAA473'}}>代理数量</Text>
                </View>
                <View style={{flex:1,alignItems:'center'}}>
                  <Text style={{fontSize:26, color:'#ED471C'}}>{o.sum_income || 0} <Text style={{fontSize:16}}>元</Text></Text>
                  <Text style={{marginTop:5, fontSize:14, color:'#CAA473'}}>总收益</Text>
                </View>
              </View>
            </View>
          ))}

        </ScrollView>

      </View>
    );
  }
  getList() {
    if (!this.state.status) return this.state.a_list;
    return _.filter(this.state.a_list, { status: this.state.status });
  }
  async componentDidMount() {
    const { id: level_id } = this.props.navigation.state.params;

    let list = (await axios.get('/api/my/team_user', {
      params: {
        referee_value: 0,
        level_id,
        order: 'sum_income',
      },
    })).data;
    const a_list = _.map(list, o => ({
      ...o,
      create_time: moment(o.create_time).format('YYYY-MM-DD'),
      status_name: o.status ? (_.find(this.statusList, { id: o.status }) || { name: o.status || '未完善' }).name : o.status,
    }));

    this.setState({a_list});

  }
}

export default withRedux(Screen);
