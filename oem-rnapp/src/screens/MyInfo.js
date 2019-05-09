import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
  Linking, Modal, Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import ImagePicker from 'react-native-image-picker';

import _ from 'lodash';
import axios from 'axios';

import TextInput from '../components/JSTextInput';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setUser: (user) => dispatch(actions.app.setUser(user)),
  })
);

class Screen extends Component {
  state = {
    nickname: this.props.user.nickname,
    name: this.props.user.name,
    weixin: this.props.user.weixin,
    weixin_qr: this.props.user.weixin_qr,
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>个人信息</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex:1, backgroundColor:'#fff'}}>
          <View style={{flexDirection:'row', marginTop:10, marginHorizontal:15, paddingHorizontal:20, paddingVertical:15, borderColor:'#DBE0EE', borderWidth:0.5, alignItems:'center'}}>
            <Image source={{uri: this.props.user.head_image || this.props.merchant.extend.default_head_image}} style={{width:60,height:60, borderRadius:30}} />
            <TouchableOpacity onPress={() => {
              ImagePicker.showImagePicker({
                quality: 0.5,
                maxWidth: 128,
                maxHeight: 128,
                title: '选一张照片',
                cancelButtonTitle: '取消',
                takePhotoButtonTitle: '用相机拍一张',
                chooseFromLibraryButtonTitle: '从相册选一张'
              }, async ({ uri }) => {

                if(uri) {
                  const formData = new FormData();
                  formData.append('file', {
                    uri, type: 'multipart/form-data', name: _.last(uri.split('/')),
                  })
                  try {
                    ModalIndicator.show('上传中');

                    const [file] = (await axios.post('/api/upload', formData, {
                      'Accept': 'Application/json',
                      'Content-Type': 'multipart/form-data',
                    })).data;

                    const head_image = file.url;
                    await axios.post('/api/i/info', { head_image });

                    const { user } = (await axios.get('/api/token_info')).data;
                    this.props.setUser(user);

                    ModalIndicator.hide();
                    Toast.success('修改成功');
                  } catch (e) {
                    ModalIndicator.hide();
                    const message = e.response ? e.response.data : e.message;
                    Toast.fail(message);
                  }
                }
              })
            }}>
              <Text style={{marginLeft:5, fontSize:14, lineHeight:20, color:'#354052'}}>点击上传头像</Text>
            </TouchableOpacity>
            <View style={{flex:1}}></View>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('changePassword')} style={{flexDirection:'row'}}>
              <Image source={require('../assets/xiugaimima.png')} style={{height:15, marginLeft: 15}} />
              <Text style={{marginLeft:5, fontSize:14, lineHeight: 20, color:'#AFB4D2'}}>修改密码</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:10, marginHorizontal:15, paddingHorizontal:25, borderColor:'#DBE0EE', borderWidth:0.5}}>
            <Text style={{marginTop:18, fontSize:15, lineHeight:21, color:'#354052'}}>提交个人材料</Text>

            <View style={{marginTop:20, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>昵  称</Text>
              <TextInput onChangeText={nickname => this.setState({nickname})} value={this.state.nickname} style={{flex:1, marginLeft:20, fontSize:14, color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.nickname ? (
                <TouchableOpacity onPress={() => { this.setState({nickname: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>姓  名</Text>
              <TextInput onChangeText={name => this.setState({name})} value={this.state.name} style={{flex:1, marginLeft:20, fontSize:14, lineHeight: 20,  color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.name ? (
                <TouchableOpacity onPress={() => { this.setState({name: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>手机号</Text>
              <Text style={{flex:1, marginLeft:20, fontSize:14, lineHeight: 20,  color:'#354052', marginVertical:5}}>{this.props.user.mobile}</Text>
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>微信号</Text>
              <TextInput onChangeText={weixin => this.setState({weixin})} value={this.state.weixin} style={{flex:1, marginLeft:20, fontSize:14, lineHeight: 20,  color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.weixin ? (
                <TouchableOpacity onPress={() => { this.setState({weixin: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{marginTop:20, alignItems:'center'}}>
              <TouchableOpacity onPress={() => {
                ImagePicker.showImagePicker({
                  quality: 0.5,
                  maxWidth: 128,
                  maxHeight: 128,
                  title: '选一张照片',
                  cancelButtonTitle: '取消',
                  takePhotoButtonTitle: '用相机拍一张',
                  chooseFromLibraryButtonTitle: '从相册选一张'
                }, async ({ uri }) => {

                  if(uri) {
                    const formData = new FormData();
                    formData.append('file', {
                      uri, type: 'multipart/form-data', name: _.last(uri.split('/')),
                    })
                    try {
                      ModalIndicator.show('上传中');

                      const [file] = (await axios.post('/api/upload', formData, {
                        'Accept': 'Application/json',
                        'Content-Type': 'multipart/form-data',
                      })).data;

                      const weixin_qr = file.url;
                      this.setState({weixin_qr})
                      ModalIndicator.hide();

                    } catch (e) {
                      ModalIndicator.hide();
                      const message = e.response ? e.response.data : e.message;
                      Toast.fail(message);
                    }
                  }
                })
              }}>
                <Image source={{uri: this.state.weixin_qr}} style={{height:115, width: 115}} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={async () => {
              const form = _.pick(this.state, ['nickname', 'name', 'weixin']);
              const [errno, errmsg] = (!form.nickname && [1, '请填写昵称'])
                                      || (!form.name && [2, '请填写姓名'])
                                      || (!form.weixin && [3, '请填写微信号'])
                                      || ((!/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(form.weixin) && !/^\d{11}$/.test(form.weixin)) && [4, '微信号格式不正确'])
                                      || [0, ''];

              try {
                if(errno) throw new Error(errmsg);

                ModalIndicator.show('提交中');
                await axios.post('/api/i/info', form);

                const { user } = (await axios.get('/api/token_info')).data;
                this.props.setUser(user);

                ModalIndicator.hide();
                Toast.success('保存成功');

                this.props.navigation.pop()

              } catch (e) {
                ModalIndicator.hide();
                const message = e.response ? e.response.data : e.message;
                Toast.fail(message);
              }
            }} style={{marginTop:20, marginBottom:37, backgroundColor:'#FF300F', borderRadius:50, paddingVertical:10, marginHorizontal:70, alignItems:'center'}}>
              <Text style={{fontSize:15, lineHeight:21, color:'#fff'}}>提交材料</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>


      </View>
    );
  }

  async componentDidMount() {
    console.log(this.props.merchant)
  }
}

export default withRedux(Screen)
