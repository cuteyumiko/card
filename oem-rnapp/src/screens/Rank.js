import React, { Component } from 'react';
import {
  Text, View, ScrollView,
  TouchableOpacity, Image, ImageBackground,
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
  })
);

class Screen extends Component {
  state = {
    list: [],
    idx: 0,
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{paddingVertical:10}}>
            <View style={{position:'absolute', right:10, top:10, flexDirection:'row',}}>
              <Image source={require('../assets/rank-top.png')} style={{height:108}} />
            </View>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff', textAlign:'center'}}>排行榜</Text>
            <Text style={{marginTop:20, marginLeft:45, fontSize:28, lineHeight:40, color:'#ffffff'}}>排行榜</Text>
            <Text style={{marginTop:2, marginBottom:17, marginLeft:48, fontSize:13, lineHeight:18, color:'#ddd'}}>当前等级{this.props.user.level_name}</Text>
            <TouchableOpacity style={{width:100,position:'absolute', left: 0, top:10}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{flex:1, backgroundColor:'#DFE3E9'}}>
          <View style={{marginBottom: 10,flexDirection:'row', paddingLeft:15, paddingRight:20, paddingTop:20, paddingBottom:17, borderBottomWidth:1, borderColor:'#DFE3E9', backgroundColor:'#ffffff'}}>
            <View style={{width:24}}>
              <Text style={{color:'#3B517C', fontSize:18, lineHeight:25}}>{this.state.idx + 1}</Text>
            </View>
            <Image source={{uri: this.props.user.head_image || this.props.merchant.extend.default_head_image}} style={{width: 36, height: 36, borderRadius:18, marginLeft: 8}} />
            <View style={{flex:1, marginLeft:15}}>
              <Text style={{color:'#354052', fontSize:16, lineHeight:22}} numberOfLines={1}>{this.props.user.nickname}</Text>
              <Text style={{marginTop:3, color:'#9C9C9C', fontSize:13, lineHeight:18}}>{this.props.user.level_name}</Text>
            </View>
            <View style={{width:65}}>
              <Text style={{color:'#354052', fontSize:13, lineHeight:18, textAlign:'center'}}>团队人数</Text>
              <Text style={{marginTop:3, color:'#9C9C9C', fontSize:13, lineHeight:18, textAlign:'center'}}>{this.props.user.team_count}</Text>
            </View>
            <View style={{width:65}}>
              <Text style={{color:'#354052', fontSize:13, lineHeight:18, textAlign:'right'}}>收益</Text>
              <Text style={{marginTop: 3, color:'#9C9C9C', fontSize:13, lineHeight:18, textAlign:'right'}}>{this.props.user.view_sum_income || 0}</Text>
            </View>
          </View>

          {_.map(this.state.list, (o, i) => (
            <View key={o.id} style={{flexDirection:'row', paddingLeft:15, paddingRight:20, paddingTop:20, paddingBottom:17, borderBottomWidth:1, borderColor:'#DFE3E9', backgroundColor:'#ffffff'}}>
              <View style={{width:24}}>

                {i === 0 ? (
                  <Image source={require('../assets/medal-18.png')} style={{width: 22}} />
                ) : (
                  i === 1 ? (
                    <Image source={require('../assets/medal-19.png')} style={{width: 22}} />
                  ) : (
                    i === 2 ? (
                      <Image source={require('../assets/medal-20.png')} style={{width: 22}} />
                    ) : (
                      <Text style={{color:'#3B517C', fontSize:18, lineHeight:25}}>{i + 1}</Text>
                    )
                  )
                )}

              </View>
              <Image source={{uri: o.head_image || this.props.merchant.extend.default_head_image}} style={{width: 36, height: 36, borderRadius:18, marginLeft: 8}} />
              <View style={{flex:1, marginLeft:15}}>
                <Text style={{color:'#354052', fontSize:16, lineHeight:22}} numberOfLines={1}>{o.nickname}</Text>
                <Text style={{marginTop:3, color:'#9C9C9C', fontSize:13, lineHeight:18}}>{o.level_name}</Text>
              </View>
              <View style={{width:65}}>
                <Text style={{color:'#354052', fontSize:13, lineHeight:18, textAlign:'center'}}>团队人数</Text>
                <Text style={{marginTop:3, color:'#9C9C9C', fontSize:13, lineHeight:18, textAlign:'center'}}>{o.team_all_count + o.add_team_count}</Text>
              </View>
              <View style={{width:65}}>
                <Text style={{color:'#354052', fontSize:13, lineHeight:18, textAlign:'right'}}>收益</Text>
                <Text style={{marginTop: 3, color:'#9C9C9C', fontSize:13, lineHeight:18, textAlign:'right'}}>{o.view_sum_income || 0}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    );
  }

  async componentDidMount() {

    const list = (await axios.get('/api/m/user_team', { params: {
      order: 'view_sum_income',
      limit: 10,
    }})).data;
    const { headers } = await axios.get('/api/m/user_team', { params: {
      view_sum_income__gt: this.props.user.view_sum_income,
      limit: 0,
    }});

    const idx = parseInt(headers['x-total-count'], 10);
    this.setState({ list, idx });
  }
}

export default withRedux(Screen)
