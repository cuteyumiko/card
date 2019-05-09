import React, { Component } from 'react';
import {
  Text, View, Modal, ImageBackground, CameraRoll,
  TouchableOpacity, Image, TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import { ModalIndicator, Toast } from 'teaset';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>推广有礼</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'zhaoshangyilabao', title: '招商易拉宝' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/zhaoshangyilabao.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>招商易拉宝</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>查看</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'xiangmuyilabao', title: '项目介绍易拉宝' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/xiangmuyilabao.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>项目介绍易拉宝</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>分享</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'xuanchuandan', title: '宣传单' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/xuanchuandan.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>宣传单</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>查看</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'sanzheye', title: '三折页' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/sanzheye.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>三折页</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>查看</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'tingchepai', title: '停车牌' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/tingchepai.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>停车牌</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>查看</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('merchantBill', { type_code: 'fenxiangtaika', title: '分享台卡' })} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
            <Image source={require('../assets/fenxiangtaika.png')} style={{width:40, height:40}} resizeMode='contain' />
            <Text style={{flex:1, marginLeft: 12}}>分享台卡</Text>
            <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
              <Text style={{color:'#FF300F'}}>查看</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(withNavigation(Screen));
