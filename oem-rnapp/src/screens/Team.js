import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import LinearGradient from 'react-native-linear-gradient';

import _ from 'lodash';
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
    total: 0,
    levelList: [],
  }
  render() {
    return (
      <View style={{flex: 1}}>

        <LinearGradient colors={[ '#4B56C0', '#6981FF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{paddingLeft:20, paddingRight:20, paddingBottom:20}}>

          <View style={{flexDirection:'row', paddingVertical:10, marginTop:this.props.marginTop}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <View style={{flex:1}}></View>
          </View>

          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={{uri: this.props.user.head_image || this.props.merchant.extend.default_head_image}} style={{width:64,height:64, borderRadius:32, borderWidth:1, borderColor:'#fff'}} />
            <View style={{marginLeft:10, alignItems:'flex-start',flex:1}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontSize:17, color:'#fff'}}>{this.props.user.nickname}</Text>
                <View style={{marginLeft: 10, borderRadius:5, borderWidth:1, borderColor:'#F5A923', padding: 5}}><Text style={{color:'#F5A923'}}>{this.props.user.status == '1' ? '未实名': '已实名'}</Text></View>
              </View>
              <View style={{marginTop: 5, backgroundColor:'#FFC031', borderRadius:20, paddingLeft:6, paddingRight:6, paddingTop:2, paddingBottom: 2}}>
                <Text style={{color:'#fff', fontSize: 13}}>{this.props.user.level_name}</Text>
              </View>
            </View>
            <View style={{alignItems:'center'}}>
              <Text style={{flex:1,fontSize:14,color:'#fff', textAlign:'right'}}>团队总人数</Text>
              <Text style={{flex:1,fontSize:30,color:'#fff',textAlign:'left'}}>{this.state.total}</Text>
            </View>
          </View>
        </LinearGradient>

        {_.map(this.state.levelList, o => (
          <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('team_detail', { id: o.id})} style={{backgroundColor:'#fff',flexDirection:'row', alignItems:'center', borderBottomWidth: 1, borderColor:'#CED0DA', paddingLeft:20, paddingTop:10,paddingBottom:10,paddingRight:15}}>
            <Image source={{uri:o.icon}} style={{width:30,height:30, borderRadius:15}} />
            <Text style={{marginLeft: 10, fontSize:15, color:'#333333'}}>{o.name}</Text>
            <Text style={{marginLeft:10, fontSize:12, color:'#9C9C9C', flex:1}}>( 直接 {o.directTotal} 家, 间接 {o.indirectTotal} 家 )</Text>
            <Text style={{fontSize:15, color:'#333333'}}>{o.directTotal + o.indirectTotal}</Text>
            <Image source={require('../assets/right-arrow.png')} style={{marginLeft:8, height:12}} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  async componentDidMount() {
    let levelList = (await axios.get('/api/m/user_level')).data;
    const { directUser, indirectUser } = (await axios.get('/api/i')).data;
    const total = _.sumBy(directUser.level, 'total') + _.sumBy(indirectUser.level, 'total');

    levelList = _(levelList).sortBy(o => o.income_money || -1).reverse()
      .map(o => ({
        ...o,
        is_show: !o.is_hidden || o.id === this.props.user.level_id,
      }))
      .map((o, i, arr) => (i === 0 ? o : {
        ...o,
        is_show: arr[i - 1].is_show || o.is_show,
      }))
      .filter('is_show')
      .value();

    // levelList = _.filter(levelList, o => !o.is_hidden || o.id === this.info.user.level_id);
    levelList = _.map(levelList, o => ({
      ...o,
      directTotal: (_.find(directUser.level, { level_id: o.id }) || { total: 0 }).total,
      indirectTotal: (_.find(indirectUser.level, { level_id: o.id }) || { total: 0 }).total,
    }));

    this.setState({total, levelList});
  }
}

export default withRedux(withNavigation(Screen));
