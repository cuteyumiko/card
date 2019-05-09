import React, { Component } from 'react';
import {
  Text, View, Modal, ImageBackground, CameraRoll,
  TouchableOpacity, Image, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import { ModalIndicator, Toast } from 'teaset';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode';
import ViewShot from "react-native-view-shot";

import _ from 'lodash';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

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
    qrCodeVisible: false,
  }
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

        <TouchableOpacity onPress={() => this.props.navigation.navigate('shareJoinLink')} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
          <Image source={require('../assets/zhuceyaoqingerweima.png')} style={{width:40}} />
          <Text style={{flex:1, marginLeft: 12}}>注册邀请二维码</Text>
          <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
            <Text style={{color:'#FF300F'}}>查看</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setState({qrCodeVisible: true})} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
          <Image source={require('../assets/chanpindianpuerweima.png')} style={{width:40}} />
          <Text style={{flex:1, marginLeft: 12}}>产品店铺二维码</Text>
          <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
            <Text style={{color:'#FF300F'}}>分享</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('shareFaceJoin')} style={{flexDirection:'row',marginHorizontal: 15, marginTop:10, paddingHorizontal:20, paddingVertical:25, borderWidth:0.5, borderColor:'#DDE2FF', alignItems:'center'}}>
          <Image source={require('../assets/mianduimiankaitongzhanghao.png')} style={{width:40}} />
          <Text style={{flex:1, marginLeft: 12}}>面对面开通账号</Text>
          <View style={{borderWidth: 0.5, borderColor:'#FF300F', borderRadius:50, paddingHorizontal: 16, paddingVertical: 4}}>
            <Text style={{color:'#FF300F'}}>开通</Text>
          </View>
        </TouchableOpacity>


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
      </View>
    );
  }
  getLink() {
    return this.props.merchant.extend.dwz_prefix ? `${this.props.merchant.extend.dwz_prefix}/s/${this.props.user.id}` : `${axios.defaults.baseURL}/shop?referee=${this.props.user.id}`;
  }
  componentDidMount() {
  }
}

export default withRedux(withNavigation(Screen));
