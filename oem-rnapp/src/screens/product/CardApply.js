import React, { Component } from 'react';
import {
  Text, View, Linking,
  TouchableOpacity, TouchableHighlight, Image, ScrollView, Modal,
} from 'react-native';

import { ModalIndicator, Toast } from 'teaset';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';

import ImageOK from '../../components/ImageOK';
import TinymceView from '../../components/TinymceView';
import TextInput from '../../components/JSTextInput';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';

const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Apply extends Component {
  render() {
    return (
      <Text>申请</Text>
    )
  }
}

class Info extends Component {
  render() {
    return (
      <Text>申请</Text>
    )
  }
}

class Screen extends Component {
  state = {
    item: null,
    formVisible: false,
    name: '',
    mobile: '',
    idno: '',
    isAgree: true,
    agreeVisible: false,
    baoxianVisible: false,
  }
  render() {
    const item = this.state.item;
    return (
      <View style={{flex:1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>产品申请</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {item ? (
          <View style={{flex:1}}>

            <ScrollView style={{flex:1}}>
              <ImageOK source={{uri: this.state.item.apply_bg}} />
            </ScrollView>
            <View style={{position:'absolute', bottom: 0, left:0, right:0, paddingBottom: this.props.marginBottom, backgroundColor:'#ffffff'}}>
              <TouchableOpacity onPress={ () => this.setState({formVisible: true})} style={{backgroundColor:'#3975F7', paddingVertical:13, marginHorizontal: 50, borderRadius:50, alignItems:'center'}}>
                <Text style={{fontSize: 17, lineHeight: 24, color: '#fff'}}>立即申请</Text>
              </TouchableOpacity>
              <View style={{alignItems:'center', marginTop:10}}>
                <Text style={{fontSize:14, color:'#FF5636'}}>{this.state.item.got_count}人已申请</Text>
              </View>
            </View>


          </View>
        ) : null}

        <Modal visible={this.state.formVisible} transparent animationType='fade'>
          <View style={{flex:1,alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 16, 16, 0.7)'}}>
            <View style={{width:'80%'}}>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.setState({formVisible:false})}>
                  <Image source={require('../../assets/close.png')} style={{height:30, width:30}} />
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 27, backgroundColor:'#fff', borderRadius: 16, paddingHorizontal: 15, overflow:'visible'}}>

                <View style={{marginTop:30, flexDirection:'row', borderWidth:1, borderColor:'#CCCCCC', height:44, alignItems:'center'}}>
                  <Image source={require('../../assets/apply-name.png')} style={{marginLeft:10, width:20,height:20}} resizeMode='contain' />
                  <TextInput onChangeText={ name => this.setState({ name }) } value={this.state.name} style={{marginLeft:14, flex:1, marginLeft: 10, fontSize:16}} placeholder='请输入姓名' underlineColorAndroid='transparent' />
                </View>

                <View style={{marginTop:10, flexDirection:'row', borderWidth:1, borderColor:'#CCCCCC', height:44, alignItems:'center'}}>
                  <Image source={require('../../assets/apply-mobile.png')} style={{marginLeft:10, width:20,height:20}} resizeMode='contain' />
                  <TextInput onChangeText={ mobile => this.setState({ mobile }) } value={this.state.mobile} style={{marginLeft:14, flex:1, marginLeft: 10, fontSize:16}} placeholder='请输入手机号' underlineColorAndroid='transparent' />
                </View>

                <View style={{marginTop:10, flexDirection:'row', borderWidth:1, borderColor:'#CCCCCC', height:44, alignItems:'center'}}>
                  <Image source={require('../../assets/apply-idno.png')} style={{marginLeft:10, width:20,height:20}} resizeMode='contain' />
                  <TextInput onChangeText={ idno => this.setState({ idno }) } value={this.state.idno} style={{marginLeft:14, flex:1, marginLeft: 10, fontSize:16}} placeholder='请输入身份证号' underlineColorAndroid='transparent' />
                </View>

                <View style={{marginTop:20, marginBottom:45}}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={ () => this.setState({isAgree: !this.state.isAgree})} style={{borderWidth:0.5, borderColor:'#4959B8', padding: 3, borderRadius:8}}>
                      <View style={{backgroundColor: this.state.isAgree ? '#4959B8' : '#ffffff', width:6, height: 6, borderRadius:4}}></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.setState({isAgree: !this.state.isAgree})} style={{marginLeft:5}}>
                      <Text style={{fontSize:12, color:'#999999'}}>我已阅读并同意</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.setState({agreeVisible: true, formVisible: false})}>
                      <Text style={{fontSize:12, color:'#4b5ab5'}}>{'<HelloCard平台服务协议>'}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={ () => this.setState({baoxianVisible: true, formVisible: false})} style={{marginLeft:17, marginTop:8}}>
                    <Text style={{fontSize:10, color:'#D2D2D2'}}>{'领取100万意外险。本人同意保险公司后续致电确认投保状态及相关事宜。查看<活动规则及重要告知与申明>'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{position: 'relative', top:-17, left:0, right:0, alignItems:'center'}}>
                <TouchableHighlight underlayColor='#559DFE' onPress={() => this.submitForm()} style={{borderRadius:20, overflow:'hidden'}}>
                  <LinearGradient colors={[ '#3975F7', '#559DFE']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{width:206, padding: 10,  height:40, alignItems:'center'}}>
                    <Text style={{fontSize:17, color:'#fff'}}>立即申请</Text>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.agreeVisible} transparent animationType='fade'>
          <View style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
              <View style={{flexDirection:'row', paddingVertical:10}}>
                <TouchableOpacity style={{flex:1}} onPress={ () => this.setState({agreeVisible: false, formVisible: true}) }>
                  <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
                </TouchableOpacity>
                <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>HelloCard平台服务协议</Text>
                <View style={{flex:1}}></View>
              </View>
            </View>

            <ScrollView style={{flex:1, padding:10}}>
              <TinymceView html={this.props.merchant.extend.agreement} style={{paddingBottom: this.props.marginBottom}} />
            </ScrollView>
          </View>
        </Modal>

        <Modal visible={this.state.baoxianVisible} transparent animationType='fade'>
          <View style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
              <View style={{flexDirection:'row', paddingVertical:10}}>
                <TouchableOpacity style={{flex:1}} onPress={ () => this.setState({baoxianVisible: false, formVisible: true}) }>
                  <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
                </TouchableOpacity>
                <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>活动规则及重要告知与申明</Text>
                <View style={{flex:1}}></View>
              </View>
            </View>

            <ScrollView style={{flex:1, padding:10}}>
              <TinymceView html={this.props.merchant.extend.baoxian_license} style={{paddingBottom: this.props.marginBottom}} />
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
  async componentDidMount() {
    const { id } = this.props.navigation.state.params;
    const item = (await axios.get(`/api/m/product_card/${id}`)).data;
    this.setState({item});
  }

  async submitForm() {
    this.setState({formVisible: false});
    const { isAgree } = this.state;

    const form = _.pick(this.state, ['name', 'mobile', 'idno'])

    const [errno, errmsg] =  (!isAgree && [1, '必须同意协议'])
                          || (!form.name && [1, '请输入姓名'])
                          || (!form.mobile && [3, '请输入手机号'])
                          || (!form.idno && [2, '请输入身份证号'])
                          || (!/^\d{17}(\d|X|x)$/.test(form.idno) && [3, '身份证格式有误'])
                          || (!/^1\d{10}$/.test(form.mobile) && [4, '手机号格式有误'])
                          || [0, ''];
    if (errno) {
      Toast.fail(errmsg);
      setTimeout(() => this.setState({formVisible: true}), 2000)
      return;
    }
    form.card_id = this.state.item.id;
    form.creator_id = this.props.user.id;

    try {
      ModalIndicator.show('提交中...');
      await axios.post('/api/product_card_order', form);
      this.setState({name:'', mobile: '', idno: ''})
      ModalIndicator.hide();

      const href = this.state.item.merchant_href || this.state.item.href;
      if (href) Linking.openURL(href);
    } catch (e) {
      ModalIndicator.hide();
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }

}

export default withRedux(Screen)
