import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView, ImageBackground,
  Modal,
  Platform, Alert,
  NativeEventEmitter, NativeModules, DeviceEventEmitter,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';

import Swiper from 'react-native-swiper';

import ImageOK from '../../components/ImageOK';

import _ from 'lodash';
import axios from 'axios';

const { AlipayModule, WeixinModule } = NativeModules;

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

const colorArray = [
  '#FFD65E,#FAA414', '#B4EC51,#96C953', '#C2CBDE,#8A9EB9', '#89BDF8,#3485E9', '#8B62FA,#5843E9',
];

class Screen extends Component {

  state = {
    level_id: null,
    paymentList: [],
    levelList: [],
    selectPaymentVisible: false,

    resultText: '',

    cardList: [],

    loanList: [],

    selectPaymentId: null,

    formLevel: null,
    toLevel: null,
    levelIndex: 0,
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#ffffff'}}>
        <ScrollView>
          <ImageOK source={{uri: this.props.merchant.extend.level_bg}} />
        </ScrollView>

        <View style={{height:120}}>
        {this.state.levelList.length ? (
          <Swiper showsButtons={true} index={this.state.levelIndex} showsPagination={false} loop={false} style={{height:120}} onIndexChanged={index => {
            this.setState( { level_id: this.state.levelList[index].id})
          }}>
            {_.map(this.state.levelList, o => (
              <View key={o.id} style={{flex:1, padding:5}}>
                <ImageBackground source={{uri:o.app_card_bg}} style={{flex:1, flexDirection:'row', alignItems:'center'}} resizeMode="contain">
                  <View style={{flex:1, paddingLeft:114}}>
                    <Text style={{fontSize:17,lineHeight:24,color:'#FFFFFF'}}>{this.props.user.nickname}</Text>
                    <Text style={{fontSize:15,lineHeight:21,color:'#FFFFFF'}}>{o.name}</Text>
                    <Text style={{fontSize:15,lineHeight:21,color:'#FFFFFF'}}>{o.msg}</Text>
                  </View>

                  {o.msg ? null : (
                    <TouchableOpacity onPress={() => this.selectPayment()} style={{marginRight:20, backgroundColor:'#fff', justifyContent:'center', paddingHorizontal:30, paddingVertical:5, borderRadius:20}}>
                      <Text style={{color:'#F43F2C', fontSize:13, lineHeight:17}}>升级</Text>
                    </TouchableOpacity>
                  )}

                </ImageBackground>
              </View>
            ))}
          </Swiper>
        ): null}
        </View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.selectPaymentVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          {this.state.selectPaymentVisible ? (
            <View style={{flex:1}}>

              <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
                <View style={{flexDirection:'row', paddingVertical:10}}>
                  <TouchableOpacity style={{flex:1}} onPress={ () => this.setState({selectPaymentVisible: false }) }>
                    <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
                  </TouchableOpacity>
                  <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>支付</Text>
                  <View style={{flex:1}}></View>
                </View>
              </View>



              <View style={{flex:1}}>
                {_.map(this.state.paymentList, o =>(
                  <TouchableOpacity key={o.id} onPress={() => this.setState({selectPaymentId: o.id}) } style={{flexDirection:'row', alignItems:'center', padding: 10}}>
                    <Image source={{uri:o.icon}} style={{width:20, height:20}} />
                    <Text style={{marginLeft: 10, flex:1}}>{o.name}</Text>
                    <Image source={o.id === this.state.selectPaymentId ? require('../../assets/payment-checked.png') : require('../../assets/payment-unchecked.png')} style={{width:20, height:20}} />
                  </TouchableOpacity>
                ))}
                <Text style={{textAlign:'center'}}> {this.state.fromLevel.name} 升级 {this.state.toLevel.name} </Text>
                <Text style={{marginTop:10, textAlign:'center'}}>支付： {this.state.toLevel.money - this.state.fromLevel.money} 元</Text>
              </View>



              <View style={{marginBottom: this.props.marginBottom, alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.createLevelOrder(this.state.selectPaymentId)} style={{backgroundColor:'#FF300F', borderRadius:50, paddingVertical: 10, paddingHorizontal: 70,alignItems:'center'}}>
                  <Text style={{color:'#fff', fontSize: 15, lineHeight:21}}>立即支付</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

        </Modal>
      </View>
    );
  }
  async componentDidMount() {

    Platform.select({
      ios: () => {
        const alipayModuleEmitter = new NativeEventEmitter(AlipayModule);
        const weixinModuleEmitter = new NativeEventEmitter(WeixinModule);

        const subscription = alipayModuleEmitter.addListener('alipayreturn', result => {
          // Alert.alert('b-resultStatus', result.resultStatus);
          // Alert.alert('b-memo', result.memo);
          // Alert.alert('b-result', result.result);
        });
        weixinModuleEmitter.addListener('wxpayreturn', result => {
          // Alert.alert('a-errStr', result.errStr == null ? '<null>' : result.errStr);
          // Alert.alert('a-returnKey', result.returnKey);
          // Alert.alert('a-errCode', result.type);
        })
      },
      android: () => {
        DeviceEventEmitter.addListener('wxpayreturn', result => {
          this.setState({ resultText: JSON.stringify(result) })
          // Alert.alert('b-errStr', result.errStr || '');
          // Alert.alert('b-returnKey', result.returnKey);
          // Alert.alert('b-errCode', result.errCode);
        });
      }
    })()

    let levelList = (await axios.get('/api/m/user_level?order=value')).data;

    let isLowLevel = false;
    levelList = _.map(levelList, (o) => {
      let msg = '';
      if (isLowLevel) msg = '已超过该等级';
      if (o.id === this.props.user.level_id) { msg = '当前等级'; isLowLevel = true; }
      if (!o.money && !msg) msg = '升级请联系客服';
      return { ...o, msg };
    });

    const paymentList = (await axios.get('/api/payment', { params : { used_app: 1 }})).data;
    const cardList = (await axios.get('/api/m/product_card', { params: {
      is_enabled: 1,
      is_recommend: 1,
      order:'sort',
    }})).data;

    for(let i = 0; i < levelList.length; i++) {
      levelList[i].card = _((await axios.get(`/api/user_level/${levelList[i].id}/cardSource`)).data).mapKeys('source_id').mapValues('money').value();
      levelList[i].loan = _((await axios.get(`/api/user_level/${levelList[i].id}/loanPrice`)).data).mapKeys('loan_id').mapValues('money').value();
    }

    let levelIndex = _.findIndex(levelList, { id: this.props.user.level_id});
    levelIndex = levelIndex > 0 ? levelIndex - 1 : levelIndex;
    const level_id = levelList[levelIndex].id

    let loanList = (await axios.get('/api/m/product_loan', { params: {
      is_enabled: 1,
      order:'sort',
    }})).data;

    const selectPaymentId = paymentList.length ? paymentList[0].id: null;

    this.setState({ levelList, paymentList, selectPaymentId, level_id, cardList, loanList, levelIndex });
  }

  selectPayment() {

    const { level_id } = this.state;
    const toLevel = _.find(this.state.levelList, { id: level_id});

    const fromLevel = _.find(this.state.levelList, { id: this.props.user.level_id});
    this.setState({ selectPaymentVisible: true, fromLevel, toLevel });
  }

  async createLevelOrder(payment_id) {
    try {
      const { level_id } = this.state;

      const form = { to_level_id: level_id };
      ModalIndicator.show('提交中');

      const { id } = (await axios.post('/api/user_level_order', form)).data;

      const { payInfo } = (await axios.put(`/api/user_level_order/${id}/payment`, {
        payment_id,
        notify_url: `http://oem.hello.com/webhook/payment/${payment_id}`,
      })).data;

      const { alipay_app, weixin_app } = payInfo;

      ModalIndicator.hide();
      if(weixin_app) {
        WeixinModule.sendPayReq(weixin_app);
      } else if(alipay_app) {
        AlipayModule.payOrder(alipay_app, result => {
          Alert.alert('a-resultStatus', result.resultStatus);
          Alert.alert('a-memo', result.memo);
          Alert.alert('a-result', result.result);
        });
      }


      // AlipayModule.payOrder(paymentLink)
    } catch (e) {
      ModalIndicator.hide();
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }
}

export default withRedux(withNavigation(Screen));
