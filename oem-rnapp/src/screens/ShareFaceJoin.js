import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { ModalIndicator, Toast } from 'teaset';

import _ from 'lodash';
import axios from 'axios';

import TextInput from '../components/JSTextInput';

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
    sms_code_id: null,
    sms_code: '',
    password: '',

    smsCountDown: 0,
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>面对面开通帐号</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{borderWidth:0.5, borderColor:'#DDE2FF', marginHorizontal:15, marginVertical: 20, paddingHorizontal:25, paddingTop:20, paddingBottom: 100}}>

          <View style={{alignItems:'center', marginTop:22}}>
            <Image source={require('../assets/facejoin.png')} style={{width:92,height:92}} />
          </View>
          <View style={{marginTop:8, paddingHorizontal: 6, paddingVertical: 10, borderWidth:0.5, borderColor:'#DBE0EE'}}>
            <TextInput onChangeText={mobile => this.setState({mobile})} style={{fontSize:14, lineHeight:20, padding:0}} placeholder='请输入手机号' underlineColorAndroid='transparent' />
          </View>

          <View style={{marginTop:11, flexDirection:'row', marginTop:8, paddingHorizontal: 6, paddingVertical: 10, borderWidth:0.5, borderColor:'#DBE0EE'}}>
            <TextInput onChangeText={sms_code => this.setState({sms_code})} style={{fontSize:14, lineHeight:20, padding:0, flex:1}} placeholder='请输入验证码' underlineColorAndroid='transparent' />
            <TouchableOpacity disabled={this.state.smsCountDown > 0} onPress={async () => {
              const { mobile } = this.state;
              try {
                if (!/^1\d{10}$/.test(mobile)) throw new Error('请输入正确的手机号');

                this.setState({ smsCountDown: 30 })

                ModalIndicator.show('提交中');
                const { id: sms_code_id } = (await axios.post('/api/sms_code', { mobile, code: 'join.code' })).data;
                ModalIndicator.hide();

                this.setState({ sms_code_id });
                this.smsCountDownInterval = setInterval(() => {
                  const smsCountDown = this.state.smsCountDown - 1;
                  this.setState({ smsCountDown })

                  if (smsCountDown <= 0) {
                    clearInterval(this.smsCountDownInterval);
                    this.smsCountDownInterval = null;
                  }
                }, 1000);
                Toast.success('短信码已成功发出');
              } catch (e) {
                ModalIndicator.hide();
                const message = e.response ? e.response.data : e.message;
                Toast.fail(message);
              }

            }}>
              <Text style={{fontSize:13, lineHeight:18, color:'#4959B8'}}>{this.state.smsCountDown > 0 ? `${this.state.smsCountDown}秒后重新获取` : '发送验证码'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:8, paddingHorizontal: 6, paddingVertical: 10, borderWidth:0.5, borderColor:'#DBE0EE'}}>
            <TextInput onChangeText={password => this.setState({password})} style={{fontSize:14, lineHeight:20, padding:0}} placeholder='请输入密码' underlineColorAndroid='transparent' />
          </View>

          <View style={{marginTop:8, paddingHorizontal: 6, paddingVertical: 10, borderWidth:0.5, borderColor:'#DBE0EE'}}>
            <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>{this.props.user.mobile}</Text>
          </View>

          <TouchableOpacity onPress={async () => {
            const form = _.pick(this.state, ['mobile', 'sms_code', 'sms_code_id', 'password'])
            form.referee_0_mobile = this.props.user.mobile;
            try {
              ModalIndicator.show('提交中');
              await axios.post('/api/register', form);
              ModalIndicator.hide();
              Toast.success(`注册成功，${form.mobile}`);
              this.props.navigation.pop();
            } catch (e) {
              ModalIndicator.hide();
              const message = e.response ? e.response.data : e.message;
              Toast.fail(message);
            }
          }} style={{alignItems:'center', marginTop: 50}}>
            <View style={{backgroundColor:'#FF300F', borderRadius: 50, paddingHorizontal: 88, paddingVertical: 10}}>
              <Text style={{fontSize:15, color:'#fff'}}>注册</Text>
            </View>
          </TouchableOpacity>

          <View style={{flexDirection:'row', marginTop: 10, justifyContent:'center'}}>
            <Text style={{fontSize:13, color:'#AFB4D2'}}>我已阅读并同意</Text><TouchableOpacity onPress={() => this.props.navigation.navigate('license')}><Text style={{color:'#3C86FE'}}>《平台注册协议》</Text></TouchableOpacity>

          </View>
        </View>


      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(withNavigation(Screen));
