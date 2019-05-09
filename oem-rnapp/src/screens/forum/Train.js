import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView,
} from 'react-native';
import VideoOK from '../../components/VideoOK';

import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';

const reduxWrap = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  state = {
    textList: [],
    imageList: [],
    videoList: [],
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>推广培训</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>

          {_.map(this.state.videoList, o => (
            <View key={o.id} style={{padding:10}}>
              <VideoOK source={{uri: o.video, type:'mp4'}} />
            </View>
          ))}

          <View style={{flexDirection:'row', padding: 12, alignItems:'center'}}>
            <View style={{width:2, height:15, borderRadius:2, backgroundColor:'#FFCD1D'}}></View>
            <View style={{marginLeft:1, width:4, height:15, borderRadius:2, backgroundColor:'#4C57C1'}}></View>
            <Text style={{marginLeft:10, color:'#212C67', fontSize:15, lineHeight:21}}>图文教程</Text>
          </View>

          <View style={{flexDirection:'row', flexWrap:'wrap',paddingHorizontal:7, paddingTop:20, paddingBottom:20, backgroundColor:'#F3F4FF'}}>
          {_.map(this.state.imageList, o => (
            <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('merchantArticle', { id: o.id})} style={{width: '50%'}}>
              <View key={o.id} style={{marginHorizontal:5, height:110, marginBottom:10}}>
                <View style={{position:'absolute', top:10, left:0, right: 0, height: 100, backgroundColor:'#222B86', borderRadius:4, opacity:0.31}}></View>
                <Image source={{uri: o.icon}} style={{width:'100%', height:100}} />
                <View style={{position:'absolute', bottom:10, left:0, right: 0, backgroundColor:'#242424', padding: 4, opacity:0.91}}>
                  <Text numberOfLines={1} style={{color:'#ffffff', fontSize:16, lineHeight:22}}>{o.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        </ScrollView>
      </View>
    );
  }
  async componentDidMount() {
    const list = (await axios.get('/api/m/merchant_article')).data;

    const textList = _.filter(list, { type_code: 'text' });
    const imageList = _.filter(list, { type_code: 'image' });
    const videoList = _(list)
                      .filter({ type_code: 'video'})
                      .map(o => ({
                        ...o,
                        video: JSON.parse(o.attachment_list)[0],
                      }))
                      .value();
    this.setState({textList, imageList, videoList});
  }
}

export default reduxWrap(Screen)
