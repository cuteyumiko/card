import React, { Component } from 'react';
import {
  Text, View, Modal, Animated,
  TouchableOpacity, Image, ImageBackground, TouchableWithoutFeedback,
  Clipboard, CameraRoll,
  NativeModules, Dimensions,
} from 'react-native';
const { WeixinModule } = NativeModules;
import { ModalIndicator, Toast } from 'teaset';

import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode';
import ViewShot from "react-native-view-shot";

import TextInput from '../../components/JSTextInput';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setUser: (user) => dispatch(actions.app.setUser(user)),
  })
);

import _ from 'lodash';
import axios from 'axios';

import Card from './Card';
import Loan from './Loan';

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

class QRCodeImage extends Component {
  state = {
    width: D_WIDTH,
    height: 100,
    qr_x: 0, qr_y: 0, qr_width: 100, qr_height: 100,
    show: false,
  }

  capture(...args) {
    if(!this.shot) return;
    return this.shot.capture(...args);
  }
  render() {
    if(!this.state.show) return null;
    return (
      <ViewShot ref={ shot => this.shot = shot}>
        <Image source={this.props.source} style={[this.props.style, { width:this.state.width, height:this.state.height }]} />
        <View style={{ position:'absolute', left: this.state.qr_x, top: this.state.qr_y, width: this.state.qr_width}}>
          <View style={{padding:5, backgroundColor:'#fff'}}>
            <QRCode value={this.props.qr.value} size={this.state.qr_width - 10} />
          </View>
          <Text style={{marginTop:5, color: this.props.textColor, textAlign:'center'}}>{this.props.text}</Text>
        </View>
      </ViewShot>
    )
  }
  componentDidMount() {
    const default_width = D_WIDTH;
    const default_height = 100;
    const { source = {}, width, height, qr } = this.props;
    const { uri } = source;
    const [ qr_x, qr_y, qr_width, qr_height] = _.map(qr.rect.split(','), o => parseInt(o));

    let image_width = 0;
    let image_height = 0;
    let percent_width = 0;
    let percent_height = 0;

    if (/^\d+%$/.test(width)) {
      percent_width = parseFloat(width.match(/^(\d+)%$/)[1]) / 100;
    } else if(/^\d+$/.test(width)) {
      image_width = parseInt(width);
    } else {
      image_width = default_width;
    }

    if (/^\d+%$/.test(height)) {
      percent_height = parseFloat(height.match(/^(\d+)%$/)[1]) / 100;
    } else if(/^\d+$/.test(height)) {
      image_height = parseInt(height);
    } else {
      image_height = default_height;
    }

    this.setState({
      width: image_width || default_width, height: image_height || default_height,
      qr_x, qr_y, qr_width, qr_height,
    });

    if (uri && (percent_width || percent_height)) {
      Image.getSize(uri, (width, height) => {
        const scale = (default_width * percent_width) / width;

        this.setState({
          show: true,
          width: default_width * percent_width, height: height * scale,
          qr_x: qr_x * scale, qr_y: qr_y * scale,
          qr_width: qr_width * scale, qr_height: qr_height * qr_height,
        });
      })
    }
  }
}

class Screen extends Component {
  state = {
    shareVisible: false,
    qrCodeVisible: false,
    shopMessageVisible: false,
    shop_message: '',
  }

