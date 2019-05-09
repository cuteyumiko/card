import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import _ from 'lodash';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setBankCardId: (bankCardId) => dispatch(actions.app.setBankCardId(bankCardId)),
  })
);

class Screen extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>选择银行卡</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View>
          {_.map(this.props.bankCardList, o => (
            <TouchableOpacity key={o.id} onPress={() => {
              this.props.setBankCardId(o.id);
              this.props.navigation.pop();
            }} style={{margin:10, borderRadius:5, overflow:'hidden'}}>
              <LinearGradient style={{padding:10}} colors={[ o.start_color || '#FE7735', o.end_color || '#F43F2C']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{backgroundColor:'#fff', borderRadius:20, padding:5, overflow:'hidden' }}>
                    <Image source={{uri:o.bank_icon}} style={{width:30,height:30 }} />
                  </View>
                  <View style={{marginLeft:10}}>
                    <Text style={{color:'#fff', fontSize:16}}>{o.bank_name}</Text>
                    <Text style={{color:'#fff', fontSize:14}}>储蓄卡</Text>
                  </View>
                </View>

                <Text style={{marginTop:10, marginLeft: 40, color:'#fff'}}>{o.bank_card_no.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(withNavigation(Screen))
