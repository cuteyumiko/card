import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ImageBackground,
  Linking, Modal, Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

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
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>关于我们</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{flex:1, backgroundColor:'#fff'}}>

          <View style={{paddingTop:30, paddingBottom: 30, alignItems:'center'}}>
            <Image source={require('../assets/icon-180.png')} style={{width:60, height:60}} />
            <Text style={{marginTop:5}}>{'HelloCard 1.3.0'}</Text>
          </View>

          <View style={{flexDirection:'row', marginLeft: 10, paddingRight:10, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{flex:1}}>公司名称</Text>
            <Text style={{color:'#444'}}>{this.props.merchant.company_name}</Text>
          </View>

          <TouchableOpacity onPress={() => {
            if(this.props.merchant.extend.company_website){
              if(this.props.merchant.extend.company_website.indexOf('://') > 0) {
                Linking.openURL(this.props.merchant.extend.company_website)
              } else {
                Linking.openURL(`http://${this.props.merchant.extend.company_website}`)
              }
            }
          }} style={{flexDirection:'row', marginLeft: 10, paddingRight:10, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{flex:1}}>公司官网</Text>
            <Text style={{color:'#444'}}>{this.props.merchant.extend.company_website}</Text>
            <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft: 10}} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if(this.props.merchant.extend.hotline){
              Linking.openURL(`tel:${this.props.merchant.extend.hotline}`)
            }
          }} style={{flexDirection:'row', marginLeft: 10, paddingRight:10, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{flex:1}}>客服热线</Text>
            <Text style={{color:'#444'}}>{this.props.merchant.extend.hotline}</Text>
            <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft: 10}} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if(this.props.merchant.extend.njwh_infiniti){
              Clipboard.setString(this.props.merchant.extend.njwh_infiniti);
              Toast.success('已复制');
            }
          }} style={{flexDirection:'row', marginLeft: 10, paddingRight:10, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{flex:1}}>微信服务号</Text>
            <Text style={{color:'#444'}}>{this.props.merchant.extend.njwh_infiniti}</Text>
            <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft: 10}} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if(this.props.merchant.extend.service_weixin) {
              Clipboard.setString(this.props.merchant.extend.service_weixin);
              Toast.success('已复制');
            }
          }} style={{flexDirection:'row', marginLeft: 10, paddingRight:10, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{flex:1}}>客服微信号</Text>
            <Text style={{color:'#444'}}>{this.props.merchant.extend.service_weixin}</Text>
            <Image source={require('../assets/right-arrow.png')} style={{height:12, marginLeft: 10}} />
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  async componentDidMount() {
  }
}

export default withRedux(Screen)
