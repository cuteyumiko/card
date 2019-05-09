import React, { Component } from 'react';
import {
  Text, View, Linking,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

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
    lunboList: []
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <View style={{flex:1}}></View>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>Hello客</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        <ScrollView style={{flex: 1, backgroundColor:'#eee'}}>

          <View style={{height:130}}>
            {this.state.lunboList.length ? (
              <Swiper height={130} autoplay={true} showsPagination={false}>

                {_.map(this.state.lunboList, o => (
                  <TouchableOpacity key={o.id} onPress={() => {
                    if (o.href) {
                      Linking.openURL(o.href);
                    } else {
                      this.props.navigation.navigate('collegeDetail', { id: o.id})
                    }
                  }} style={{flex:1, justifyContent:'center'}}>
                    <Image source={{uri:o.icon}} style={{height:130}} />
                  </TouchableOpacity>
                ))}
              </Swiper>
            ) : null}
          </View>

          <ScrollView horizontal style={{padding: 10, backgroundColor:'#fff'}} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('myshop')} style={{marginLeft: 10}}>
              <LinearGradient colors={[ '#257FFF', '#2AD6FF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{borderRadius:10, width:130, height:80, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:20, color:'#fff'}}>我的店铺</Text>
                <Text style={{marginTop:3, fontSize:12, color:'#fff'}}>个人专属 商品管理</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('myincome')} style={{marginLeft: 10}}>
              <LinearGradient colors={[ '#FF3C11', '#FFBB47']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{borderRadius:10, width:130, height:80, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:20, color:'#fff'}}>我的收益</Text>
                <Text style={{marginTop:3, fontSize:12, color:'#fff'}}>收益明细 一目了然</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('record')} style={{marginLeft: 10}}>
              <LinearGradient colors={[ '#21D9E1', '#8BBA00']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{borderRadius:10, width:130, height:80, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:20, color:'#fff'}}>客户列表</Text>
                <Text style={{marginTop:3, fontSize:12, color:'#fff'}}>申请记录 业绩明细</Text>
              </LinearGradient>
            </TouchableOpacity>

          </ScrollView>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('share')} style={{flexDirection:'row', padding: 15, alignItems:'center', backgroundColor:'#fff'}}>
            <View style={{flex:1, marginLeft: 5}}>
              <Text style={{fontSize: 18, color: '#212C67'}}>推荐有礼</Text>
              <Text style={{marginTop: 4, fontSize: 13, color: '#AFB4D2'}}>一“荐”钟情 壕送现金</Text>
            </View>
            <View>
              <Image source={require('../assets/tuijianyouli.png')} style={{width:48, height:48}} />
            </View>
            <View>
              <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft:10}} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('buyLevel')} style={{flexDirection:'row', padding: 15, alignItems:'center', backgroundColor:'#fff'}}>
            <View style={{flex:1, marginLeft: 5}}>
              <Text style={{fontSize: 18, color: '#212C67'}}>购买代理</Text>
              <Text style={{marginTop: 4, fontSize: 13, color: '#AFB4D2'}}>一“荐”钟情 壕送现金</Text>
            </View>
            <View>
              <Image source={require('../assets/goumaidaili.png')} style={{width:48, height:48}} />
            </View>
            <View>
              <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft:10}} />
            </View>
          </TouchableOpacity>

          <View style={{flexDirection:'row', flexWrap:'wrap', backgroundColor:'#fff', padding: 10}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('extendImage', { title: '项目介绍', key:'project_info'})} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/xiangmujieshao.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>项目介绍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('bkgeTable')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/yongjinbiao.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>佣金表</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('shareCopyLibrary')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/tuiguangwenan.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>推广文案</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('team')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/tuanduiguanli.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>团队管理</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('faq')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/changjianwenti.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>常见问题</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('notice')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/tongzhi.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>通知</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('rank')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/rank.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>排行榜</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('wuliao')} style={{width:'25%', alignItems:'center', padding: 5, marginVertical: 10}}>
              <Image source={require('../assets/dituiwuliao.png')} style={{width:30,height:30}} resizeMode='contain' />
              <Text style={{marginTop:5, fontSize:14, color:'#212C67'}}>地推物料</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </View>
    );
  }
  async componentDidMount() {
    const [lunboList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'course', method: 'filter', query: { merchant_id: this.props.merchant.id, type_code: 'market_lunbo' } }),
    ])).data;

    this.setState({lunboList});
  }
}

export default withRedux(Screen)
