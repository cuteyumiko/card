import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

class Screen extends Component {
  state = {
    list: [],
    typeList: [],
    type2List: [],

    type_id: null,
    type2_ids: [],
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <ScrollView horizontal style={{flexDirection:'row', marginTop:10}} showsHorizontalScrollIndicator={false}>
            {_.map(this.state.typeList, o => (
              <TouchableOpacity key={o.id} onPress={() => this.setType(o.id)} key={o.id} style={{paddingHorizontal:12, alignItems:'center'}}>
                <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:25, height:25}} />
                <Text style={{marginTop:5, fontSize:12, lineHeight:17, color:'#5B5B5B'}}>{o.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{flexDirection:'row', marginTop:5}}>
            {_.map(this.state.type2List, o => (
              <TouchableOpacity key={o.id} onPress={() => this.setType2(o.id)} key={o.id} style={{flex:1, paddingHorizontal: 15, alignItems:'center'}}>
                <Text style={{marginTop:5, fontSize:12, lineHeight:17, color: this.state.type2_ids.indexOf(o.id) !== -1 ? '#FEC51D' : '#818181', textAlign:'center'}}>{o.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{marginTop:20}}>
            {_.map(this.getList(), o => (
              <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('loanApply', { id: o.id})} style={{padding:5, borderRadius: 5, backgroundColor:'#fff', }}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:40, height:40}} />
                  <View style={{flex:1,marginLeft:10}}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                      <Text style={{fontSize:15,color:'#333333'}}>{o.name} </Text>
                      <View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}>
                        <Text style={{fontSize:10, color:'#ED471C'}}>{o.tip_text}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:1}}>
                        <Text style={{marginTop: 5, fontSize:12, color:'#999999'}}>额度: {o.quota} 参考月利率: {o.interest}</Text>

                        {o.type2List && o.type2List.length ? (
                          <View style={{flexDirection:'row', marginTop:6 }}>
                            {_.map(o.type2List, p => (
                              <View key={p.id} style={{borderRadius: 10, borderWidth:0.5, borderColor: p.color, paddingHorizontal:5, paddingVertical:2, marginRight: 5}}>
                                <Text style={{fontSize:12, color:p.color}}>{p.name}</Text>
                              </View>

                            ))}
                          </View>
                        ) : null}
                      </View>
                      <View>
                        <Text style={{fontSize:12, color:'#FF8800', textAlign:'right'}}>佣金{o.max_level_money}{o.money_unit}</Text>
                        <Text style={{marginTop:5, fontSize:14, color:'#ED471C', textAlign:'right'}}>立即申请</Text>
                      </View>
                    </View>
                  </View>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  getList() {
    return _.map(this.state.list, o => {
      const type_ids = _.map(o.type_ids.split(','), o => parseInt(o.substr(1, o.length-2)));
      const type2List = _.intersectionWith(this.state.type2List, type_ids, ({ id }, o) => id === o);
      return {
        ...o,
        type2List,
      };
    });
  }

  async setType(id) {

    if(id === this.state.type_id) return;

    const type_ids__like = [];
    this.setState({type_id:id, type2_ids: []})
    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        type_ids__like: `[${id}]`,
      }
    })).data;

    let type2List = (await axios.get('/api/product_loan_type', { params: { parent_id: id }})).data;
    this.setState({list, type2List})
  }

  async setType2(id) {
    const type2_ids = _.xor(this.state.type2_ids, [id]);

    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        ...(type2_ids.length ? { type_ids__like: _.map(type2_ids, o => `[${o}]`).join(',') } : {}),
      }
    })).data;
    this.setState({list, type2_ids})

  }
  async componentDidMount() {
    const typeList = (await axios.get('/api/product_loan_type', { params: { catagory_id: 2 }})).data;
    const type_id = (_.find(typeList, o=> o.name.indexOf('白户') !== -1) || { id: null}).id;
    const type2List = type_id ? (await axios.get('/api/product_loan_type', { params: { parent_id: type_id }})).data : [];
    const type2_ids = [];


    let list = (await axios.get('/api/m/product_loan', {
      params: {
        is_enabled: 1,
        is_recommend: 1,
        order: 'sort',
        type_ids__like: `[${type_id}]`,
      }
    })).data;
    this.setState({ list, typeList, type2List, type_id, type2_ids });
  }
}

export default withNavigation(Screen);
