import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';

import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

import _ from 'lodash';
import axios from 'axios';

class Screen extends Component {
  state = {
    sourceList: [],
    lunboList: [],
    name__like: ''
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{padding:10}}>
          {this.state.lunboList.length ? (
            <Swiper height={130} autoplay={true} showsPagination={false}>

              {_.map(this.state.lunboList, o => (
                <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('collegeDetail', { id: o.id})} style={{flex:1, borderRadius:10, overflow:'hidden'}}>
                  <Image source={{uri:o.icon}} style={{height:130}} resizeMode='cover' />
                </TouchableOpacity>
              ))}
            </Swiper>
          ) : null}
        </View>

        <View style={{flex:1,flexDirection:'row', borderWidth:0.5, borderRadius:4, borderColor: '#CED0DA', marginHorizontal: 15, alignItems:'center', padding:5}}>
          <Image source={require('../../assets/search.png')} style={{marginLeft:10, width:20, height:20}} />
          <TextInput onChangeText={ name__like => {
            this.setState({name__like})
            this.reload({name__like})
          }} style={{flex: 1, marginLeft:10, fontSize:14, padding: 0}} placeholder='请输入关键字' underlineColorAndroid='transparent' />
        </View>

        {_.map(this.state.sourceList, o => (
          <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('ticketSource1', { source_id: o.id})} style={{overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginLeft: 10, marginRight: 10}}>
            <LinearGradient colors={[ o.property.start_color || '#FE7735', o.property.end_color || '#F43F2C']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{flexDirection:'row', paddingRight: 15}}>
              <View style={{padding:7, backgroundColor:'#fff', borderRadius:40, margin: 15}}>
                <Image source={{uri:o.icon}} style={{width:35, height:35}} />
              </View>
              <View style={{flex:1}}>
                <View style={{marginTop: 20, flexDirection:'row', paddingHorizontal:15}}>
                  <Text style={{flex:1,fontSize:17, color: '#fff'}}>{o.name}</Text>

                  <View>
                    <Image source={require('../../assets/more.png')} style={{height:15}} />
                  </View>
                </View>

                <View style={{flexDirection:'row', marginTop: 3}}>
                  <Text style={{flex:1, fontSize: 12, color: '#fff'}} numberOfLines={1}>{o.property.info}</Text>
                  {o.property.settle_type ? (
                    <Text style={{fontSize: 12, color: '#fff'}} numberOfLines={1}>结算时间：{o.property.settle_type}</Text>
                  ) : null}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  async reload(params = {}) {
    try {
      const sourceList = _((await axios.get('/api/v2/product_ticket_source', { params: {
        ..._.pick(this.state, ['name__like']),
        is_enabled: 1,
        prop: 'property',
        ...params,
      } })).data).map(o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })).value();

      this.setState({ sourceList });
    } catch (e) {
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }
  }
  async componentDidMount() {

    const lunboList = (await axios.get('/api/m/course', { params: { type_code: 'ticket_lunbo'} })).data;
    this.setState({lunboList})

    await this.reload();
  }

}

export default withNavigation(Screen)
