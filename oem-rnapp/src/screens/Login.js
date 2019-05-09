import React, { Component } from 'react';
import {
  Text, View, TextInput, ImageBackground,
  TouchableOpacity, Image, ScrollView, AsyncStorage,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setToken: (token) => dispatch(actions.app.setToken(token)),
    setUser: (user) => dispatch(actions.app.setUser(user)),
  })
);

class Screen extends Component {

  state = {
    mobile: '',
    password: '',
  }
  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:80, paddingBottom: 50, alignItems:'center'}}>
          <Image source={require('../assets/icon-180.png')} style={{width:100, height:100}} />
        </View>
        <View style={{borderBottomWidth:1, borderColor: '#ddd', justifyContent:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30}}>
          <TextInput style={{color:'#9B9B9B', fontSize: 15}} onChangeText={mobile => this.setState({mobile})} placeholder='请输入手机号码' selectTextOnFocus keyboardType='phone-pad' returnKeyType='next' onSubmitEditing={() => this.refs.inputPassword.focus()} underlineColorAndroid='transparent' />
        </View>

        <View style={{borderBottomWidth:1, borderColor: '#ddd', marginTop:2, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, justifyContent:'center', backgroundColor:'#fff', height: 64, marginLeft:30, marginRight:30}}>
          <TextInput style={{color:'#9B9B9B', fontSize: 15}} onChangeText={password => this.setState({password})} ref='inputPassword' placeholder='请输入密码' secureTextEntry selectTextOnFocus onSubmitEditing={() => this.handleSubmit()} underlineColorAndroid='transparent' />
        </View>

        <View style={{flexDirection:'row', marginLeft:30, marginRight:30}}>
          <View style={{flex:1}}></View>
          <TouchableOpacity style={{marginTop:10}} onPress={() => this.props.navigation.navigate('forgot')}>
            <Text style={{textAlign:'center', color:'#3C86FE', fontSize:13}}>忘记密码？</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{borderRadius:5, marginTop:10,justifyContent:'center', backgroundColor:'#3C86FE', height:48, marginLeft:30, marginRight:30}} onPress={() => this.handleSubmit()} >
          <Text style={{textAlign:'center', color:'#fff', fontSize:15}}>登陆</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderRadius:5, borderWidth:1, borderColor:'#3C86FE', marginTop:10, justifyContent:'center', height:48, marginLeft:30, marginRight:30}} onPress={() => this.props.navigation.navigate('join')}>
          <Text style={{textAlign:'center', color:'#3C86FE', fontSize:15}}>立即注册新账号</Text>
        </TouchableOpacity>

        <View style={{flex:1, justifyContent: 'center'}}>
          <Text style={{textAlign:'center', color:'#fff', fontSize:15}}>江苏央联信息科技有限公司</Text>
          <Text style={{textAlign:'center', color:'#fff', fontSize:15}}>400-827-8211</Text>
        </View>
      </ScrollView>
    );
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  async handleSubmit() {
    const form = _.pick(this.state, ['mobile', 'password']);
    try {
      ModalIndicator.show('登陆中');
      const { token, display_name, user } = (await axios.post('/api/v2/authorize', form)).data;
      axios.defaults.headers.common['X-Token'] = token;
      await AsyncStorage.setItem('token', token);
      this.props.setToken(token);
      this.props.setUser(user);
      ModalIndicator.hide();
      Toast.success(display_name);
      const home = this.props.merchant.extend.app_fenxiao_hide == '0' ? 'home' : 'home2';
      this.props.navigation.replace(home)
    } catch (e) {
      ModalIndicator.hide();
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }
}

export default withRedux(Screen)
