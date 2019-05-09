import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
  AsyncStorage, Modal,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setUser: (user) => dispatch(actions.app.setUser(user)),
    setToken: (token) => dispatch(actions.app.setToken(token)),
  })
);

class Screen extends Component {
  state = {
    is_hide: false,
    exitConfirm: false,
  }
  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#eee'}}>

        <LinearGradient colors={[ '#4B56C0', '#6981FF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{backgroundColor:'#4B56C0', paddingTop:this.props.marginTop + 15, paddingLeft:20, paddingRight:20, paddingBottom:20}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
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
              <Image source={{uri: this.props.user.head_image || this.props.merchant.extend.default_head_image}} style={{width:64,height:64, borderRadius:32, borderWidth:1, borderColor:'#fff'}} />
            </TouchableOpacity>
            <View style={{marginLeft:10, alignItems:'flex-start'}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontSize:17, color:'#fff'}}>{this.props.user.nickname}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('myInfo')} style={{marginLeft: 10, borderRadius:5, borderWidth:1, borderColor:'#F5A923', padding: 5}}><Text style={{color:'#F5A923'}}>{this.props.user.status == '1' ? '未实名': '已实名'}</Text></TouchableOpacity>
              </View>
              <View style={{marginTop: 5, backgroundColor:'#FFC031', borderRadius:20, paddingLeft:6, paddingRight:6, paddingTop:2, paddingBottom: 2}}>
                <Text style={{color:'#fff', fontSize: 13}}>{this.props.user.level_name}</Text>
              </View>
            </View>
          </View>


          <View style={{flexDirection:'row', marginTop: 15}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:25, lineHeight:29, color:'#fff'}}>{this.state.is_hide ? '****' : this.props.user.sum_income.toFixed(2)}</Text>
              <Text style={{fontSize:14, lineHeight:20, color:'#fff'}}>总收入(元)</Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({is_hide: !this.state.is_hide})} style={{justifyContent:'center'}} >
              <Image source={this.state.is_hide ? require('../../assets/mimabukejian.png') : require('../../assets/mimakejian.png')} style={{width:20}} />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', marginTop: 15}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:20, lineHeight:24, color:'#fff'}}>{this.state.is_hide ? '****' : this.props.user.cash_income.toFixed(2)}</Text>
              <Text style={{fontSize:14, lineHeight:20, color:'#fff'}}>已结算(元)</Text>
            </View>
            <View>
              <Text style={{fontSize:20, lineHeight:24, color:'#fff', textAlign:'right'}}>{this.props.user.team_count}</Text>
              <Text style={{fontSize:14, lineHeight:20, color:'#fff', textAlign:'right'}}>团队人数(人)</Text>
            </View>
          </View>
        </LinearGradient>


        <View style={{paddingTop: 15, paddingHorizontal: 20, paddingBottom: 20, backgroundColor:'#fff'}}>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Text style={{color:'#212C67'}}>可结算(元): <Text style={{fontSize:18}}>{this.props.user.balance}</Text></Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('cashApply')} style={{paddingHorizontal:26, paddingVertical: 5, borderRadius:50, backgroundColor:'#4B56C0', borderRadius:50, borderWidth:2, borderColor:'#BCC5F3' }}>
              <Text style={{fontSize:14, lineHeight:20, color:'#fff'}}>提现</Text>
            </TouchableOpacity>
          </View>

          {this.props.user.invite_card_target ? (
            <View style={{flexDirection:'row', marginTop: 20}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:12, color:'#AFB4D2', lineHeight: 17}}>直推信用卡剩余任务：{ this.props.user.invite_card_target - this.props.user.invite_card_current }张（未完成）</Text>
                <View style={{marginTop: 8, height:20, justifyContent:'center'}}>
                  <View style={{backgroundColor:'#EFEFEF', borderRadius: 50, overflow:'hidden'}}>
                    <View style={{backgroundColor:'#FF8960', height: 7, width:`${this.props.user.invite_card_current / this.props.user.invite_card_target * 100}%`}}></View>
                  </View>
                  <View style={{position:'absolute', left: `${this.props.user.invite_card_current / this.props.user.invite_card_target * 100}%`, height:20}}>
                    <Image source={require('../../assets/yuandian.png')} style={{position:'absolute', left:-10,width:20,height:20}} />
                  </View>

                </View>
              </View>
              <View style={{marginLeft:20}}>
                <Text style={{fontSize:14, lineHeight:20, color:'#4A4A4A'}}>待退还: {((this.props.user.invite_card_target - this.props.user.invite_card_cost) * 10).toFixed(0)}元</Text>
                <Text style={{marginTop:10, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>已退还: {(this.props.user.invite_card_cost * 10).toFixed(0)}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{backgroundColor:'#fff', marginTop: 10}}>
          <View style={{flexDirection:'row', padding: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('myincome')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/wodeshouyi.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>我的收益</Text>
            </TouchableOpacity>
            <View style={{width:1, backgroundColor:'#D9DAEB'}}></View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('myBankCard')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/tianjiayinhangka.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>添加银行卡</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal:20, height: 1, backgroundColor:'#D9DAEB'}}></View>

          <View style={{flexDirection:'row', padding: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('share')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/yaoqingzhuce.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>邀请注册</Text>
            </TouchableOpacity>
            <View style={{width:1, backgroundColor:'#D9DAEB'}}></View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('notice')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/tongzhigonggao.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>通知公告</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal:20, height: 1, backgroundColor:'#D9DAEB'}}></View>

          <View style={{flexDirection:'row', padding: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('about')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/guanyuwomen.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>关于我们</Text>
            </TouchableOpacity>
            <View style={{width:1, backgroundColor:'#D9DAEB'}}></View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('myChief')} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/wodekefu.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>我的客服</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal:20, height: 1, backgroundColor:'#D9DAEB'}}></View>

          <View style={{flexDirection:'row', padding: 20}}>
            <TouchableOpacity onPress={async () => {
              this.setState({exitConfirm: true});
            }} style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
              <Image source={require('../../assets/tuichuxitong.png')} style={{width:25, height:25, resizeMode:'contain'}} />
              <Text style={{marginLeft:15, textAlign:'center'}}>退出系统</Text>
            </TouchableOpacity>
            <View style={{width:1, backgroundColor:'#D9DAEB'}}></View>
            <View style={{flex:1, flexDirection:'row', alignItems:'center', paddingVertical:10, paddingLeft:15}}>
            </View>
          </View>

        </View>

        <Modal visible={this.state.exitConfirm} transparent animationType='fade'>

          <View style={{flex:1,alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 16, 16, 0.7)'}}>
            <View style={{width:'80%'}}>
              <View style={{marginTop: 27, backgroundColor:'#fff', borderRadius: 16, paddingHorizontal: 15, overflow:'visible'}}>

                <View style={{paddingVertical:10}}>
                  <Text style={{fontSize:18, lineHeight:25, textAlign:'center'}}>确认退出系统？</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={async () => {
                    await this.props.setToken('');
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('hideWelcome');
                    this.setState({exitConfirm: false});
                    this.props.navigation.navigate('login');
                  }} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>确认退出</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({exitConfirm: false})} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </Modal>
      </ScrollView>
    );
  }
  componentDidMount() {
    console.log(this.props);
  }
}

export default withRedux(Screen)
