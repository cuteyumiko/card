import React, { Component } from 'react';
import {
  Text, View, Image, Modal, Clipboard,
  TouchableOpacity, ScrollView, WebView,
  Dimensions,
  NativeModules,
} from 'react-native';
const { WeixinModule } = NativeModules;
import { ModalIndicator, Toast } from 'teaset';

import { withNavigation } from 'react-navigation';

import TinymceView from '../../components/TinymceView';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

const reduxWrap = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  state = {
    item: null,
    shareVisible: false,
  }
  render() {
    const { item, card, loan } = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>Hello学院</Text>
            <TouchableOpacity onPress={() => this.setState({shareVisible:true})} style={{flex:1}}>
              <Text style={{marginRight: 12, textAlign:'right', color:'#fff'}}>分享</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item ? (
          <ScrollView style={{backgroundColor:'#fff'}}>
          {item.name ? (
            <View style={{padding: 5}}>
              <Text style={{fontSize:16, color:'#000', fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{marginTop:5, textAlign:'right', fontSize:12, color:'#ddd'}}>{moment(item.create_time).format('YYYY-MM-DD')}</Text>
            </View>
          ) : null}
            <TinymceView html={item.content} style={{padding: item.name ? 10 : 0}}/>
            <TinymceView html={item.vip_content} style={{padding: item.name ? 10 : 0}} />
          </ScrollView>
        ) : null}

        {item ? (
        <Modal visible={this.state.shareVisible} transparent animationType='fade'>
          <View style={{flex:1, backgroundColor:'rgba(160, 160, 160, 0.7)'}}>
            <View style={{flex:1}}></View>
            <View style={{flexDirection:'row', borderTopLeftRadius: 6, borderTopRightRadius:6, backgroundColor:'#fff', padding:30}}>
              <TouchableOpacity onPress={() => {
                WeixinModule.sendMessageReq({
                  webpageUrl: `${axios.defaults.baseURL}/course_detial?id=${item.id}&referee=${this.props.user.id}`,
                  title: item.name,
                  description: item.content.replace(/<\/?.+?>/g,'').substr(10),
                  thumbImage: item.icon,
                  scene: 0,
                });
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-session.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>微信</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                WeixinModule.sendMessageReq({
                  webpageUrl: `${axios.defaults.baseURL}/course_detial?id=${item.id}&referee=${this.props.user.id}`,
                  title: item.name,
                  description: item.content.replace(/<\/?.+?>/g,'').substr(10),
                  thumbImage: item.icon,
                  scene: 1,
                });
              }} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../../assets/share-timeline.png')} style={{height:54, width:54}} />
                <Text style={{marginTop:10, fontSize:13, lineHeight:18, color:'#818181'}}>朋友圈</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setState({shareVisible: false});
                Clipboard.setString(`${axios.defaults.baseURL}/course_detial?id=${item.id}&referee=${this.props.user.id}`,);
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
        ) : null}

      </View>
    );
  }
  async componentDidMount() {
    const { id } = this.props.navigation.state.params;
    const item = (await axios.get(`/api/course/${id}`)).data;
    this.setState({item});
  }
}

export default withRedux(withNavigation(Screen));
