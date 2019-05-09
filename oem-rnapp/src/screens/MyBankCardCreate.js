import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, TextInput, ScrollView,
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
    setBankList: (bankList) => dispatch(actions.app.setBankList(bankList)),
  })
);

class Screen extends Component {

  state = {
    bank_card_no: '',
    mobile: '',
    idno: '',
  }
  render() {

    const bank = this.bank();
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>添加银行卡</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex:1, backgroundColor:'#eee'}}>
          <View style={{flexDirection:'row', paddingHorizontal:30, paddingVertical:20, backgroundColor:'#fff'}}>
            <Text style={{width:90, fontSize:15, lineHeight:21, color:'#383333'}}>持卡人</Text>
            <Text style={{flex:1, fontSize:15, lineHeight:21, color:'#383333'}}>{this.props.user.name}</Text>
          </View>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('selectBank')} style={{marginTop:1, backgroundColor:'#fff', flexDirection:'row', paddingHorizontal:30, paddingVertical:20}}>
            <Text style={{width:90, fontSize:15, lineHeight:21, color:'#383333'}}>开户银行</Text>

            { bank ? (
              <Text style={{flex:1, fontSize:15, lineHeight:21, color:'#383333'}}>{bank.name}</Text>
            ) : (
              <Text style={{flex:1, fontSize:15, lineHeight:21, color:'#C1C1C1'}}>{'请选择开户银行'}</Text>
            ) }

          </TouchableOpacity>

          <View style={{flexDirection:'row', paddingHorizontal:30, paddingVertical:20, marginTop:1, backgroundColor:'#fff', }}>
            <Text style={{width:90, fontSize:15, lineHeight:21, color:'#383333'}}>银行卡号</Text>
            <TextInput onChangeText={bank_card_no => this.setState({bank_card_no})} style={{flex:1, padding:0, fontSize:15, lineHeight:21}} underlineColorAndroid='transparent' placeholder='请输入银行卡号' />
          </View>

          <View style={{flexDirection:'row', paddingHorizontal:30, paddingVertical:20, marginTop:1, backgroundColor:'#fff', }}>
            <Text style={{width:90, fontSize:15, lineHeight:21, color:'#383333'}}>手机号码</Text>
            <TextInput onChangeText={mobile => this.setState({mobile})} style={{flex:1, padding:0, fontSize:15, lineHeight:21}} underlineColorAndroid='transparent' placeholder='请输入手机号码' />
          </View>

          <View style={{flexDirection:'row', paddingHorizontal:30, paddingVertical:20, marginTop:1, backgroundColor:'#fff', }}>
            <Text style={{width:90, fontSize:15, lineHeight:21, color:'#383333'}}>身份证号</Text>
            <TextInput onChangeText={idno => this.setState({idno})} style={{flex:1, padding:0, fontSize:15, lineHeight:21}} underlineColorAndroid='transparent' placeholder='请输入身份证号' />
          </View>

          <TouchableOpacity onPress={async () => {
            const form = _.pick(this.state, ['bank_card_no', 'mobile', 'idno']);
            form.bank_id = this.props.bankId;
            form.bank_card_name = this.props.user.name;

            try {
              ModalIndicator.show('提交中');
              await axios.post('/api/user_bank_card', form);
              ModalIndicator.hide();

              this.props.navigation.pop()
            } catch (e) {
              ModalIndicator.hide();
              const message = e.response ? e.response.data : e.message;
              Toast.fail(message || '绑卡失败，请检查填写信息是否有误');
            }

          }} style={{marginTop:20, backgroundColor:'#FF300F', paddingVertical:10, marginHorizontal: 85, alignItems:'center', borderRadius:50}}>
            <Text style={{color:'#FFFFFF', fontSize:15, lineHeight:21}}>确认添加</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  bank() {
    if(!this.props.bankId) return null;
    return _.find(this.props.bankList, { id: this.props.bankId });
  }

  async componentDidMount() {
    const list = (await axios.get('/api/bank')).data;
    this.props.setBankList(list);
  }
}

export default withRedux(Screen)
