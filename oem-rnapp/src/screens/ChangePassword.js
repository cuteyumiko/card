import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
  Linking, Modal, Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import ImagePicker from 'react-native-image-picker';

import _ from 'lodash';
import axios from 'axios';

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
    old_password: '',
    new_password: '',
    new_password2: '',
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>修改密码</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex:1, backgroundColor:'#fff'}}>

          <View style={{marginTop:10, marginHorizontal:15, paddingHorizontal:25, borderColor:'#DBE0EE', borderWidth:0.5}}>

            <View style={{marginTop:20, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>旧密码</Text>
              <TextInput secureTextEntry onChangeText={old_password => this.setState({old_password})} value={this.state.old_password} style={{flex:1, marginLeft:20, fontSize:14, color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.old_password ? (
                <TouchableOpacity onPress={() => { this.setState({old_password: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>新密码</Text>
              <TextInput secureTextEntry onChangeText={new_password => this.setState({new_password})} value={this.state.new_password} style={{flex:1, marginLeft:20, fontSize:14, lineHeight: 20,  color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.new_password ? (
                <TouchableOpacity onPress={() => { this.setState({new_password: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={{marginTop:10, flexDirection:'row', borderColor:'#DBE0EE', borderWidth:0.5, paddingVertical:10, paddingLeft:5, paddingRight:10, alignItems:'center'}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#AFB4D2'}}>新密码</Text>
              <TextInput secureTextEntry onChangeText={new_password2 => this.setState({new_password2})} value={this.state.new_password2} style={{flex:1, marginLeft:20, fontSize:14, lineHeight: 20,  color:'#354052', padding:0}} underlineColorAndroid='transparent' />
              {this.state.new_password2 ? (
                <TouchableOpacity onPress={() => { this.setState({new_password2: ''})}}>
                  <Image source={require('../assets/radius-cross.png')} style={{width:15, height:15}} />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity onPress={async () => {

              const { new_password2 } = this.state;
              const form = _.pick(this.state, ['old_password', 'new_password']);
              const { new_password, old_password} = form;

              const [errno, errmsg] = (!old_password && [1, '请输入旧密码'])
                            || (!new_password && [2, '请输入新密码'])
                            || (!new_password2 && [2, '请再次输入新密码'])
                            || (new_password2 !== new_password && [3, '两次密码不一致'])
                            || [0, ''];

              try {
                if(errno) throw new Error(errmsg);

                ModalIndicator.show('提交中');

                await axios.post('/api/i/password', form);

                ModalIndicator.hide();
                Toast.success('密码修改成功');

                this.props.navigation.pop()

              } catch (e) {
                ModalIndicator.hide();
                const message = e.response ? e.response.data : e.message;
                Toast.fail(message);
              }
            }} style={{marginTop:20, marginBottom:37, backgroundColor:'#FF300F', borderRadius:50, paddingVertical:10, marginHorizontal:70, alignItems:'center'}}>
              <Text style={{fontSize:15, lineHeight:21, color:'#fff'}}>修改密码</Text>
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
