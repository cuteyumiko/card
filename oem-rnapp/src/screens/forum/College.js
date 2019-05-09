import React, { Component } from 'react';
import {
  Text, View, Image, FlatList,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { ModalIndicator, Toast } from 'teaset';

import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';

import _ from 'lodash';
import axios from 'axios';

class ArticleList extends Component {
  render() {
    return (
      <View>
        <View></View>
      </View>
    )
  }
}

class Screen extends Component {
  state = {
    initialPage: 0,
    lunbo_list: [],

    kouzi_list: [],
    kouzi_list_offset: 0,
    kouzi_refreshing: false,
    kouzi_list_loading: false,


    jishu_list: [],
    jishu_list_offset: 0,
    jishu_refreshing: false,
    jishu_list_loading: false,

  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{flexDirection:'row', paddingHorizontal:18, paddingVertical:8}}>
          <Image resizeMode='contain' source={require('../../assets/zuanshi.png')} style={{width:20, height:20}} />
          <Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A', marginLeft:10}}>精华区</Text>
        </View>

        <View style={{height:100}}>
          <ScrollView horizontal style={{paddingHorizontal:5, backgroundColor:'#fff'}} showsHorizontalScrollIndicator={false}>
            {_.map(this.state.lunbo_list, o => (
              <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('collegeDetail', { id: o.id})} style={{marginHorizontal: 5}}>
                <Image source={{uri: o.icon}} style={{width:170, height:100}} />
                <View style={{position:'absolute', left:0, bottom:0, right:0, backgroundColor:'#0008', paddingHorizontal:5, paddingVertical:2}}>
                  <Text style={{color:'#fff', fontSize:14, lineHeight:20}}>{o.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollableTabView style={{flex:1,marginTop: 14}} renderTabBar={() => <DefaultTabBar />} tabBarBackgroundColor='#FFFFFF' tabBarActiveTextColor='#4959B8' tabBarInactiveTextColor='#333333' tabBarUnderlineStyle={{height:2, backgroundColor:'#F5A623'}}>
          <FlatList tabLabel='最新口子'
            data={this.state.kouzi_list}
            keyExtractor={item => `${item.id}`}
            ListFooterComponent={() => {
              if(this.state.kouzi_refreshing){
                return null;
              }else if (this.state.kouzi_list_loading) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>好像还有一点</Text>
                  </View>
                )
              } else if(this.state.kouzi_list_offset < 0) {
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('collegeDetail', { id: item.id})} style={{flexDirection:'row', paddingRight:12, marginLeft:12, paddingVertical: 20, backgroundColor:'#fff', borderBottomWidth:0.5, borderColor:'#CCCCCC'}}>
                <View style={{flex:1}}>
                  <Text numberOfLines={2} style={{color:'#333333', fontSize:15, lineHeight:26}}>{item.name}</Text>
                  <View style={{flexDirection:'row', paddingTop:9}}>
                    <Text style={{flex:1, color:'#B89762', fontSize:12, lineHeight:17}}>VIP用户可见</Text>
                    <Text style={{color:'#AFB4D2', fontSize:12, lineHeight:17}}>{item.view_count}阅读</Text>
                  </View>
                </View>
                <Image source={{uri: item.icon }} style={{width:70, height:70, marginLeft:16, borderRadius:5}} />
              </TouchableOpacity>
            )}
            onRefresh={() => {
              this.kouzi_reload(true);
            }}
            refreshing={this.state.kouzi_refreshing}
            onEndReached={() => {
              this.kouzi_reload();
            }}
            onEndReachedThreshold={0.1}
          />

          <FlatList tabLabel='提额技术'
            data={this.state.jishu_list}
            keyExtractor={item => `${item.id}`}
            ListFooterComponent={() => {
              if(this.state.jishu_refreshing){
                return null;
              } else if (this.state.jishu_list_loading) {
                return (
                  <View style={{alignItems:'center', padding:10}}>
                    <Text style={{color:'#ccc'}}>好像还有一点</Text>
                  </View>
                )
              } else if(this.state.jishu_list_offset < 0) {
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('collegeDetail', { id: item.id})} style={{flexDirection:'row', paddingRight:12, marginLeft:12, paddingVertical: 20, backgroundColor:'#fff', borderBottomWidth:0.5, borderColor:'#c6c6c6'}}>
                <View style={{flex:1}}>
                  <Text numberOfLines={2} style={{color:'#333333', fontSize:15, lineHeight:26}}>{item.name}</Text>
                  <View style={{flexDirection:'row', paddingTop:9}}>
                    <Text style={{flex:1, color:'#B89762', fontSize:12, lineHeight:17}}>VIP用户可见</Text>
                    <Text style={{color:'#AFB4D2', fontSize:12, lineHeight:17}}>{item.view_count}阅读</Text>
                  </View>
                </View>
                <Image source={{uri: item.icon }} style={{width:70, height:70, marginLeft:16, borderRadius:5}} />
              </TouchableOpacity>
            )}
            onRefresh={() => {
              this.jishu_reload(true);
            }}
            refreshing={this.state.jishu_refreshing}
            onEndReached={() => {
              this.jishu_reload();
            }}
            onEndReachedThreshold={0.2}
          />

        </ScrollableTabView>

      </View>
    );
  }

  async kouzi_reload(refresh) {
    const { kouzi_list_loading } = this.state;
    let offset = refresh ? 0 : this.state.kouzi_list_offset;
    const kouzi_list = refresh ? [] : this.state.kouzi_list;
    if(offset < 0 || kouzi_list_loading ) return;

    this.setState({
      kouzi_list_loading: true,
      kouzi_refreshing: offset === 0,
    })
    const list = (await axios.get('/api/m/course', { params: {
      type_code: 'kouzi',
      order: 'create_time',
      offset,
      limit: 20,
    }})).data;

    this.setState({
      kouzi_list: [ ...kouzi_list, ...list],
      kouzi_list_offset: list.length === 20 ? offset + 20 : -1,
      kouzi_list_loading: false,
      kouzi_refreshing: false,
    });
  }

  async jishu_reload(refresh){
    const { jishu_list_loading } = this.state;
    let offset = refresh ? 0 : this.state.jishu_list_offset;
    const jishu_list = refresh ? [] : this.state.jishu_list;
    if(offset < 0 || jishu_list_loading ) return;

    this.setState({
      jishu_list_loading: true,
      jishu_refreshing: offset === 0,
    })
    const list = (await axios.get('/api/m/course', { params: {
      type_code: 'jishu',
      order: 'create_time',
      offset,
      limit: 20,
    }})).data;

    this.setState({
      jishu_list: [ ...jishu_list, ...list],
      jishu_list_offset: list.length === 20 ? offset + 20 : -1,
      jishu_list_loading: false,
      jishu_refreshing: false,
    });
  }

  async componentDidMount() {
    await this.kouzi_reload();
    await this.jishu_reload();

    const lunbo_list = (await axios.get('/api/m/course', { params: { type_code: 'lunbo'} })).data;
    this.setState({lunbo_list});

  }
}

export default withNavigation(Screen);
