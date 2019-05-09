import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ImageBackground,
  Linking, Modal, Clipboard, CameraRoll,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import ViewShot from "react-native-view-shot";


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
    item: null,
    wixinVisible: false,
  }
  render() {
    return (

      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>我的客服</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {this.state.item ? (
          <View style={{flex:1,backgroundColor:'#ffffff'}}>
            <View style={{marginTop:40, alignItems:'center'}}>
              <Image source={{uri: this.state.item.head_image || this.props.merchant.extend.default_head_image}} style={{height:84, width:84, borderRadius:42}} />
              <Text style={{marginTop:10, fontSize:17, lineHeight:24, color:'#2D2828'}}>{this.state.item.nickname}</Text>
              <Text style={{fontSize:12, lineHeight:27, color:'#545454'}}>等级：{this.state.item.level_name}</Text>
            </View>

            <View style={{flexDirection:'row', marginTop: 87}}>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.state.item.mobile}`)} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/group.png')} style={{height:50, width:50, borderRadius:25}} />
                <Text style={{marginTop:10, fontSize:14, lineHeight:20, color:'#333333'}}>给我打电话</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ wixinVisible: true })} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/weixin.png')} style={{height:50, width:50, borderRadius:25}} />
                <Text style={{marginTop:10, fontSize:14, lineHeight:20, color:'#333333'}}>加我微信</Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop:25, paddingHorizontal:20}}>
              <Text style={{fontSize:12, lineHeight:17, color: '#818181'}}>专属客服是带领你加入E卡带的负责人，XXXXXX互融借条不支持在校大学生在平台上申请借款，若造成其他后果均由本人自行承担，特此声明！</Text>
            </View>
          </View>


        ) : (
          <View style={{flex:1,backgroundColor:'#ffffff'}}></View>
        )}

        {this.state.item ? (
        <Modal visible={this.state.wixinVisible} transparent animationType='fade'>
          <View style={{flex:1, justifyContent:'center', backgroundColor:'#00000099'}} >
            <View style={{backgroundColor:'#fff', marginHorizontal:35}}>
              <View style={{paddingVertical:15, borderBottomWidth: 1, borderColor:'#cdcdcd', alignItems:'center'}}>
                <Text style={{fontSize:14, lineHeight:20, color:'#545454'}}>专属客服二维码</Text>

                <TouchableOpacity onPress={() => this.setState({ wixinVisible: false })} style={{padding:10, position: 'absolute', top:0, right:0, bottom:0, justifyContent:'center'}}>
                  <Image source={require('../assets/cross.png')} style={{height:12, width:12}} />
                </TouchableOpacity>
              </View>

              <ViewShot ref={ shot => this.shot = shot} style={{alignItems:'center', paddingTop:35, paddingBottom:30}}>
                <Image source={{uri:this.state.item.weixin_qr}} style={{height:134, width:134}} />
                <Text style={{fontSize:11, lineHeight:16, color:'#545454', marginTop:5}}>扫一扫二维码，添加上级微信</Text>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontSize:11, lineHeight:16, color:'#545454', marginTop:5}}>微信号：<Text style={{color:'#FF300F'}}>{this.state.item.weixin}</Text></Text>
                  <TouchableOpacity onPress={() => {
                    Clipboard.setString(this.state.item.weixin)
                    this.setState({wixinVisible: false})
                    Toast.success('已复制');
                  }} style={{marginLeft:5, flexDirection:'row', backgroundColor:'#D8EEFF', borderRadius:50, alignItems:'center', paddingHorizontal:5, paddingVertical:2}}>
                    <Image source={require('../assets/copy.png')} style={{height:12, width:12}} />
                    <Text style={{marginLeft:3, fontSize:10, lineHeight:14, color:'#0090FF'}}>复制</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={async () => {
                  const uri = await this.shot.capture();
                  await CameraRoll.saveToCameraRoll(uri);
                  this.setState({wixinVisible: false})
                  Toast.success('已保存到相册');
                }} style={{marginLeft:5, flexDirection:'row', backgroundColor:'#D8EEFF', borderRadius:50, alignItems:'center', paddingHorizontal:5, paddingVertical:2}}>
                  <Image source={require('../assets/copy.png')} style={{height:12, width:12}} />
                  <Text style={{marginLeft:3, fontSize:10, lineHeight:14, color:'#0090FF'}}>保存到相册</Text>
                </TouchableOpacity>
              </ViewShot>
            </View>

          </View>
        </Modal>
      ) : (null)}


      </View>
    );
  }

  async componentDidMount() {
    const item = (await axios.get('/api/i/chief')).data;
    this.setState({item});
  }
}

export default withRedux(Screen)
