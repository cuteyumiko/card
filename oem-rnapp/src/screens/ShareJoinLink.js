import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, Dimensions, ScrollView, TouchableWithoutFeedback,
  CameraRoll,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import { ModalIndicator, Toast } from 'teaset';
import QRCode from 'react-native-qrcode';
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

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

class QRCodeImage extends Component {
  state = {
    width: D_WIDTH,
    height: 100,
    qr_x: 0, qr_y: 0, qr_width: 100, qr_height: 100,
  }

  capture(...args) {
    return this.shot.capture(...args);
  }
  render() {
    return (
      <ViewShot ref={ shot => this.shot = shot}>
        <Image source={this.props.source} style={[this.props.style, { width:this.state.width, height:this.state.height }]} />
        <View style={{ position:'absolute', left: this.state.qr_x - 50, top: this.state.qr_y, width: this.state.qr_width + 100, alignItems:'center'}}>
          <View style={{padding:5, backgroundColor:'#fff'}}>
            <QRCode value={this.props.qr.value} size={this.state.qr_width - 10} />
          </View>
          <Text style={{marginTop:5, color: this.props.textColor}}>{this.props.text}</Text>
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
    list: [],
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>分享注册邀请链接</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollableTabView style={{flex:1}} page={0} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#4959B8' tabBarActiveTextColor='#FEC51D' tabBarInactiveTextColor='#fff' tabBarUnderlineStyle={{height:0}}>
          {_.map(this.state.list, o => (
            <ScrollView tabLabel={o.name} key={o.id}>
              <QRCodeImage ref={ref => this[`tab_${o.id}`] = ref} width="100%" source={{uri: o.image}} qr={{value:`${axios.defaults.baseURL}/join?referee=${this.props.user.id}`, rect: o.qr_rect}} text={`推荐人：${this.props.user.nickname}`} textColor={o.text_color} />

              <TouchableOpacity onPress={async () => {
                const uri = await this[`tab_${o.id}`].capture();
                await CameraRoll.saveToCameraRoll(uri);
                Toast.success('已保存到相册');
              }} style={{marginTop:10, backgroundColor:'#3975F7', paddingVertical:13, marginHorizontal: 50, borderRadius:50, alignItems:'center'}}>
                <Text style={{fontSize: 17, lineHeight: 24, color: '#fff'}}>保存到相册</Text>
              </TouchableOpacity>
            </ScrollView>
          ))}
        </ScrollableTabView>


      </View>
    );
  }
  async componentDidMount() {
    const list = (await axios.get('/api/m/merchant_bill', { params: {
      order: 'sort',
      type_code: 'share',
    }})).data;
    this.setState({list});
  }
}

export default withRedux(withNavigation(Screen));
