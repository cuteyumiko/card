import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
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
  state = {
    mobile: '',
    password: '',
    sms_code_id: '',
    sms_code: '',
    referee_0_mobile: '',

    smsCountDown: 0,
    smsCountDownInterval: null,
  }

  render() {
    return (

      <View style={{flex: 1, backgroundColor:'#fff'}}>

        <ScrollView style={{flex: 1}}>

          <View style={{paddingTop: 80, paddingBottom:50, alignItems:'center', justifyContent:'center'}}>
            <Image source={require('../assets/icon-180.png')} style={{width:100, height:100}} />
          </View>
          <View style={{borderBottomWidth:1, borderColor: '#ddd', justifyContent:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30}}>
            <TextInput style={{color:'#9B9B9B', fontSize: 15}} onChangeText={mobile => this.setState({mobile})} placeholder='手机号码' selectTextOnFocus keyboardType='phone-pad' returnKeyType='next' onSubmitEditing={() => this.refs.inputPassword.focus()} underlineColorAndroid='transparent' />
          </View>

          <View style={{borderBottomWidth:1, borderColor: '#ddd', alignItems:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30, flexDirection: 'row'}}>
            <TextInput style={{flex:1,color:'#9B9B9B', fontSize: 15}} onChangeText={sms_code => this.setState({sms_code})} placeholder='验证码' selectTextOnFocus keyboardType='phone-pad' returnKeyType='next' onSubmitEditing={() => this.refs.inputPassword.focus()} underlineColorAndroid='transparent' />
            <TouchableOpacity disabled={this.state.smsCountDown > 0} onPress={() => this.fetchSmsCode() } style={{borderLeftWidth: 1, borderColor:'#D2D2D2', paddingLeft: 10}}>
              <Text style={{color:'#D2D2D2', fontSize: 13}}>{ this.state.smsCountDown > 0 ? `${this.state.smsCountDown}秒后重新获取` : '获取验证码'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:2, borderBottomWidth:1, borderColor: '#ddd', justifyContent:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30}}>
            <TextInput style={{color:'#9B9B9B', fontSize: 15}} onChangeText={password => this.setState({password})} ref='inputPassword' placeholder='请设置6-20位数字字母组合密码' secureTextEntry selectTextOnFocus onSubmitEditing={() => this.handleSubmit()} underlineColorAndroid='transparent' />
          </View>
          <View style={{borderBottomWidth:1, borderColor: '#ddd', justifyContent:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30}}>
            <TextInput style={{color:'#9B9B9B', fontSize: 15}} onChangeText={referee_0_mobile => this.setState({referee_0_mobile})} placeholder='邀请人手机号' autoFocus selectTextOnFocus keyboardType='phone-pad' returnKeyType='next' onSubmitEditing={() => this.refs.inputPassword.focus()} underlineColorAndroid='transparent' />
          </View>

          <View style={{flexDirection:'row', marginLeft:30, marginRight:30, marginTop: 48}}>
            <Text style={{color:'#9C9C9C'}}>注册即代表同意</Text><TouchableOpacity onPress={() => this.props.navigation.navigate('license')}><Text style={{color:'#3C86FE'}}>《平台注册协议》</Text></TouchableOpacity>
          </View>


          <TouchableOpacity style={{borderRadius:5, marginTop:10,justifyContent:'center', backgroundColor:'#3C86FE', height:48, marginLeft:30, marginRight:30}} onPress={() => this.submitForm()} >
            <Text style={{textAlign:'center', color:'#fff', fontSize:15}}>注册</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{borderRadius:5, borderWidth:1, borderColor:'#3C86FE', marginTop:10, justifyContent:'center', height:48, marginLeft:30, marginRight:30}} onPress={() => this.props.navigation.navigate('login')}>
            <Text style={{textAlign:'center', color:'#3C86FE', fontSize:15}}>使用已有账号登陆</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.smsCountDownInterval) {
      clearInterval(this.smsCountDownInterval);
      this.smsCountDownInterval = null;
    }
  }

  async submitForm() {
    const form = _.pick(this.state, ['mobile', 'password', 'sms_code_id', 'sms_code', 'referee_0_mobile']);

    const [errno, errmsg] = (!form.mobile && [1, '请输入手机号'])
                            || (!form.sms_code_id && [2, '请获取验证码'])
                            || (!form.sms_code && [2, '请输入验证码'])
                            || (!form.password && [3, '密码不能为空'])
                            || (!form.referee_0_mobile && [3, '推荐人不能为空'])
                            || [0, ''];

    if (errno) {
      Toast.fail(errmsg);
      return;
    }

    try {
      ModalIndicator.show('提交中...');
      await axios.post('/api/register', form);
      form.auth_type = 'oem-mobile';
      const { display_name, token, user } = (await axios.post('/api/v2/authorize', form)).data;
      ModalIndicator.hide();
      Toast.success('注册成功');
      const home = this.props.merchant.extend.app_fenxiao_hide == '0' ? 'home' : 'home2';
      this.props.navigation.replace(home)
    } catch (e) {
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }

  async fetchSmsCode() {
    const { mobile } = this.state;

    const [errno, errmsg] = (!mobile && [1, '请输入手机号'])
                            || [0, ''];
    if(errno) {
      Toast.fail(errmsg);
      return;
    }

    this.setState({ smsCountDown: 30 });

    try {
      const { id: sms_code_id } = (await axios.post('/api/sms_code', { mobile, code: 'join.code' })).data;
      this.setState( { sms_code_id });
      this.smsCountDownInterval = setInterval(() => {
        const smsCountDown = this.state.smsCountDown - 1;

        this.setState( { smsCountDown })

        if (smsCountDown <= 0) {
          clearInterval(this.smsCountDownInterval);
          this.smsCountDownInterval = null;
        }
      }, 1000);

    } catch (e) {
      this.setState({ smsCountDown: 0 });
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }
}

export default withRedux(Screen);
