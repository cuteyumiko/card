import React, { Component } from 'react';
import {
  Text, TextInput, View, Image,
  TouchableOpacity, ScrollView,
} from 'react-native';

import { ModalIndicator, Toast } from 'teaset';
import ImagePicker from 'react-native-image-picker';


import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';

const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  state = {
    itemList: [],
    itemIndex: 0,

    image: '',
    ticket_password: '',
  }
  render() {
    const item = this.state.itemList.length > this.state.itemIndex ? this.state.itemList[this.state.itemIndex] : null;
    console.log(item)
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>积分兑换</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {this.state.itemList.length ? (
          <ScrollView>
            <View style={{backgroundColor:'#fff', paddingLeft:20}}>
              <View style={{flexDirection: 'row', alignItems:'center', paddingVertical: 10, borderBottomWidth:0.5, borderColor:'#E1E1E1'}}>
                <Image source={require('../../assets/chanpinleibie.png')} style={{width: 15, height: 15}} />
                <Text style={{marginLeft: 10, fontSize:15, lineHeight:21, color:'#333333'}}>产品类别</Text>
              </View>

              <View style={{flexDirection:'row', paddingVertical:15}}>
              {_.map(this.state.itemList, (o, i) => (
                <TouchableOpacity key={o.id} onPress={() => this.setState({itemIndex: i})} style={{paddingVertical: 6, paddingHorizontal:10, backgroundColor: (this.state.itemIndex === i ? '#4959B8' : '#ffffff'), borderRadius:4, marginRight: 10, borderWidth: 0.5, borderColor:'#4959B8'}}>
                  <Text style={{fontSize:13, lineHeight:18, color:(this.state.itemIndex === i ? '#ffffff' : '#4959B8')}}>{o.name}</Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>

            <View style={{backgroundColor:'#fff', paddingLeft:20, marginTop:10}}>

              <View style={{flexDirection: 'row', alignItems:'center', paddingVertical:15, borderBottomWidth:0.5, borderColor:'#E1E1E1'}}>
                <Image source={require('../../assets/jifenduihuan.png')} style={{width: 15, height: 15}} />
                <Text style={{marginLeft:10, fontSize:15, lineHeight:21, color:'#333333'}}>兑换码</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems:'center', paddingVertical:15}}>
                <Text style={{fontSize:14, lineHeight:20, color:'#333333'}}>{item.property.ticket_password_title || '卡密'}:</Text>
                <TextInput onChangeText={ ticket_password => this.setState({ticket_password}) } style={{flex:1,marginLeft:10, fontSize:14, padding:0}} placeholder={item.property.ticket_password_placeholder} underlineColorAndroid='transparent' />
              </View>
            </View>

            { item.property.tip ? (
              <Text style={{marginHorizontal:20, marginTop: 5, fontSize: 12, lineHeight:17, color:'#F5A623'}}>{item.property.tip}</Text>
            ) : null}

            { item.property.image_example ? (
              <View style={{backgroundColor:'#fff', paddingLeft:20, marginTop:10}}>
                <View style={{flexDirection: 'row', alignItems:'center', paddingVertical:15, borderBottomWidth:0.5, borderColor:'#E1E1E1'}}>
                  <Text style={{fontSize:14, lineHeight:20, color:'#333333'}}>截图示范</Text>
                </View>

                <Image source={{ uri: item.property.image_example}} style={{width: 100, height: 100, marginVertical: 12}} resizeMode="contain" />
              </View>
            ) : null}


            <View style={{backgroundColor:'#fff', paddingHorizontal:20, marginTop:10}}>
              <TouchableOpacity onPress={() => {
                ImagePicker.showImagePicker({
                  quality: 0.5,
                  maxWidth: 1024,
                  maxHeight: 1024,
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
                      ModalIndicator.show('图片上传中');

                      const [file] = (await axios.post('/api/upload', formData, {
                        'Accept': 'Application/json',
                        'Content-Type': 'multipart/form-data',
                      })).data;

                      this.setState({ image: file.url });
                      ModalIndicator.hide();
                    } catch (e) {
                      ModalIndicator.hide();
                      const message = e.response ? e.response.data : e.message;
                      Toast.fail(message);
                    }
                  }
                })
              }} style={{flexDirection: 'row', alignItems:'center', paddingVertical:15, borderBottomWidth:0.5, borderColor:'#E1E1E1'}}>
                <Text style={{flex:1, marginLeft: 10, fontSize:14, lineHeight:20, color:'#333333'}}>上传卡密截图</Text>
                <Image source={require('../../assets/upload-image.png')} style={{width: 25, height: 25}} resizeMode="contain" />
              </TouchableOpacity>

              { this.state.image ? (
                <Image source={{ uri: this.state.image}} style={{width: 100, height: 100, marginVertical: 12}} resizeMode="contain" />
              ) : null}
            </View>


            <View style={{marginTop:30, paddingBottom: this.props.marginBottom, backgroundColor:'transparent'}}>
              <TouchableOpacity onPress={() => this.submitForm()} style={{backgroundColor:'#FF300F', paddingVertical:13, marginHorizontal: 50, borderRadius:50, alignItems:'center'}}>
                <Text style={{fontSize: 17, lineHeight: 24, color: '#fff'}}>提交</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
      </View>
    );
  }
  async componentDidMount() {

    const { id } = this.props.navigation.state.params;

    const [item, itemList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_ticket', method: 'get', query: { id } }),
      JSON.stringify({ object: 'product_ticket', method: 'filter', query: { prop: 'property' }, $query: { source_id: '[0].source_id'} }),
    ])).data;

    this.setState({
      itemList: _.map(itemList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value()
      })),
      itemIndex: _.findIndex(itemList, { id }),
    });
  }

  async submitForm() {
    const item = this.state.itemList.length > this.state.itemIndex ? this.state.itemList[this.state.itemIndex] : null;

    const form = _.pick(this.state, ['ticket_password', 'image'])

    const [errno, errmsg] = (!form.ticket_password && [2, '请填写密码'])
                          || (!form.image && [3, '请上传图片'])
                          || [0, ''];
    if (errno) {
      Toast.fail(errmsg);
      return;
    }
    form.ticket_id = item.id;
    form.creator_id = this.props.user.id;

    try {
      ModalIndicator.show('提交中...');
      await axios.post('/api/product_ticket_order', form);
      ModalIndicator.hide();

      Toast.success('提交成功');
      this.props.navigation.pop();
    } catch (e) {
      ModalIndicator.hide();
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }
}

export default withRedux(Screen)
