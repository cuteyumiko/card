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
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {_.map(this.state.list, o => (
            <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('cardApply', { id: o.id})} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>

              <Image source={ o.icon ? {uri: o.icon} : require('../../assets/icon-180.png') } style={{width:60, height:60}} />
              <View style={{marginLeft:13, flex:1}}>
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                  <Text style={{fontSize:15,color:'#333333'}}>{o.name} </Text>
                  <View style={{backgroundColor:'#fde0d8', paddingVertical:1, paddingHorizontal:3, borderRadius:2}}>
                    <Text style={{fontSize:10, color:'#ED471C'}}>{o.tip_text}</Text>
                  </View>
                </View>
                <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}>{o.description ? o.description.replace(/\n/, ' ') : ''}</Text>
                <Text style={{color:'#999999', fontSize:12, lineHeight:17, marginTop:2}}><Text style={{fontSize:12, lineHeight:17, color:'#ED471C'}}>{o.got_count}</Text> 人已申请</Text>
              </View>

              <View>
                <Text style={{fontSize:12, lineHeight:17, color:'#FF8800', textAlign:'right'}}>佣金最高{o.max_level_money}元</Text>
                <Text style={{fontSize:14, lineHeight:20, color:'#ED471C', textAlign:'right'}}>立即申请</Text>
              </View>

            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
  async componentDidMount() {
    let list = (await axios.get('/api/m/product_card', { params: {
      is_enabled:1,
      is_recommend:1,
      order:'sort',
    }})).data;


    // list = _.map(list, o => ({
    //   ...o,
    //   property: {},//_(o.property).mapKeys('property_code').mapValues('value').value(),
    // }))
    this.setState({list})
  }
}

export default withNavigation(Screen);
