import React, { Component } from 'react';
import {
  Text, View, TextInput, CameraRoll,  Modal, FlatList, 
  TouchableOpacity, Image, ScrollView, Clipboard, Platform,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import TinymceView from '../components/TinymceView';
import ImageOK from '../components/ImageOK';
import RNFetchBlob from 'rn-fetch-blob'

import { ModalIndicator, Toast } from 'teaset';

import _ from 'lodash';
import moment from 'moment';
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
    imageVisible: false,
    imagePath: '',

    list: [],
    list_offset: 0,
    refreshing: false,
    list_loading: false,
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>朋友圈中央文案库</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <FlatList
          data={this.state.list}
          keyExtractor={item => `${item.id}`}
          ListFooterComponent={() => {
            if(this.state.refreshing){
              return null;
            } else if (this.state.list_loading) {
              return (
                <View style={{alignItems:'center', padding:10}}>
                  <Text style={{color:'#ccc'}}>好像还有一点</Text>
                </View>
              )
            } else if(this.state.list_offset < 0) {
              return (
                <View style={{alignItems:'center', padding:10}}>
                  <Text style={{color:'#ccc'}}>小编只准备了这么多</Text>
                </View>
              )
            } else {
              return null
            }
          }}
          renderItem={({item}) => (

            <View key={item.id} style={{borderBottomWidth:1, borderColor:'#AFB4D2', marginHorizontal:15}}>
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: 20, marginBottom: 10}}>
                <View>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:1.7,height:1.7,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:2.9,height:2.9,marginLeft:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:3.4,height:3.4,marginLeft:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                  </View>
                  <View style={{marginTop:2.3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:1.7,height:1.7,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:2.9,height:2.9,marginLeft:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:3.4,height:3.4,marginLeft:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                  </View>
                </View>
                <View style={{marginHorizontal:10}}>
                  <Text style={{fontSize:15, color:'#545454'}}>{item.name}</Text>
                </View>
                <View>
                <View>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:3.4,height:3.4,marginRight:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:2.9,height:2.9,marginRight:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:1.7,height:1.7,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                  </View>
                  <View style={{marginTop:2.3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:3.4,height:3.4,marginRight:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:2.9,height:2.9,marginRight:4,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                    <View style={{width:1.7,height:1.7,borderRadius:10, backgroundColor:'#AFB4D2'}}></View>
                  </View>
                </View>
                </View>
              </View>

              <TinymceView html={item.content} style={{padding:10}}/>

              <View style={{flexDirection:'row', flexWrap:'wrap'}}>

                {_.map(item.fileList, (p, i) => (
                  <TouchableOpacity onPress={ () => {
                    this.setState({imageVisible: true, imagePath: p.url})
                  }} key={i} style={{width:'33%', height:80, paddingHorizontal:3, marginVertical: 3}}>
                    <Image source={{uri: p.url}} style={{width:'100%', height:80}} />
                  </TouchableOpacity>
                ))}

              </View>

              <View style={{marginTop:10, marginBottom:10, flexDirection:'row'}}>
                <View style={{flex:1}}>

                </View>
                <TouchableOpacity onPress={() => {
                  Clipboard.setString(item.content.replace(/<\/?.+?>/g,''))
                  Toast.success('复制成功');
                }}>
                  <Text style={{fontSize:12, color:'#AFB4D2', marginLeft:10}}>复制文字</Text>
                </TouchableOpacity>

                {item.fileList && item.fileList.length ? (
                  <TouchableOpacity onPress={async () => {
                    for(let i = 0; i < item.fileList.length; i++) {
                      const p = item.fileList[i];
                      const path = Platform.select({
                        ios: p.url,
                        android: 'file://' + (await RNFetchBlob.config({
                          fileCache: true,
                          appendExt : _.last(p.url.split('.')) || 'jpg',
                        }).fetch('GET', encodeURI(p.url), {})).path(),
                      })
                      await CameraRoll.saveToCameraRoll(path);
                    }
                    Toast.success('已保存到相册');
                  }}>
                    <Text style={{fontSize:12, color:'#AFB4D2', marginLeft:10}}>保存图片</Text>
                  </TouchableOpacity>
                ) : null}

                <Image source={require('../assets/hot.png')} style={{height:15, marginLeft: 15}} />
                <Text style={{fontSize:12, color:'#AFB4D2', marginLeft:10}}>下载{item.download_count}</Text>
              </View>
            </View>
          )}
          onRefresh={() => {
            this.reload(true);
          }}
          refreshing={this.state.refreshing}
          onEndReached={() => {
            this.reload();
          }}
          onEndReachedThreshold={0.2}
        />

        <Modal visible={this.state.imageVisible} transparent animationType='fade'>
          <TouchableOpacity onPress={() => this.setState({imageVisible:false})} style={{flex:1,alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 16, 16, 0.7)'}}>
            <View style={{width:'80%'}}>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.setState({imageVisible:false})}>
                  <Image source={require('../assets/close.png')} style={{height:30, width:30}} />
                </TouchableOpacity>
              </View>
              {this.state.imagePath ? (
                <View style={{marginTop:10}}>
                  <ImageOK source={{uri: this.state.imagePath}} />
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    );
  }

  async reload(refresh) {
    const { list_loading } = this.state;
    let offset = refresh ? 0 : this.state.list_offset;
    const old_list = refresh ? [] : this.state.list;
    if(offset < 0 || list_loading ) return;

    this.setState({
      list_loading: true,
      refreshing: offset === 0,
    })

    let list = (await axios.get('/api/m/copy_library', {
      order: 'create_time',
      offset,
      limit: 20,
    })).data;

    list = _.map(list, o => ({
      ...o,
      create_date: moment.unix(o.create_time).format('M月D日'),
      create_time: moment.unix(o.create_time).format('HH:mm'),
      fileList: _.map((o.file_list ? JSON.parse(o.file_list) : []), x => ({
        name: _.last(x.split('/')),
        url: x,
      })),
    }));

    this.setState({
      list: [ ...list, ...old_list],
      list_offset: list.length === 20 ? offset + 20 : -1,
      list_loading: false,
      refreshing: false,
    });
  }

  async componentDidMount() {
    await this.reload();
  }
}

export default withRedux(withNavigation(Screen));