  getLink() {
    return this.props.merchant.extend.dwz_prefix ? `${this.props.merchant.extend.dwz_prefix}/s/${this.props.user.id}` : `${axios.defaults.baseURL}/shop?referee=${this.props.user.id}`;
  }
  render() {
    return (

      <View style={{flex:1, backgroundColor:'#fff', paddingBottom:10}}>
        <ImageBackground style={{backgroundColor:'#4B56C0', paddingTop:this.props.marginTop, paddingBottom:10, height:120 + this.props.marginTop}} source={{uri:this.props.merchant.extend.myshop_top_image}} resizeMode='stretch'>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>我的店铺</Text>
            <TouchableOpacity onPress={ () => this.props.navigation.push('market') } style={{flex:1, alignItems:'flex-end'}}>
              <Image source={require('../../assets/myshop.png')} style={{height:20, marginRight: 12}} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={{alignItems:'center', position:'relative', top: -40, height:50}}>
          <Image source={{uri:this.props.user.head_image || this.props.merchant.extend.default_head_image}} style={{width:80,height:80, borderRadius:40,borderWidth:2, borderColor:'#fff'}} />
          <View style={{position:'relative', top: -15, backgroundColor:'#FFC031', borderRadius:20, paddingVertical:3, paddingHorizontal:10}}>
            <Text style={{fontSize:12, lineHeight:17, color:'#fff'}}>{this.props.user.level_name}</Text>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity onPress={() => {
            this.setState({shopMessageVisible: true})
          }}>
            <Text style={{fontSize:12, color:'#B3B4B7'}}>{this.props.user.shop_message || '编辑'}</Text>
          </TouchableOpacity>
        </View>


        <ScrollableTabView locked={true} style={{flex:1}} initialPage={0} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#fff' tabBarActiveTextColor='#4959B8' tabBarInactiveTextColor='#070E38' tabBarUnderlineStyle={{height:1}} >
          <Card tabLabel='信用卡'/>
          <Loan tabLabel='贷款' />
        </ScrollableTabView>

        <TouchableOpacity onPress={() => this.setState({shareVisible:true})} style={{marginHorizontal: 10}}>
          <Image source={require('../../assets/myshop-qr.png')} style={{width:'100%', resizeMode:'contain'}} />
        </TouchableOpacity>

        <Modal visible={this.state.shareVisible} transparent animationType='fade'>
          <View style={{flex:1, backgroundColor:'rgba(160, 160, 160, 0.7)'}}>
            <View style={{flex:1}}></View>
            <View style={{flexDirection:'row', borderTopLeftRadius: 6, borderTopRightRadius:6, backgroundColor:'#fff', padding:30}}>
              <TouchableOpacity onPress={() => {
                WeixinModule.sendMessageReq({
                  webpageUrl: this.getLink(),
                  title: `${this.props.user.nickname}的HelloCard店铺`,
                  description: this.props.user.shop_message || '',
                  thumbImage: this.props.user.head_image || this.props.merchant.extend.default_head_image,
                  scene: 0,
                });
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-session.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>微信</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                WeixinModule.sendMessageReq({
                  webpageUrl: this.getLink(),
                  title: `${this.props.user.nickname}的HelloCard店铺`,
                  description: this.props.user.shop_message || '',
                  thumbImage: this.props.user.head_image || this.props.merchant.extend.default_head_image,
                  scene: 1,
                });
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-timeline.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>朋友圈</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setState({shareVisible: false, qrCodeVisible: true});
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-qr.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>生成二维码</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setState({shareVisible: false});
                Clipboard.setString(this.getLink());
                Toast.success('链接已复制');
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-link.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>链接</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.setState({shareVisible:false})} style={{marginTop:2, marginBottom:30, alignItems:'center', paddingVertical:11, backgroundColor:'#ffffff', borderRadius:6}} >
              <Text style={{fontSize:16, lineHeight:22, color:'#818181'}}>取消</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={this.state.qrCodeVisible} transparent animationType='fade'>
          <TouchableWithoutFeedback onPress={() => this.setState({qrCodeVisible: false})} style={{flex:1}}>
            <View style={{flex:1, backgroundColor:'rgba(160, 160, 160, 0.7)', justifyContent:'center'}}>

              <QRCodeImage ref={shot => this.shot = shot} width="100%" source={{uri: this.props.merchant.extend.myshop_qr_bg_image}} qr={{value:this.getLink(), rect: this.props.merchant.extend.myshop_qr_rect}} text={`推荐人：${this.props.user.nickname}`} textColor={this.props.merchant.extend.myshop_qr_text_color} />

              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={async () => {
                  const uri = await this.shot.capture();
                  await CameraRoll.saveToCameraRoll(uri);
                  this.setState({qrCodeVisible:false})
                  Toast.success('已保存到相册');
                }} style={{marginTop:33, width:200, borderRadius: 30, overflow:'hidden'}} >
                  <LinearGradient colors={[ '#FF8E14', '#FA1B0A']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{height:40, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:16, color:'#ffffff'}}>保存到相册</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal visible={this.state.shopMessageVisible} transparent animationType='fade'>

          <View style={{flex:1,alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 16, 16, 0.7)'}}>
            <View style={{width:'80%'}}>
              <View style={{marginTop: 27, backgroundColor:'#fff', borderRadius: 16, paddingHorizontal: 15, overflow:'visible'}}>

                <View style={{paddingVertical:10}}>
                  <TextInput onChangeText={shop_message => this.setState({ shop_message })} style={{marginTop:2, color:'#9C9C9C'}} placeholder='请输入店铺标题' underlineColorAndroid='transparent'/>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={async () => {
                    const { shop_message } = this.state;
                    await axios.post('/api/i/info', { shop_message });

                    const { user } = (await axios.get('/api/token_info')).data;
                    this.props.setUser(user);
                    this.setState({shopMessageVisible: false});
                  }} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>保存</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({shopMessageVisible: false})} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </Modal>

      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(Screen)
