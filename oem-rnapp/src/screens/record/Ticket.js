import React, { Component } from 'react';
import {
  Text, View, TextInput, FlatList,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

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
    status: 1,

    list: [],
    list_offset: 0,
    refreshing: false,
    list_loading: false,
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor:'#fff'}}>
          <View style={{flexDirection:'row', padding: 5}}>
            <View style={{flex:1, padding: 5}}>
              <TouchableOpacity onPress={async () => {
                if (this.state.status !== 1) {
                  await this.setState({ status: 1 })
                  await this.reload(true);
                }
              }} style={{paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 1 ? { backgroundColor:'#4959B8' } : { })}}>
                <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 1 ? {} : { color: '#4959B8'})}}>申请中</Text>
              </TouchableOpacity>
            </View >
            <View style={{flex:1, padding: 5}}>
              <TouchableOpacity onPress={async () => {
                if (this.state.status !== 2) {
                  await this.setState({ status: 2 })
                  await this.reload(true);
                }
              }} style={{flex:1, paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 2 ? { backgroundColor:'#4959B8' } : { })}}>
                <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 2 ? {} : { color: '#4959B8'})}}>已通过</Text>
              </TouchableOpacity>
            </View >
            <View style={{flex:1, padding: 5}}>
              <TouchableOpacity onPress={async () => {
                if (this.state.status !== 3) {
                  await this.setState({ status: 3 })
                  await this.reload(true);
                }
              }} style={{flex:1, paddingTop:5, paddingBottom: 5, alignItems:'center', borderRadius:20, borderColor:'#4959B8', borderWidth: 1, ...(this.state.status == 3 ? { backgroundColor:'#4959B8' } : {})}}>
                <Text style={{fontSize:15, color:'#ffffff', ...(this.state.status === 3 ? {} : { color: '#4959B8'})}}>已拒绝</Text>
              </TouchableOpacity>
            </View >
          </View>
          <View style={{flexDirection:'row', borderWidth:1, borderRadius:4, borderColor: '#CED0DA', marginLeft: 15, marginRight: 15, marginTop: 12, marginBottom: 12, padding: 10, alignItems:'center'}}>
            <Image source={require('../../assets/search.png')} style={{width:20, height:20}} />
            <TextInput onChangeText={ name__like => {
              this.setState({name__like})
              this.reload(true)
            }} style={{flex: 1, marginLeft:10, padding:0}} placeholder='请输入银行名称或姓名' underlineColorAndroid='transparent'/>
          </View>
        </View>

        <FlatList
          style={{flex:1}}
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
            <View style={{marginBottom: 10, paddingBottom: 10, backgroundColor:'#ffffff', borderTopLeftRadius: 6}}>
              <View style={{flexDirection:'row', paddingTop:18, paddingLeft: 15, paddingRight: 15, borderLeftWidth:6, borderColor: '#4CE29A', borderTopLeftRadius: 6}}>
                <Text style={{flex:1, fontSize:15, color:'#333333'}}>申请人: {item.order_name} {item.order_mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                {item.status === 3 ? (
                  <Text style={{fontSize:14, color:'#FF300F'}}>已拒绝</Text>
                ) : (
                  <Text style={{fontSize:14, color:'#CAA473'}}>{(item.status === 1 || item.status === 4) ? '预计佣金' : '结算佣金'}
                    <Text style={{fontSize:26, color:'#FF300F'}}>
                      { item.money }
                    </Text><Text style={{fontSize:16, color:'#FF300F'}}>元</Text>
                  </Text>
                )}

              </View>
              <View style={{flexDirection:'row', marginTop:10, paddingLeft: 15, paddingRight: 15}}>
                <Text style={{flex:1, fontSize:13, color:'#999999'}}>订单号：{item.order_code}</Text>
                <Text style={{fontSize:14, color:'#333333'}}>{item.product_name}</Text>
              </View>
              <View style={{flexDirection:'row', alignItems:'center', marginTop: 8, paddingLeft: 15, paddingRight: 15}}>
                <Text style={{flex:1, fontSize:15, color:'#333333', textAlign:'right', marginRight: 10}}>
                  {item.lower_id ? `${item.lower_level_name}${item.lower_name}推广` : '本人申请'}
                </Text>
                <Image source={{uri: item.lower_head_image || this.props.merchant.extend.default_head_image}} style={{width:40,height:40, borderRadius:20}} />
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

      </View>
    );
  }

  async reload(refresh){
    const { list_loading, status } = this.state;
    let offset = refresh ? 0 : this.state.list_offset;
    const list = refresh ? [] : this.state.list;
    if(offset < 0 || list_loading ) return;

    this.setState({
      list_loading: true,
      refreshing: offset === 0,
    })

    const resp_list = (await axios.get('/api/my/product_ticket_order_income', { params: {
      order: 'create_time',
      ...( status === 1 ? ( { 'status__in': '1,4'}) : { status }),
      offset,
      limit: 20,
    }})).data;

    this.setState({
      list: [ ...list, ...resp_list],
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
